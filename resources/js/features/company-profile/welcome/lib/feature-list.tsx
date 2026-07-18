import { useLanguage } from '@/hooks';

export function useFeatures() {
    const { t } = useLanguage();

    return [
        {
            title: t('companyProfile.welcome.features.liteAdvanced.title'),
            desc: t('companyProfile.welcome.features.liteAdvanced.desc'),
            image: 'fitur1.png',
            icon: (
                <svg
                    viewBox="0 0 24 24"
                    width={52}
                    height={52}
                    fill="none"
                    stroke="var(--accent-900)"
                    strokeWidth={1.4}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M12 2a5 5 0 0 1 5 5c0 2-1 3.5-2.5 4.5M7 7a5 5 0 0 0 5 5" />
                    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                    <path d="M9 9l6-6M15 9l-6-6" />
                </svg>
            ),
        },
        {
            title: t('companyProfile.welcome.features.aiAssistant.title'),
            desc: t('companyProfile.welcome.features.aiAssistant.desc'),
            image: 'fitur2.png',
            icon: (
                <svg
                    viewBox="0 0 24 24"
                    width={52}
                    height={52}
                    fill="none"
                    stroke="var(--accent-900)"
                    strokeWidth={1.4}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <rect x="4" y="6" width="16" height="12" rx="3" />
                    <path d="M9 10h.01M12 10h.01M15 10h.01" />
                    <path d="M9 6V4M15 6V4" />
                    <circle cx="9" cy="14" r="0.8" fill="var(--accent-900)" stroke="none" />
                    <circle cx="12" cy="14" r="0.8" fill="var(--accent-900)" stroke="none" />
                    <circle cx="15" cy="14" r="0.8" fill="var(--accent-900)" stroke="none" />
                </svg>
            ),
        },
        {
            title: t('companyProfile.welcome.features.realtimeReports.title'),
            desc: t('companyProfile.welcome.features.realtimeReports.desc'),
            image: 'fitur3.png',
            icon: (
                <svg
                    viewBox="0 0 24 24"
                    width={52}
                    height={52}
                    fill="none"
                    stroke="var(--accent-900)"
                    strokeWidth={1.4}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <polyline points="8 15 10 17 16 11" />
                </svg>
            ),
        },
    ];
}
