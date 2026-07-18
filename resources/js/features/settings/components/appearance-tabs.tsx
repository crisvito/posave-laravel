import { Appearance, useAppearance } from '@/features/settings/hooks/use-appearance';
import { useLanguage } from '@/hooks';
import { cn } from '@/lib/utils';
import { LucideIcon, Monitor, Moon, Sun } from 'lucide-react';
import { HTMLAttributes } from 'react';

export function AppearanceTabs({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
    const { appearance, updateAppearance } = useAppearance();
    const { t } = useLanguage();

    const tabs: { value: Appearance; icon: LucideIcon; label: string }[] = [
        { value: 'light', icon: Sun, label: t('settings.appearance.light') },
        { value: 'dark', icon: Moon, label: t('settings.appearance.dark') },
        { value: 'system', icon: Monitor, label: t('settings.appearance.system') },
    ];

    return (
        <div className={cn('inline-flex gap-1 rounded-lg bg-[var(--second-accent)] p-1', className)} {...props}>
            {tabs.map(({ value, icon: Icon, label }) => (
                <button
                    key={value}
                    onClick={() => updateAppearance(value)}
                    className={cn(
                        'flex items-center rounded-md px-3.5 py-1.5 transition-colors',
                        appearance === value
                            ? 'bg-[var(--card)] text-[var(--foreground)] shadow-xs'
                            : 'text-[var(--grey-text-muted)] hover:bg-[var(--card)]/60 hover:text-[var(--foreground)]',
                    )}
                >
                    <Icon className="-ml-1 h-4 w-4" />
                    <span className="ml-1.5 text-sm">{label}</span>
                </button>
            ))}
        </div>
    );
}
