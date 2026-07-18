import { useLanguage } from '@/hooks';

export function AboutSection() {
    const { t } = useLanguage();

    return (
        <>
            <div className="relative right-1/2 left-1/2 w-screen -translate-x-1/2 bg-[var(--background)] px-8 py-0 sm:px-6 lg:px-20">
                <div className="mx-auto max-w-6xl">
                    <div className="grid items-center gap-12 px-8 py-14 md:px-16 md:py-16 lg:grid-cols-[1.2fr_0.9fr]">
                        <div className="min-w-0 flex-1">
                            <div className="mb-6 flex flex-col items-start gap-2">
                                <img
                                    src="assets/landing-page/logo.png"
                                    alt="POSAVE"
                                    className="ml-16 h-12 w-auto scale-450 object-contain dark:brightness-0 dark:invert"
                                />

                                <span className="text-[13px] font-semibold tracking-[0.1em] text-[var(--secondary-600)] uppercase">
                                    {t('companyProfile.welcome.about.eyebrow')}
                                </span>
                            </div>

                            <h2
                                className="mb-6 text-[42px] leading-[1.15] font-semibold tracking-[0.05em] text-[var(--foreground)]"
                                style={{
                                    WebkitTextStroke: '1px transparent',
                                }}
                            >
                                {t('companyProfile.welcome.about.titleLine1')} <br />
                                <span className="font-semibold">{t('companyProfile.welcome.about.titleLine2')}</span>
                            </h2>

                            <p className="mb-10 max-w-xl text-[16px] leading-9 text-[var(--muted-foreground)]">
                                {t('companyProfile.welcome.about.body')}
                            </p>

                            <button
                                onClick={() => window.history.back()}
                                className="inline-flex cursor-pointer items-center gap-2 border-none bg-transparent p-0 text-[16px] font-semibold text-[var(--foreground)] transition-opacity hover:opacity-70"
                            >
                                {t('companyProfile.welcome.about.button')}
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        </div>

                        <div className="relative min-h-[420px] lg:min-h-[440px]">
                            <div className="absolute -top-5 right-0 h-[430px] w-[360px] overflow-hidden rounded-[30px] shadow-[0_24px_60px_rgba(15,23,42,0.2)] dark:shadow-[0_24px_60px_rgba(0,0,0,0.5)]">
                                <img
                                    src="assets/landing-page/section3b.jpeg"
                                    alt="Kasir toko"
                                    className="h-full w-full object-cover dark:opacity-90"
                                />
                            </div>
                            <div className="absolute -bottom-8 -left-6 h-[270px] w-[210px] overflow-hidden rounded-[28px] shadow-[0_20px_50px_rgba(15,23,42,0.16)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                                <img
                                    src="assets/landing-page/section3a.jpeg"
                                    alt="Tim Posave"
                                    className="h-full w-full object-cover dark:opacity-90"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
