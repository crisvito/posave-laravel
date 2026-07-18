import { useLanguage } from '@/hooks';

export const FeatureCard = () => {
    const { t } = useLanguage();

    const features = [
        {
            id: 1,
            iconSrc: '/assets/services/chatbot.png',
            title: t('companyProfile.services.features.chatbot.title'),
            description: t('companyProfile.services.features.chatbot.desc'),
        },
        {
            id: 2,
            iconSrc: '/assets/services/laporan.png',
            title: t('companyProfile.services.features.reports.title'),
            description: t('companyProfile.services.features.reports.desc'),
        },
        {
            id: 3,
            iconSrc: '/assets/services/mode.png',
            title: t('companyProfile.services.features.modes.title'),
            description: t('companyProfile.services.features.modes.desc'),
            iconClassName: 'h-14',
        },
        {
            id: 4,
            iconSrc: '/assets/services/transaksi.png',
            title: t('companyProfile.services.features.transactions.title'),
            description: t('companyProfile.services.features.transactions.desc'),
        },
    ];

    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
                <div
                    key={feature.id}
                    className="flex h-full min-h-[280px] flex-col items-center rounded-[30px] bg-[var(--neutral-white)] p-6 text-center shadow-sm drop-shadow-[2px_3px_6px_rgba(0,0,0,0.25)]"
                >
                    <div className="mb-4 flex h-24 items-center justify-center">
                        <img src={feature.iconSrc} alt={feature.title} className={feature.iconClassName || 'h-20'} />
                    </div>

                    <div className="flex min-h-[64px] w-full items-start justify-center">
                        <h4 className="text-[20px] leading-snug font-medium text-[var(--primary-900)] lg:text-[22px]">{feature.title}</h4>
                    </div>

                    <p className="mt-2 text-[16px] text-[var(--primary-600)] lg:text-[18px]">{feature.description}</p>
                </div>
            ))}
        </div>
    );
};
