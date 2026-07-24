import { useLanguage } from '@/hooks';

const PARTNERS = [
    { src: 'assets/landing-page/serona.png', alt: 'Serona' },
    { src: 'assets/landing-page/viktorifit.png', alt: 'Viktorifit' },
    { src: 'assets/landing-page/studysphere.png', alt: 'Studysphere' },
];

export function PartnerSection() {
    const { t } = useLanguage();
    const track = [...PARTNERS, ...PARTNERS];

    return (
        <div className="mx-auto max-w-7xl px-6 py-20 sm:py-24 lg:px-8 lg:py-28">
            <div className="mx-auto mb-14 max-w-xl text-center">
                <h2 className="text-3xl leading-[1.2] font-semibold tracking-tight text-[var(--neutral-white)] sm:text-4xl">
                    {t('companyProfile.welcome.partners.title')}
                </h2>
                <p className="mt-4 text-[15px] text-white/60">{t('companyProfile.welcome.partners.subtitle')}</p>
            </div>

            <div className="group relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
                <div className="posave-marquee-track flex w-max items-center gap-20 group-hover:[animation-play-state:paused]">
                    {track.map((partner, index) => (
                        <div key={index} className="flex h-24 w-40 flex-shrink-0 items-center justify-center">
                            <img
                                src={partner.src}
                                alt={partner.alt}
                                className="max-h-20 max-w-[150px] object-contain opacity-60 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
                            />
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
                .posave-marquee-track {
                    animation: posave-marquee 26s linear infinite;
                }
                @keyframes posave-marquee {
                    from { transform: translateX(0); }
                    to { transform: translateX(-50%); }
                }
            `}</style>
        </div>
    );
}
