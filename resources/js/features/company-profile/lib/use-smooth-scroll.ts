import { useEffect } from 'react';
import Lenis from 'lenis';

/** Aktifkan smooth-scroll a la Lenis buat halaman ini. Cukup dipanggil sekali di root komponen halaman. */
export function useSmoothScroll() {
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.1,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });

        let rafId: number;
        function raf(time: number) {
            lenis.raf(time);
            rafId = requestAnimationFrame(raf);
        }
        rafId = requestAnimationFrame(raf);

        return () => {
            cancelAnimationFrame(rafId);
            lenis.destroy();
        };
    }, []);
}