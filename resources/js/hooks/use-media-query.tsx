import { useEffect, useState } from 'react';

/** Reaktif terhadap resize/orientation change, beda sama window.innerWidth yang cuma snapshot sesaat. */
export function useMediaQuery(query: string): boolean {
    const [matches, setMatches] = useState(() => (typeof window !== 'undefined' ? window.matchMedia(query).matches : false));

    useEffect(() => {
        const mediaQueryList = window.matchMedia(query);
        const listener = () => setMatches(mediaQueryList.matches);

        listener();
        mediaQueryList.addEventListener('change', listener);

        return () => mediaQueryList.removeEventListener('change', listener);
    }, [query]);

    return matches;
}
