import { useLanguage } from '@/hooks';
import { AppLayout } from '@/layouts';
import { Head } from '@inertiajs/react';
import { AnimatedLink } from '../components/animatedLink';
import { FeatureCard } from '../components/featureCard';

// Pastikan lokasi import di bawah ini sesuai dengan tempat kamu menyimpan file-nya
import { Reveal } from '../../components';
import { useSmoothScroll } from '../../lib/use-smooth-scroll';

export default function Services() {
    const { t } = useLanguage();

    // Mengaktifkan smooth scroll untuk halaman ini
    useSmoothScroll();

    const steps = [
        { no: '1', label: t('companyProfile.services.step1') },
        { no: '2', label: t('companyProfile.services.step2') },
        { no: '3', label: t('companyProfile.services.step3') },
    ];

    return (
        <AppLayout>
            <Head title={t('companyProfile.services.pageTitle')} />

            {/* 
              Bungkus utama dengan padding atas-bawah.
              Kita gunakan mx-auto dan max-w-6xl di setiap section agar rapi di tengah.
            */}
            <div className="py-8 md:py-12">
                {/* --- 1. HERO SECTION --- */}
                <div className="mx-auto max-w-6xl">
                    <Reveal y={40}>
                        <div className="relative flex min-h-[500px] w-full items-center justify-center overflow-hidden rounded-[2rem] shadow-2xl md:min-h-[600px] md:rounded-[3rem]">
                            <img
                                src="assets/services/services-banner.png"
                                alt="Pemilik Toko"
                                className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 hover:scale-105"
                            />
                            {/* Gradient yang lebih halus */}
                            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/80"></div>

                            <div className="relative z-10 flex flex-col items-center px-6 text-center">
                                <h1 className="mb-4 text-4xl leading-tight font-bold tracking-tight text-white md:text-6xl lg:text-[72px]">
                                    {t('companyProfile.services.heroTitle')}
                                </h1>

                                <p className="mb-10 max-w-2xl text-lg text-white/90 md:text-2xl">{t('companyProfile.services.heroSubtitle')}</p>

                                <AnimatedLink
                                    href="/register"
                                    className="rounded-full bg-[var(--secondary-600)] px-10 py-4 text-lg font-semibold text-white shadow-xl transition-all hover:-translate-y-1 md:text-xl"
                                    hoverBgClass="bg-[var(--secondary-700)]"
                                >
                                    {t('companyProfile.services.heroButton')}
                                </AnimatedLink>
                            </div>
                        </div>
                    </Reveal>
                </div>

                {/* --- 2. CHAT SECTION --- */}
                <div className="mx-auto max-w-6xl px-6 py-20 md:py-32">
                    <div className="flex flex-col-reverse items-center justify-between gap-16 md:flex-row md:gap-12">
                        <div className="flex w-full flex-col items-center text-center md:w-1/2 md:items-start md:text-left">
                            <Reveal delay={0.1}>
                                <p className="mb-3 text-sm font-bold tracking-widest text-[var(--secondary-600)] uppercase md:text-base">
                                    {t('companyProfile.services.chatEyebrow')}
                                </p>
                                <h2 className="mb-6 text-3xl leading-tight font-bold text-[var(--foreground)] md:mb-8 md:text-5xl">
                                    {t('companyProfile.services.chatTitle')}
                                </h2>
                                <p className="mb-10 text-lg leading-relaxed text-[var(--muted-foreground)] md:text-xl">
                                    {t('companyProfile.services.chatBody')}
                                </p>
                                <AnimatedLink
                                    href="#"
                                    className="rounded-full border-2 border-[var(--secondary-600)] bg-transparent px-8 py-3 text-base font-semibold text-[var(--secondary-600)] transition-all hover:shadow-lg md:px-10 md:text-lg"
                                    hoverBgClass="bg-[var(--secondary-600)]/10"
                                >
                                    {t('companyProfile.services.chatButton')}
                                </AnimatedLink>
                            </Reveal>
                        </div>

                        <div className="flex w-full justify-center md:w-1/2 md:justify-end">
                            <Reveal delay={0.3}>
                                {/* Efek bingkai bayangan di belakang gambar */}
                                <div className="relative">
                                    <div className="absolute -inset-4 rounded-[2.5rem] bg-[var(--secondary-600)]/10 blur-xl"></div>
                                    <div className="relative rounded-[2rem] bg-[var(--card)] p-4 shadow-xl ring-1 ring-[var(--border)]">
                                        <img
                                            src="assets/services/chat-toko.png"
                                            alt="Chat Toko"
                                            className="w-full max-w-[260px] rounded-xl object-contain md:max-w-[320px]"
                                        />
                                    </div>
                                </div>
                            </Reveal>
                        </div>
                    </div>
                </div>

                {/* --- 3. FEATURES SECTION --- */}
                <div className="mx-4 max-w-6xl bg-[var(--card)] py-20 shadow-sm ring-1 ring-[var(--border)] sm:rounded-[3rem] md:mx-auto md:px-12">
                    <div className="mx-auto max-w-5xl px-6">
                        <Reveal className="mb-16 text-center md:mb-20">
                            <p className="mb-3 text-sm font-bold tracking-widest text-[var(--secondary-600)] uppercase md:text-base">
                                {t('companyProfile.services.featuresEyebrow')}
                            </p>
                            <h2 className="text-3xl font-bold text-[var(--foreground)] md:text-5xl">{t('companyProfile.services.featuresTitle')}</h2>
                        </Reveal>

                        <Reveal delay={0.2}>
                            <FeatureCard />
                        </Reveal>
                    </div>
                </div>

                {/* --- 4. HOW IT WORKS SECTION --- */}
                <div className="mx-auto max-w-6xl px-6 py-20 md:py-32">
                    <Reveal className="mb-12 text-center md:mb-16">
                        <h2 className="text-3xl font-bold text-[var(--foreground)] md:text-5xl">{t('companyProfile.services.howItWorksTitle')}</h2>
                    </Reveal>

                    {/* Menggunakan Grid agar kotak langkah-langkah sama besar dan rapi */}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 md:gap-8">
                        {steps.map((step, index) => (
                            <Reveal key={step.no} delay={index * 0.15}>
                                <div className="flex h-full flex-col items-center justify-center rounded-[2rem] bg-[var(--card)] p-8 text-center ring-1 ring-[var(--border)] transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl">
                                    <span className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--secondary-600)] text-2xl font-bold text-white shadow-lg">
                                        {step.no}
                                    </span>
                                    <span className="text-lg font-bold text-[var(--foreground)] md:text-xl">{step.label}</span>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>

                {/* --- 5. CALL TO ACTION SECTION --- */}
                <div className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
                    <Reveal>
                        <div className="relative flex flex-col items-center justify-between gap-10 overflow-hidden rounded-[2.5rem] bg-[var(--primary-900)] p-10 text-center shadow-2xl md:flex-row md:p-14 md:text-left lg:p-20">
                            {/* Hiasan background abstrak di dalam kotak */}
                            <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/5 blur-3xl"></div>

                            <div className="relative z-10 flex w-full flex-col items-center md:w-3/5 md:items-start">
                                <h2 className="mb-4 text-3xl leading-tight font-bold text-white sm:text-4xl lg:text-5xl">
                                    {t('companyProfile.services.ctaTitleLine1')}
                                    <br className="hidden md:block" /> {t('companyProfile.services.ctaTitleLine2')}
                                </h2>

                                <p className="mb-8 text-base text-white/80 md:text-lg lg:text-xl">{t('companyProfile.services.ctaSubtitle')}</p>

                                <AnimatedLink
                                    href="/register"
                                    className="inline-block rounded-full bg-[var(--secondary-600)] px-8 py-4 text-lg font-semibold text-white shadow-lg transition-transform hover:-translate-y-1 lg:px-10 lg:text-xl"
                                    hoverBgClass="bg-[var(--secondary-700)]"
                                >
                                    {t('companyProfile.services.ctaButton')}
                                </AnimatedLink>
                            </div>

                            <div className="relative z-10 flex w-full justify-center md:w-2/5 md:justify-end">
                                <img
                                    src="assets/services/mulai-sekarang.png"
                                    alt="Mulai Sekarang"
                                    className="w-full max-w-[280px] rounded-2xl object-cover shadow-2xl transition-transform duration-500 hover:scale-105 hover:rotate-2 lg:max-w-[340px]"
                                />
                            </div>
                        </div>
                    </Reveal>
                </div>
            </div>
        </AppLayout>
    );
}
