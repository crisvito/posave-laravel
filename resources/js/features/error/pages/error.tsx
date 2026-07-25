import { useLanguage } from '@/hooks';
import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { AlertTriangle, FileQuestion, ServerCrash, ShieldAlert } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface ErrorPageProps {
    status: number;
}

const STATUS_META: Record<number, { icon: typeof AlertTriangle; titleKey: string; bodyKey: string }> = {
    403: { icon: ShieldAlert, titleKey: 'shared.error.403.title', bodyKey: 'shared.error.403.body' },
    404: { icon: FileQuestion, titleKey: 'shared.error.404.title', bodyKey: 'shared.error.404.body' },
    500: { icon: ServerCrash, titleKey: 'shared.error.500.title', bodyKey: 'shared.error.500.body' },
    503: { icon: AlertTriangle, titleKey: 'shared.error.503.title', bodyKey: 'shared.error.503.body' },
};

function NetworkBackdrop() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = 0;
        let height = 0;
        let animationId: number;
        const points: { x: number; y: number; vx: number; vy: number }[] = [];

        const resize = () => {
            const parent = canvas.parentElement;
            if (!parent) return;
            width = parent.clientWidth;
            height = parent.clientHeight;
            canvas.width = width * window.devicePixelRatio;
            canvas.height = height * window.devicePixelRatio;
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

            const count = Math.min(45, Math.floor((width * height) / 20000));
            points.length = 0;
            for (let i = 0; i < count; i++) {
                points.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx: (Math.random() - 0.5) * 0.2,
                    vy: (Math.random() - 0.5) * 0.2,
                });
            }
        };

        const draw = () => {
            ctx.clearRect(0, 0, width, height);

            for (const p of points) {
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0 || p.x > width) p.vx *= -1;
                if (p.y < 0 || p.y > height) p.vy *= -1;
            }

            for (let i = 0; i < points.length; i++) {
                for (let j = i + 1; j < points.length; j++) {
                    const dx = points[i].x - points[j].x;
                    const dy = points[i].y - points[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 130) {
                        ctx.strokeStyle = `rgba(59, 130, 246, ${0.1 * (1 - dist / 130)})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(points[i].x, points[i].y);
                        ctx.lineTo(points[j].x, points[j].y);
                        ctx.stroke();
                    }
                }
            }

            for (const p of points) {
                ctx.fillStyle = 'rgba(59, 130, 246, 0.4)';
                ctx.beginPath();
                ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
                ctx.fill();
            }

            animationId = requestAnimationFrame(draw);
        };

        resize();
        draw();
        window.addEventListener('resize', resize);

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationId);
        };
    }, []);

    return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0" />;
}

export default function ErrorPage({ status }: ErrorPageProps) {
    const { t } = useLanguage();
    const meta = STATUS_META[status] ?? STATUS_META[500];
    const Icon = meta.icon;

    return (
        <div className="relative flex min-h-screen items-center overflow-hidden bg-[var(--page-bg)] px-6 sm:px-10 lg:px-20 dark:bg-[var(--background)]">
            <NetworkBackdrop />
            <Head title="error" />
            <span
                aria-hidden
                className="pointer-events-none absolute top-1/2 right-[-4%] -translate-y-1/2 text-[clamp(14rem,32vw,26rem)] leading-none font-bold text-[var(--border-strong)]/40 select-none"
            >
                {status}
            </span>

            <div className="relative z-10 max-w-lg">
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
                    <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--secondary-600)]/10">
                        <Icon className="h-7 w-7 text-[var(--secondary-600)]" />
                    </div>

                    <p className="mb-2 text-sm font-semibold tracking-wide text-[var(--secondary-600)]">
                        {t('shared.error.eyebrowPrefix')} {status}
                    </p>
                    <h1 className="text-4xl leading-tight font-semibold tracking-tight text-[var(--subheading)] sm:text-5xl">{t(meta.titleKey)}</h1>
                    <p className="mt-4 max-w-md text-[15px] leading-relaxed text-[var(--grey-text)]">{t(meta.bodyKey)}</p>
                    <a
                        href="/"
                        className="mt-8 inline-flex items-center rounded-full bg-[var(--secondary-600)] px-7 py-3 text-sm font-medium text-white transition-colors hover:bg-[var(--secondary-700)]"
                    >
                        {t('shared.error.backButton')}
                    </a>
                </motion.div>
            </div>
        </div>
    );
}
