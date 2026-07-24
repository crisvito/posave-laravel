import { useLanguage } from '@/hooks';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Reveal } from '../../components';
import { useFeatures } from '../lib';

type Feature = ReturnType<typeof useFeatures>[number];

function FeatureCard({ feature, index }: { feature: Feature; index: number }) {
    const [pos, setPos] = useState({ x: 50, y: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setPos({
            x: ((e.clientX - rect.left) / rect.width) * 100,
            y: ((e.clientY - rect.top) / rect.height) * 100,
        });
    };

    return (
        <Reveal delay={0.08 * index}>
            <motion.div
                onMouseMove={handleMouseMove}
                whileHover={{ y: -8 }}
                transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/12 bg-white/[0.05] p-8 shadow-[0_0_0_0_transparent] transition-[border-color,box-shadow] duration-500 hover:border-[var(--secondary-600)]/40 hover:shadow-[0_25px_60px_-30px_var(--secondary-600)]"
            >
                {/* cursor-follow spotlight */}
                <div
                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{
                        background: `radial-gradient(260px circle at ${pos.x}% ${pos.y}%, color-mix(in srgb, var(--secondary-600) 20%, transparent), transparent 70%)`,
                    }}
                />

                {/* top accent line */}
                <div className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-gradient-to-r from-transparent via-[var(--secondary-600)] to-transparent transition-transform duration-500 group-hover:scale-x-100" />

                <div className="relative">
                    <motion.div
                        whileHover={{ rotate: -8, scale: 1.08 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 14 }}
                        style={{ '--accent-900': '#ffffff' } as React.CSSProperties}
                        className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--secondary-600)]/15 transition-colors duration-300 group-hover:bg-[var(--secondary-600)]/25"
                    >
                        {feature.image ? (
                            <img
                                src={`assets/landing-page/${feature.image}`}
                                alt={feature.title}
                                className="h-6 w-6 object-contain brightness-0 invert"
                            />
                        ) : (
                            feature.icon
                        )}
                    </motion.div>

                    <p className="mb-2 text-[15px] font-semibold text-white">{feature.title}</p>
                    <p className="text-sm leading-relaxed text-white/60">{feature.desc}</p>
                </div>
            </motion.div>
        </Reveal>
    );
}

export function FeaturesSection() {
    const { t } = useLanguage();
    const features = useFeatures();

    return (
        <div className="mx-auto max-w-7xl px-6 py-20 sm:py-24 lg:px-8 lg:py-28">
            <div className="mx-auto max-w-xl text-center">
                <Reveal>
                    <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">{t('companyProfile.welcome.features.title')}</h2>
                </Reveal>
                <Reveal delay={0.1}>
                    <p className="mt-4 text-[15px] leading-relaxed text-white/60">{t('companyProfile.welcome.features.subtitle')}</p>
                </Reveal>
            </div>

            <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-5 sm:grid-cols-3">
                {features.map((feature, index) => (
                    <FeatureCard key={index} feature={feature} index={index} />
                ))}
            </div>
        </div>
    );
}
