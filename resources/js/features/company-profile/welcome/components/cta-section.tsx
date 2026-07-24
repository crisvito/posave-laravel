import { useLanguage } from '@/hooks';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useRef, useState } from 'react';
import { NetworkCanvas, Reveal } from '../../components';

function MagneticButton({ children }: { children: React.ReactNode }) {
    const ref = useRef<HTMLButtonElement>(null);
    const [pos, setPos] = useState({ x: 0, y: 0 });

    return (
        <motion.button
            ref={ref}
            onMouseMove={(e) => {
                const rect = ref.current?.getBoundingClientRect();
                if (!rect) return;
                setPos({
                    x: (e.clientX - rect.left - rect.width / 2) * 0.35,
                    y: (e.clientY - rect.top - rect.height / 2) * 0.35,
                });
            }}
            onMouseLeave={() => setPos({ x: 0, y: 0 })}
            animate={{ x: pos.x, y: pos.y }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 150, damping: 12, mass: 0.4 }}
            className="group relative inline-flex items-center gap-2.5 rounded-full bg-white py-3.5 pr-5 pl-6 text-sm font-medium text-[var(--primary-900)] shadow-[0_16px_45px_-12px_rgba(255,255,255,0.5)] transition-colors hover:bg-white/90"
        >
            {children}
        </motion.button>
    );
}

export function CtaSection() {
    const { t } = useLanguage();

    return (
        <div className="relative mx-auto max-w-6xl overflow-hidden py-28 text-center sm:py-36">
            <motion.img
                src="assets/landing-page/gambarbottom.jpeg"
                alt=""
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute inset-0 -z-20 h-full w-full object-cover"
            />

            <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[var(--primary-900)]/50 via-[var(--primary-900)]/85 to-[var(--primary-900)]" />

            <div className="absolute inset-0 -z-10 opacity-30 mix-blend-screen">
                <NetworkCanvas dotColor="255,255,255" lineColor="255,255,255" density={70} />
            </div>

            <div className="relative z-10 mx-auto max-w-lg px-6">
                <Reveal>
                    <img src="assets/landing-page/logo.png" alt="POSAVE" className="mx-auto h-10 mb-5 w-auto object-contain brightness-0 invert" />
                </Reveal>

                <Reveal delay={0.1}>
                    <h2 className="text-3xl leading-[1.2] font-semibold tracking-tight text-white sm:text-4xl">
                        {t('companyProfile.welcome.cta.title')}
                    </h2>
                </Reveal>

                <Reveal delay={0.2}>
                    <div className="mt-9 flex justify-center">
                        <MagneticButton>
                            {t('companyProfile.welcome.cta.button')}
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--primary-900)]/10 transition-transform group-hover:translate-x-0.5">
                                <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.5} />
                            </span>
                        </MagneticButton>
                    </div>
                </Reveal>
            </div>
        </div>
    );
}
