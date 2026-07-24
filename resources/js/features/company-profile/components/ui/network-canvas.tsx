import { useEffect, useRef } from 'react';

interface NetworkCanvasProps {
    className?: string;
    dotColor?: string;
    lineColor?: string;
    density?: number;
}

/** Background jaringan titik-garis yang bergerak pelan — dipakai sebagai aksen di 1 section aja, biar gak berlebihan. */
export function NetworkCanvas({ className = '', dotColor = '59,130,246', lineColor = '59,130,246', density = 60 }: NetworkCanvasProps) {
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

            const count = Math.min(density, Math.floor((width * height) / 18000));
            points.length = 0;
            for (let i = 0; i < count; i++) {
                points.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx: (Math.random() - 0.5) * 0.25,
                    vy: (Math.random() - 0.5) * 0.25,
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
                    if (dist < 140) {
                        ctx.strokeStyle = `rgba(${lineColor}, ${0.12 * (1 - dist / 140)})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(points[i].x, points[i].y);
                        ctx.lineTo(points[j].x, points[j].y);
                        ctx.stroke();
                    }
                }
            }

            for (const p of points) {
                ctx.fillStyle = `rgba(${dotColor}, 0.5)`;
                ctx.beginPath();
                ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2);
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
    }, [density, dotColor, lineColor]);

    return <canvas ref={canvasRef} className={`pointer-events-none absolute inset-0 ${className}`} />;
}
