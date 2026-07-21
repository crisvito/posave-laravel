import { Appearance, useAppearance } from '@/features/settings/hooks/use-appearance';
import { useLanguage } from '@/hooks';
import { cn } from '@/lib/utils';
import { Moon, Sun } from 'lucide-react';
import { HTMLAttributes } from 'react';

export function AppearanceToggle({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
    const { appearance, updateAppearance } = useAppearance();
    const { t } = useLanguage();

    const isDark = appearance === 'dark';

    const options: { value: Appearance; icon: typeof Sun; label: string }[] = [
        { value: 'light', icon: Sun, label: t('shared.appearanceToggle.switchToLight') },
        { value: 'dark', icon: Moon, label: t('shared.appearanceToggle.switchToDark') },
    ];

    return (
        <div className={cn('inline-flex items-center gap-0.5 rounded-full bg-[var(--second-accent)] p-1', className)} {...props}>
            {options.map(({ value, icon: Icon, label }) => {
                const isActive = value === 'dark' ? isDark : !isDark;
                return (
                    <button
                        key={value}
                        type="button"
                        aria-label={label}
                        onClick={() => updateAppearance(value)}
                        className={cn(
                            'flex h-7 w-7 cursor-pointer items-center justify-center rounded-full transition-colors',
                            isActive
                                ? 'bg-[var(--card)] text-[var(--subheading)] shadow-xs dark:text-[var(--neutral-white)]'
                                : 'text-[var(--grey-text-muted)] hover:text-[var(--subheading)] dark:hover:text-[var(--neutral-white)]',
                        )}
                    >
                        <Icon className="h-3.5 w-3.5" />
                    </button>
                );
            })}
        </div>
    );
}
