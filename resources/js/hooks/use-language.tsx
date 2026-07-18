import { dictionaries, type Locale } from '@/lib/i18n';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

interface LanguageContextValue {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function resolveKey(dictionary: Record<string, unknown>, path: string): string {
    const value = path.split('.').reduce<unknown>((acc, part) => {
        if (acc && typeof acc === 'object') {
            return (acc as Record<string, unknown>)[part];
        }
        return undefined;
    }, dictionary);

    return typeof value === 'string' ? value : path;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [locale, setLocaleState] = useState<Locale>(() => {
        const saved = localStorage.getItem('language');
        return saved === 'en' || saved === 'id' ? saved : 'id';
    });

    useEffect(() => {
        document.documentElement.lang = locale;
    }, [locale]);

    const setLocale = (next: Locale) => {
        setLocaleState(next);
        localStorage.setItem('language', next);
    };

    const t = (key: string) => resolveKey(dictionaries[locale], key);

    return <LanguageContext.Provider value={{ locale, setLocale, t }}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
    const context = useContext(LanguageContext);

    if (!context) {
        throw new Error('useLanguage harus dipanggil di dalam <LanguageProvider>');
    }

    return context;
}
