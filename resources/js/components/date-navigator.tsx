import { Calendar, CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef } from 'react';

interface DateNavigatorProps {
    date: string;
    onChange: (date: string) => void;
    variant?: 'default' | 'kiosk';
    size?: 'sm' | 'lg';
    showIcon?: boolean;
    pickable?: boolean;
}

const THEME = {
    default: {
        wrapper: 'border border-[var(--border-strong)] bg-[var(--neutral-white)] dark:border-[var(--border-strong)] dark:bg-[var(--card)]',
        text: 'text-[var(--subheading)] dark:text-white',
        icon: 'text-[var(--grey-text)] dark:text-[var(--muted-foreground)]',
        chevron: 'text-[var(--grey-text)] hover:text-[var(--subheading)] dark:text-[var(--muted-foreground)] dark:hover:text-white',
        chevronHoverBg: 'hover:bg-[var(--second-accent)] dark:hover:bg-[var(--second-accent)]',
    },
    kiosk: {
        wrapper: 'border border-slate-200 bg-slate-50 dark:border-[var(--border-strong)] dark:bg-[var(--card)]',
        text: 'text-slate-700 dark:text-white',
        icon: 'text-slate-400 dark:text-[var(--muted-foreground)]',
        chevron: 'text-slate-500 hover:text-slate-700 dark:text-[var(--muted-foreground)] dark:hover:text-white',
        chevronHoverBg: 'hover:bg-slate-100 dark:hover:bg-[var(--second-accent)]',
    },
};

export function DateNavigator({ date, onChange, variant = 'default', size = 'sm', showIcon = true, pickable = true }: DateNavigatorProps) {
    const dateInputRef = useRef<HTMLInputElement>(null);
    const theme = THEME[variant];

    const formattedDate = new Date(date + 'T00:00:00').toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    const shiftDate = (days: number) => {
        const d = new Date(date + 'T00:00:00');
        d.setDate(d.getDate() + days);

        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');

        onChange(`${year}-${month}-${day}`);
    };

    const Icon = size === 'lg' ? CalendarDays : Calendar;
    const iconSize = size === 'lg' ? 'h-5 w-5' : 'h-4 w-4';
    const textSize = size === 'lg' ? 'text-base font-bold' : 'text-sm font-medium';
    const paddingCls = size === 'lg' ? 'gap-3 rounded-2xl p-3' : 'gap-2 rounded-lg px-3 py-1.5';
    const chevronBtnCls = size === 'lg' ? 'rounded-full p-2' : 'p-1 rounded-md';

    return (
        <div className={`flex shrink-0 items-center ${paddingCls} ${theme.wrapper}`}>
            <button
                type="button"
                aria-label="Hari sebelumnya"
                onClick={() => shiftDate(-1)}
                className={`transition-colors ${chevronBtnCls} ${theme.chevron} ${theme.chevronHoverBg}`}
            >
                <ChevronLeft className={iconSize} />
            </button>

            <div
                onClick={() => pickable && dateInputRef.current?.showPicker()}
                className={`relative flex items-center gap-2 px-1 whitespace-nowrap ${textSize} ${theme.text} ${pickable ? 'cursor-pointer' : ''}`}
            >
                {showIcon && <Icon className={`${iconSize} shrink-0 ${theme.icon}`} />}
                {formattedDate}
                {pickable && (
                    <input
                        aria-label="Pilih tanggal"
                        ref={dateInputRef}
                        type="date"
                        value={date}
                        onChange={(e) => e.target.value && onChange(e.target.value)}
                        className="pointer-events-none absolute bottom-0 left-0 h-0 w-0 opacity-0"
                    />
                )}
            </div>

            <button
                type="button"
                aria-label="Hari berikutnya"
                onClick={() => shiftDate(1)}
                className={`transition-colors ${chevronBtnCls} ${theme.chevron} ${theme.chevronHoverBg}`}
            >
                <ChevronRight className={iconSize} />
            </button>
        </div>
    );
}
