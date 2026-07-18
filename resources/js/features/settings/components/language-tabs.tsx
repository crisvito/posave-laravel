import { useLanguage } from '@/hooks';
import type { Locale } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { Languages } from 'lucide-react';
import { HTMLAttributes } from 'react';

export function LanguageTabs({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
    const { locale, setLocale, t } = useLanguage();

    const tabs: { value: Locale; label: string }[] = [
        { value: 'id', label: t('shared.language.id') },
        { value: 'en', label: t('shared.language.en') },
    ];

    return (
        <div className={cn('inline-flex gap-1 rounded-lg bg-[var(--second-accent)] p-1', className)} {...props}>
            {tabs.map(({ value, label }) => (
                <button
                    key={value}
                    onClick={() => setLocale(value)}
                    className={cn(
                        'flex items-center rounded-md px-3.5 py-1.5 transition-colors',
                        locale === value
                            ? 'bg-[var(--card)] text-[var(--foreground)] shadow-xs'
                            : 'text-[var(--grey-text-muted)] hover:bg-[var(--card)]/60 hover:text-[var(--foreground)]',
                    )}
                >
                    <Languages className="-ml-1 h-4 w-4" />
                    <span className="ml-1.5 text-sm">{label}</span>
                </button>
            ))}
        </div>
    );
}
