import '@fontsource/poppins/400.css';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';

import '../css/app.css';

import { MessagingNotificationsProvider } from '@/features/messaging/notifications-context';
import { createInertiaApp } from '@inertiajs/react';
import { configureEcho, echo } from '@laravel/echo-react';
import axios from 'axios';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { route as routeFn } from 'ziggy-js';
import { initializeTheme } from './features/settings/hooks/use-appearance';
import { LanguageProvider } from './hooks/use-language';

configureEcho({
    broadcaster: 'reverb',
    key: import.meta.env.VITE_REVERB_APP_KEY,
    wsHost: import.meta.env.VITE_REVERB_HOST,
    wsPort: import.meta.env.VITE_REVERB_PORT ?? 8080,
    wssPort: import.meta.env.VITE_REVERB_PORT ?? 443,
    forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'http') === 'https',
    enabledTransports: ['ws', 'wss'],
});
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

axios.interceptors.request.use((config) => {
    const socketId = echo().socketId();
    if (socketId) {
        config.headers['X-Socket-Id'] = socketId;
    }
    return config;
});

declare global {
    const route: typeof routeFn;
}

const appName = import.meta.env.VITE_APP_NAME || 'Posave';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: async (name) => {
        const parts = name.split('/');
        const pageName = parts.pop();
        const folderPath = parts.join('/');
        const path = folderPath ? `./features/${folderPath}/pages/${pageName}.tsx` : `./features/${pageName}/pages/${pageName}.tsx`;

        const page = (await resolvePageComponent(path, import.meta.glob('./features/**/pages/**/*.tsx'))) as {
            default: React.ComponentType<Record<string, unknown>>;
        };
        const PageComponent = page.default;

        const WrappedComponent = (props: Record<string, unknown>) => (
            <MessagingNotificationsProvider>
                <PageComponent {...props} />
            </MessagingNotificationsProvider>
        );

        return { ...page, default: WrappedComponent };
    },
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(
            <LanguageProvider>
                <App {...props} />
            </LanguageProvider>,
        );
    },
    progress: {
        color: '#4B5563',
    },
});

initializeTheme();
