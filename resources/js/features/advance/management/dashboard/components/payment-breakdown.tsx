import { useLanguage } from '@/hooks';
import { formatNumber, formatRupiah } from '@/lib/format';

export interface PaymentSlice {
    method: string;
    label: string;
    color: string;
    total: number;
    count: number;
}

export function PaymentBreakdown({ data }: { data: PaymentSlice[] }) {
    const { t } = useLanguage();
    const total = data.reduce((sum, d) => sum + d.total, 0);

    if (total === 0) {
        return <p className="py-8 text-center text-sm text-[var(--grey-text)]">{t('dashboardAdvance.dashboard.paymentMethod.empty')}</p>;
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex h-3 w-full overflow-hidden rounded-full bg-[var(--second-accent)]">
                {data.map((slice) =>
                    slice.total > 0 ? (
                        <div
                            key={slice.method}
                            style={{ width: `${(slice.total / total) * 100}%`, backgroundColor: slice.color }}
                            title={`${slice.label}: ${formatRupiah(slice.total)}`}
                        />
                    ) : null,
                )}
            </div>

            <ul className="flex flex-col gap-3">
                {data.map((slice) => {
                    const pct = total > 0 ? Math.round((slice.total / total) * 100) : 0;
                    return (
                        <li key={slice.method} className="flex items-center justify-between gap-2 text-sm">
                            <span className="flex items-center gap-2 text-[var(--grey-text)]">
                                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: slice.color }} />
                                {slice.label}
                                <span className="text-xs text-[var(--grey-text)]">· {formatNumber(slice.count)}x</span>
                            </span>
                            <span className="flex items-baseline gap-2">
                                <span className="font-medium text-[var(--subheading)]">{formatRupiah(slice.total)}</span>
                                <span className="w-9 text-right text-xs text-[var(--grey-text)]">{pct}%</span>
                            </span>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
