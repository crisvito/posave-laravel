import { Head } from '@inertiajs/react';

import { HeadingSmall } from '@/components';
import { useLanguage } from '@/hooks';
import { type BreadcrumbItem } from '@/types';
import { AppearanceTabs, LanguageTabs } from '../components';

import { DashboardLayout, SettingsLayout } from '@/layouts';

export default function Appearance() {
    const { t } = useLanguage();

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('settings.appearance.breadcrumb'),
            href: '/settings/appearance',
        },
    ];

    return (
        <DashboardLayout>
            <Head title={t('settings.appearance.pageTitle')} />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title={t('settings.appearance.heading')} description={t('settings.appearance.description')} />
                    <AppearanceTabs />

                    <HeadingSmall title={t('settings.appearance.languageHeading')} description={t('settings.appearance.languageDescription')} />
                    <LanguageTabs />
                </div>
            </SettingsLayout>
        </DashboardLayout>
    );
}
