import { useLanguage } from '@/hooks';
import { AppLayout } from '@/layouts';
import { Head } from '@inertiajs/react';
import { AnimatedLink } from '../components/animatedLink';
import { FeatureCard } from '../components/featureCard';

export default function Services() {
    const { t } = useLanguage();

    const steps = [
        { no: '1', label: t('companyProfile.services.step1') },
        { no: '2', label: t('companyProfile.services.step2') },
        { no: '3', label: t('companyProfile.services.step3') },
    ];

    return (
        <AppLayout>
            <Head title={t('companyProfile.services.pageTitle')} />

            <div className="py-4 md:py-8">
                <div className="relative mx-4 flex h-[380px] items-center justify-center overflow-hidden rounded-[30px] md:mx-0 md:h-[460px] md:rounded-[40px]">
                    <img src="assets/services/services-banner.png" alt="Pemilik Toko" className="absolute inset-0 h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20"></div>

                    <div className="relative z-10 flex flex-col items-center px-6 text-center">
                        {/* <span className="mb-4 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-semibold tracking-widest text-white uppercase backdrop-blur-sm md:text-sm">
                            {t('companyProfile.services.heroEyebrow')}
                        </span> */}

                        <h1 className="text-3xl leading-tight font-semibold tracking-wide text-white md:text-[56px]">
                            {t('companyProfile.services.heroTitle')}
                        </h1>

                        <p className="mt-3 mb-8 text-base text-white/80 md:mb-10 md:text-[24px]">{t('companyProfile.services.heroSubtitle')}</p>

                        <AnimatedLink
                            href="/register"
                            className="rounded-full bg-[var(--secondary-600)] px-8 py-3 text-lg font-medium text-white shadow-lg md:px-10 md:text-[20px]"
                            hoverBgClass="bg-[var(--secondary-700)]"
                        >
                            {t('companyProfile.services.heroButton')}
                        </AnimatedLink>
                    </div>
                </div>

                <div className="mt-16 mb-16 px-6 md:mt-24 md:mb-20 md:px-20 lg:px-28">
                    <p className="mb-2 text-center text-sm font-semibold tracking-widest text-[var(--secondary-600)] uppercase md:text-base">
                        {t('companyProfile.services.chatEyebrow')}
                    </p>
                    <h2 className="mb-10 text-center text-3xl font-semibold text-[var(--foreground)] md:mb-14 md:text-[44px]">
                        {t('companyProfile.services.chatTitle')}
                    </h2>

                    <div className="flex flex-col-reverse items-center justify-between gap-10 md:flex-row md:gap-12">
                        <div className="flex flex-col items-center text-center md:w-1/2 md:items-start md:text-left">
                            <p className="mb-8 text-base leading-relaxed text-[var(--muted-foreground)] md:text-[20px]">
                                {t('companyProfile.services.chatBody')}
                            </p>
                            <AnimatedLink
                                href="#"
                                className="rounded-full border-2 border-[var(--secondary-600)] bg-transparent px-8 py-3 text-base font-medium text-[var(--secondary-600)] md:text-[18px]"
                                hoverBgClass="bg-[var(--secondary-600)]/10"
                            >
                                {t('companyProfile.services.chatButton')}
                            </AnimatedLink>
                        </div>

                        <div className="flex justify-center md:w-1/2 md:justify-end">
                            <div className="rounded-[28px] bg-[var(--card)] p-4 shadow-lg ring-1 ring-[var(--border)]">
                                <img
                                    src="assets/services/chat-toko.png"
                                    alt="Chat Toko"
                                    className="w-full max-w-[240px] rounded-2xl object-contain md:max-w-[300px]"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mx-4 mb-10 rounded-[30px] bg-[var(--card)] px-5 py-12 ring-1 ring-[var(--border)] md:mx-0 md:rounded-[40px] md:px-12 md:py-16">
                    <div className="mb-16 md:mb-20">
                        <p className="mb-2 text-center text-sm font-semibold tracking-widest text-[var(--secondary-600)] uppercase md:text-base">
                            {t('companyProfile.services.featuresEyebrow')}
                        </p>
                        <h2 className="mb-8 text-center text-3xl font-semibold text-[var(--foreground)] md:mb-10 md:text-[44px]">
                            {t('companyProfile.services.featuresTitle')}
                        </h2>
                        <FeatureCard />
                    </div>

                    <div className="mb-16 md:mb-20">
                        <h2 className="mb-8 text-center text-3xl font-semibold text-[var(--foreground)] md:mb-10 md:text-[44px]">
                            {t('companyProfile.services.howItWorksTitle')}
                        </h2>
                        <div className="flex flex-wrap justify-center gap-4 md:gap-7">
                            {steps.map((step) => (
                                <div
                                    key={step.no}
                                    className="flex w-full items-center gap-4 rounded-2xl bg-[var(--background)] px-6 py-4 ring-1 ring-[var(--border)] sm:w-auto md:px-8 md:py-5"
                                >
                                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--secondary-600)] text-lg font-bold text-white md:h-12 md:w-12 md:text-xl">
                                        {step.no}
                                    </span>
                                    <span className="text-base font-semibold text-[var(--foreground)] md:text-[20px]">{step.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col items-center justify-between gap-8 overflow-hidden rounded-[24px] bg-[var(--primary-900)] p-6 text-center shadow-md md:flex-row md:p-10 md:text-left lg:gap-0 lg:rounded-[30px] lg:p-12">
                        <div className="flex w-full flex-col items-center md:w-[55%] md:items-start lg:w-[60%]">
                            <h2 className="mb-3 text-2xl leading-snug font-semibold text-white sm:text-3xl md:mb-5 lg:text-[40px]">
                                {t('companyProfile.services.ctaTitleLine1')}
                                <br className="hidden lg:block" /> {t('companyProfile.services.ctaTitleLine2')}
                            </h2>

                            <p className="mb-6 px-2 text-[15px] text-[var(--accent-900)] sm:text-base md:mb-8 md:px-0 md:text-lg lg:text-[19px]">
                                {t('companyProfile.services.ctaSubtitle')}
                            </p>

                            <AnimatedLink
                                href="/register"
                                className="inline-block rounded-full bg-[var(--secondary-600)] px-6 py-3 text-base font-medium text-white shadow-md sm:text-lg lg:px-8 lg:py-3.5 lg:text-[22px]"
                                hoverBgClass="bg-[var(--secondary-700)]"
                            >
                                {t('companyProfile.services.ctaButton')}
                            </AnimatedLink>
                        </div>

                        <div className="mt-2 flex w-full justify-center md:mt-0 md:w-[45%] md:justify-end lg:w-[40%]">
                            <img
                                src="assets/services/mulai-sekarang.png"
                                alt="Mulai Sekarang"
                                className="w-full max-w-[260px] rounded-2xl object-cover md:max-w-[300px] lg:max-w-[360px]"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
