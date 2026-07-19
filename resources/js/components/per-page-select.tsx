import { useLanguage } from '@/hooks';
import { ChevronDown } from 'lucide-react';

interface PerPageSelectProps {
    value: string;
    onChange: (value: string) => void;
    options?: number[];
}

export function PerPageSelect({ value, onChange, options = [5, 10, 15, 20, 25] }: PerPageSelectProps) {
    const { t } = useLanguage();

    return (
        <div className="relative">
            <select
                aria-label={t('shared.pagination.perPageAriaLabel')}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="h-9 appearance-none rounded-lg border border-[var(--border-strong)] bg-[var(--card)] px-3 pr-9 text-sm text-[var(--subheading)]"
            >
                {options.map((n) => (
                    <option key={n} value={n}>
                        {n} {t('shared.pagination.perPageSuffix')}
                    </option>
                ))}
            </select>
            <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-[var(--grey-text)]" />
        </div>
    );
}
