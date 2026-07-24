import { useLanguage } from '@/hooks';
import { motion } from 'framer-motion';
import { HeartHandshake, LayoutGrid, Sparkles } from 'lucide-react';
import { Reveal } from '../../components';

export function WhySection() {
    const { t } = useLanguage();

    const points = [
        { Icon: Sparkles, title: t('companyProfile.welcome.why.feature1Title'), body: t('companyProfile.welcome.why.feature1Body') },
        { Icon: LayoutGrid, title: t('companyProfile.welcome.why.feature2Title'), body: t('companyProfile.welcome.why.feature2Body') },
        { Icon: HeartHandshake, title: t('companyProfile.welcome.why.feature3Title'), body: t('companyProfile.welcome.why.feature3Body') },
    ];

    return (
        <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24 lg:px-8 lg:py-28">
            <Reveal>
                <h2 className="mb-14 max-w-lg text-3xl leading-[1.2] font-semibold tracking-tight text-white sm:text-4xl lg:mb-16">
                    {t('companyProfile.welcome.why.titleLine1')}
                </h2>
            </Reveal>

            <div className="grid gap-x-10 gap-y-6 lg:grid-cols-2">
                <Reveal delay={0.1} className="h-full">
                    <div className="flex h-full flex-col">
                        <div className="relative min-h-[260px] flex-1 overflow-hidden rounded-[28px] shadow-[0_30px_70px_-25px_rgba(0,0,0,0.6)]">
                            <img
                                src="assets/landing-page/kenapa-posave.jpeg"
                                alt="Kenapa Pilih Posave"
                                className="absolute inset-0 h-full w-full object-cover object-[center_-100px]"
                            />
                        </div>

                        <div className="relative z-10 mx-4 -mt-10 rounded-2xl border border-white/15 bg-[var(--primary-800)] p-6 shadow-[0_20px_45px_-20px_rgba(0,0,0,0.8)] sm:mx-6">
                            <p className="text-[14px] leading-relaxed text-white/75">
                                <span className="font-semibold text-white">{t('companyProfile.welcome.why.bodyBrand')}</span>{' '}
                                {t('companyProfile.welcome.why.body')}
                            </p>
                        </div>
                    </div>
                </Reveal>

                <div className="flex flex-col gap-4">
                    {points.map(({ Icon, title, body }, index) => (
                        <Reveal key={index} delay={0.15 + index * 0.1}>
                            <motion.div
                                whileHover={{ x: 6 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                                className="group flex items-start gap-5 rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-colors duration-300 hover:border-[var(--secondary-600)]/40 hover:bg-white/[0.06]"
                            >
                                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-[var(--secondary-600)] shadow-[0_10px_25px_-10px_var(--secondary-600)] transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
                                    <Icon className="h-5 w-5 text-white" strokeWidth={1.75} />
                                </div>
                                <div>
                                    <h4 className="mb-1.5 text-[15px] font-semibold text-white">{title}</h4>
                                    <p className="text-sm leading-relaxed text-white/60">{body}</p>
                                </div>
                            </motion.div>
                        </Reveal>
                    ))}
                </div>
            </div>
        </div>
    );
}
