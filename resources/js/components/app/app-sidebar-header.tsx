import { AskChatbotButton, SidebarTrigger } from '@/components';
import { useChatbot } from '@/features/chatbot';

interface AppSidebarHeaderProps {
    title?: string;
    description?: string;
}

export function AppSidebarHeader({ title, description }: AppSidebarHeaderProps) {
    const { open } = useChatbot();
    return (
        <header className="border-sidebar-border/50 sticky top-0 z-[5] border-b bg-[var(--primary-900)]/95 text-white backdrop-blur dark:border-[var(--border-strong)] dark:bg-[var(--background)]/95">
            <div className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-4">
                    <SidebarTrigger className="mt-1" />

                    <div>
                        <h1 className="text-3xl font-bold">{title}</h1>
                        <p className="mt-1 text-sm opacity-80">{description}</p>
                    </div>
                </div>

                <AskChatbotButton className="ml-auto" />
            </div>
        </header>
    );
}
