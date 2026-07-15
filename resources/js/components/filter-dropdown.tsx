import { ChevronDown } from 'lucide-react';
import { useState, type ReactNode } from 'react';

interface FilterOption {
    value: string;
    label: string;
}

interface FilterDropdownProps {
    value?: string;
    options: FilterOption[];
    allLabel: string;
    onChange: (value: string | undefined) => void;
    icon?: ReactNode;
    className?: string;
}

export function FilterDropdown({ value, options, allLabel, onChange, icon, className = '' }: FilterDropdownProps) {
    const [open, setOpen] = useState(false);
    const activeLabel = options.find((o) => o.value === value)?.label ?? allLabel;

    return (
        <div className={`relative ${className}`}>
            <button
                type="button"
                aria-label={`Filter: ${activeLabel}`}
                onClick={() => setOpen((v) => !v)}
                className="flex items-center gap-2 rounded-lg border border-transparent bg-[var(--second-accent)] px-4 py-2 text-sm font-medium text-[var(--subheading)] shadow-sm hover:bg-[var(--surface-badge)] dark:border-[var(--border-strong)]"
            >
                {icon}
                {activeLabel}
                <ChevronDown className="h-4 w-4" />
            </button>

            {open && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
                    <div className="absolute top-full left-0 z-50 mt-1 w-48 overflow-hidden rounded-xl border border-transparent bg-[var(--neutral-white)] py-1 shadow-lg dark:border-[var(--border-strong)] dark:bg-[var(--card)]">
                        <button
                            onClick={() => {
                                onChange(undefined);
                                setOpen(false);
                            }}
                            className={`flex w-full items-center px-4 py-2.5 text-left text-sm hover:bg-[var(--surface-badge)] dark:hover:bg-[var(--second-accent)] ${
                                !value ? 'font-semibold text-[var(--subheading)]' : 'text-[var(--grey-text)]'
                            }`}
                        >
                            {allLabel}
                        </button>
                        {options.map((opt) => (
                            <button
                                key={opt.value}
                                onClick={() => {
                                    onChange(opt.value);
                                    setOpen(false);
                                }}
                                className={`flex w-full items-center px-4 py-2.5 text-left text-sm hover:bg-[var(--surface-badge)] dark:hover:bg-[var(--second-accent)] ${
                                    value === opt.value ? 'font-semibold text-[var(--subheading)]' : 'text-[var(--grey-text)]'
                                }`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
