import type { TrendMetric } from './sales-trend-chart';

export function MetricToggle({ metric, onChange }: { metric: TrendMetric; onChange: (m: TrendMetric) => void }) {
    const options: { value: TrendMetric; label: string }[] = [
        { value: 'omzet', label: 'Penjualan' },
        { value: 'transaksi', label: 'Transaksi' },
    ];
    return (
        <div className="flex h-9 items-center rounded-md border border-[var(--border)] bg-[var(--neutral-white)] p-1 dark:border-[var(--border-strong)] dark:bg-[var(--card)]">
            {options.map((o) => (
                <button
                    key={o.value}
                    onClick={() => onChange(o.value)}
                    className={`h-full rounded px-3 text-xs font-medium transition-colors ${
                        metric === o.value
                            ? 'bg-[var(--surface-header)] text-white'
                            : 'text-[var(--grey-text)] hover:bg-[var(--second-accent)] dark:text-[var(--muted-foreground)] dark:hover:bg-[var(--border-strong)]'
                    }`}
                >
                    {o.label}
                </button>
            ))}
        </div>
    );
}
