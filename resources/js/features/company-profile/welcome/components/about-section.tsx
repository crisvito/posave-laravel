import { useLanguage } from '@/hooks';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useRef } from 'react';
import { Reveal } from '../../components';

export function AboutSection() {
    const { t } = useLanguage();
    const stackRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: stackRef, offset: ['start end', 'end start'] });
    const yBack = useTransform(scrollYProgress, [0, 1], [-18, 18]);
    const yFront = useTransform(scrollYProgress, [0, 1], [18, -18]);

    return (
        <div className="mx-auto max-w-7xl px-6 py-20 sm:py-24 lg:px-8 lg:py-28">
            <div className="grid items-center gap-16 lg:grid-cols-[1fr_0.9fr] lg:gap-20">
                <Reveal delay={0.1} className="order-2 lg:order-1">
                    <div ref={stackRef} className="relative mx-auto h-[420px] w-full max-w-md lg:h-[460px]">
                        <div className="absolute -top-6 -left-6 -z-10 h-40 w-40 rounded-full bg-[var(--secondary-600)]/10 blur-3xl" />

                        <motion.div
                            style={{ y: yBack }}
                            className="absolute top-0 right-0 h-[78%] w-[72%] overflow-hidden rounded-[26px] shadow-[0_30px_60px_-20px_rgba(15,23,42,0.28)] dark:shadow-[0_30px_60px_-20px_rgba(0,0,0,0.7)]"
                        >
                            <img src="assets/landing-page/section3b.jpeg" alt="Kasir toko" className="h-full w-full object-cover dark:opacity-90" />
                        </motion.div>

                        <motion.div
                            style={{ y: yFront }}
                            className="absolute bottom-0 left-0 h-[56%] w-[48%] overflow-hidden rounded-[22px] border-4 border-[var(--background)] shadow-[0_24px_50px_-18px_rgba(15,23,42,0.25)] dark:shadow-[0_24px_50px_-18px_rgba(0,0,0,0.7)]"
                        >
                            <img src="assets/landing-page/section3a.jpeg" alt="Tim Posave" className="h-full w-full object-cover dark:opacity-90" />
                        </motion.div>
                    </div>
                </Reveal>

                <div className="order-1 min-w-0 lg:order-2">
                    <Reveal>
                        <div className="mb-5 flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-[var(--secondary-600)]" />
                            <span className="text-[11px] font-medium tracking-[0.14em] text-[var(--secondary-600)] uppercase">
                                {t('companyProfile.welcome.about.eyebrow')}
                            </span>
                        </div>
                    </Reveal>

                    <Reveal delay={0.1}>
                        <h2 className="mb-6 text-3xl leading-[1.2] font-semibold tracking-tight text-[var(--foreground)] sm:text-4xl">
                            {t('companyProfile.welcome.about.titleLine1')} <br />
                            {t('companyProfile.welcome.about.titleLine2')}
                        </h2>
                    </Reveal>

                    <Reveal delay={0.2}>
                        <p className="mb-9 max-w-xl text-[15px] leading-relaxed text-[var(--muted-foreground)]">
                            {t('companyProfile.welcome.about.body')}
                        </p>
                    </Reveal>

                    <Reveal delay={0.3}>
                        <button
                            onClick={() => window.history.back()}
                            className="group inline-flex cursor-pointer items-center gap-2 border-none bg-transparent p-0 text-[15px] font-semibold text-[var(--foreground)]"
                        >
                            <span className="border-b border-transparent pb-0.5 transition-colors group-hover:border-[var(--foreground)]">
                                {t('companyProfile.welcome.about.button')}
                            </span>
                            <ArrowUpRight
                                className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                                strokeWidth={2.25}
                            />
                        </button>
                    </Reveal>
                </div>
            </div>
        </div>
    );
}
