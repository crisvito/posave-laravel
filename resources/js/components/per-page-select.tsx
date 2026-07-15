import { ChevronDown } from 'lucide-react';

interface PerPageSelectProps {
    value: string;
    onChange: (value: string) => void;
    options?: number[];
}

export function PerPageSelect({ value, onChange, options = [5, 10, 15, 20, 25] }: PerPageSelectProps) {
    return (
        <div className="relative">
            <select
                aria-label="Jumlah item per halaman"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="h-9 appearance-none rounded-lg border border-[var(--border-strong)] bg-[var(--neutral-white)] px-3 pr-9 text-sm dark:border-[var(--border-strong)] dark:bg-[var(--card)] dark:text-white"
            >
                {options.map((n) => (
                    <option key={n} value={n}>
                        {n} per halaman
                    </option>
                ))}
            </select>
            <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-[var(--grey-text)] dark:text-[var(--muted-foreground)]" />
        </div>
    );
}
