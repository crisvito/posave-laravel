import { useLanguage } from '@/hooks';
import { Link } from '@inertiajs/react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useRef } from 'react';
import { Reveal } from '../../components';

export function WelcomeSection() {
    const { t } = useLanguage();
    const imageRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: imageRef,
        offset: ['start end', 'end start'],
    });
    const y = useTransform(scrollYProgress, [0, 1], [-24, 24]);

    return (
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid grid-cols-1 items-center gap-16 py-20 sm:py-24 lg:grid-cols-2 lg:gap-20 lg:py-20">
                <div className="max-w-xl">
                    <Reveal>
                        <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border-strong)] bg-[var(--card)] px-4 py-1.5 text-[11px] font-medium tracking-[0.14em] text-[var(--secondary-600)] uppercase">
                            <span className="h-1.5 w-1.5 rounded-full bg-[var(--secondary-600)]" />
                            {t('companyProfile.welcome.hero.eyebrow')}
                        </span>
                    </Reveal>

                    <Reveal delay={0.1}>
                        <h1 className="mt-6 text-4xl leading-[1.15] font-semibold tracking-tight text-[var(--foreground)] sm:text-5xl lg:text-[3.25rem]">
                            {t('companyProfile.welcome.hero.titleLine1')}
                            <br />
                            <span className="text-[var(--secondary-600)]">{t('companyProfile.welcome.hero.titleLine2')}</span>
                        </h1>
                    </Reveal>

                    <Reveal delay={0.2}>
                        <p className="mt-6 max-w-md text-[15px] leading-relaxed text-[var(--muted-foreground)]">
                            {t('companyProfile.welcome.hero.subtitleLine1')} {t('companyProfile.welcome.hero.subtitleLine2')}
                        </p>
                    </Reveal>

                    <Reveal delay={0.3}>
                        <Link href={route('login')}>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="group mt-9 inline-flex items-center gap-2.5 rounded-full bg-[var(--secondary-600)] py-3.5 pr-5 pl-6 text-sm font-medium text-white shadow-[0_12px_30px_-10px_var(--secondary-600)] transition-colors hover:bg-[var(--secondary-700)]"
                            >
                                {t('companyProfile.welcome.hero.button')}
                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/15 transition-transform group-hover:translate-x-0.5">
                                    <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.5} />
                                </span>
                            </motion.button>
                        </Link>
                    </Reveal>
                </div>

                <Reveal delay={0.15} className="relative mx-auto w-full max-w-md lg:max-w-none">
                    <div className="absolute -top-8 -right-6 -z-10 h-44 w-44 rounded-full bg-[var(--secondary-600)]/10 blur-3xl" />
                    <div className="absolute top-8 -left-5 -z-10 h-40 w-[85%] rounded-[28px] border border-[var(--border-strong)]" />

                    <div
                        ref={imageRef}
                        className="relative overflow-hidden rounded-[28px] shadow-[0_30px_70px_-25px_rgba(15,23,42,0.35)] dark:shadow-[0_30px_70px_-25px_rgba(0,0,0,0.7)]"
                    >
                        <motion.img
                            style={{ y }}
                            src="assets/landing-page/landingpage_bgtop.jpeg"
                            alt="POSAVE"
                            className="h-[380px] w-full scale-110 object-cover sm:h-[440px]"
                        />
                    </div>
                </Reveal>
            </div>
        </div>
    );
}
