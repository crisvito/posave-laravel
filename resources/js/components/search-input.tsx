import { Search } from 'lucide-react';

interface SearchInputProps {
    value: string;
    onChange: (value: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    placeholder?: string;
    variant?: 'default' | 'kiosk';
    className?: string;
}

const THEME = {
    default: {
        wrapper:
            'h-10 rounded-lg border border-[var(--border-strong)] bg-[var(--card)] pr-4 pl-9 text-sm text-[var(--foreground)] placeholder:text-[var(--grey-text-muted)]',
        icon: 'text-[var(--grey-text)]',
    },
    kiosk: {
        wrapper:
            'h-10 rounded-full border border-[var(--border-strong)] bg-[var(--card)] pr-4 pl-10 text-sm text-[var(--foreground)] placeholder:text-[var(--text-light)] focus-visible:border-[var(--secondary-600)]',
        icon: 'text-[var(--grey-text-muted)]',
    },
};

export function SearchInput({
    value,
    onChange,
    onSubmit,
    placeholder = 'Search',
    variant = 'default',
    className = 'w-full sm:max-w-xs',
}: SearchInputProps) {
    const theme = THEME[variant];

    return (
        <form onSubmit={onSubmit} className={className}>
            <div className="relative">
                <Search className={`absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 ${theme.icon}`} aria-hidden="true" />
                <input
                    type="text"
                    aria-label={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className={`focus:ring-ring w-full outline-none focus:ring-1 ${theme.wrapper}`}
                />
            </div>
        </form>
    );
}
