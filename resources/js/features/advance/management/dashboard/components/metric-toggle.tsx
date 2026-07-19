import { useLanguage } from '@/hooks';
import type { TrendMetric } from './sales-trend-chart';

export function MetricToggle({ metric, onChange }: { metric: TrendMetric; onChange: (m: TrendMetric) => void }) {
    const { t } = useLanguage();
    const options: { value: TrendMetric; label: string }[] = [
        { value: 'omzet', label: t('dashboardAdvance.dashboard.salesChart.transactionsSuffix') === 'transaksi' ? 'Penjualan' : 'Sales' },
        { value: 'transaksi', label: t('dashboardAdvance.dashboard.salesChart.transactionsSuffix') === 'transaksi' ? 'Transaksi' : 'Transactions' },
    ];
    return (
        <div className="flex h-9 items-center rounded-md border border-[var(--border-strong)] bg-[var(--card)] p-1">
            {options.map((o) => (
                <button
                    key={o.value}
                    onClick={() => onChange(o.value)}
                    className={`h-full rounded px-3 text-xs font-medium transition-colors ${
                        metric === o.value ? 'bg-[var(--surface-header)] text-white' : 'text-[var(--grey-text)] hover:bg-[var(--second-accent)]'
                    }`}
                >
                    {o.label}
                </button>
            ))}
        </div>
    );
}
