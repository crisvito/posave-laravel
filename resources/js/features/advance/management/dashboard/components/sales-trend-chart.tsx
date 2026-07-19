import { useLanguage } from '@/hooks';
import { formatCompactRupiah, formatNumber, formatRupiah } from '@/lib/format';
import { Area, AreaChart, CartesianGrid, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export interface TrendPoint {
    date: string;
    label: string;
    total: number;
    count: number;
    prevTotal: number;
    prevCount: number;
}

export type TrendMetric = 'omzet' | 'transaksi';

const LINE_COLOR = 'var(--secondary-700)';
const PREV_COLOR = 'var(--border-strong)';

function TrendTooltip({ active, payload, label, metric }: any) {
    const { t } = useLanguage();
    if (!active || !payload?.length) return null;
    const fmt =
        metric === 'omzet' ? formatRupiah : (v: number) => `${formatNumber(v)} ${t('dashboardAdvance.dashboard.salesChart.transactionsSuffix')}`;
    const current = payload.find((p: any) => p.dataKey === 'current')?.value ?? 0;
    const prev = payload.find((p: any) => p.dataKey === 'previous')?.value ?? 0;

    return (
        <div className="rounded-lg border border-[var(--border-strong)] bg-[var(--card)] px-3 py-2 shadow-md">
            <p className="text-xs text-[var(--grey-text)]">{label}</p>
            <p className="text-sm font-semibold text-[var(--subheading)]">{fmt(current)}</p>
            <p className="text-xs text-[var(--grey-text)]">
                {t('dashboardAdvance.dashboard.salesChart.previousValueLabel')}: {fmt(prev)}
            </p>
        </div>
    );
}

export function SalesTrendChart({ data, metric }: { data: TrendPoint[]; metric: TrendMetric }) {
    const interval = Math.max(0, Math.floor(data.length / 8) - 1);
    const isOmzet = metric === 'omzet';

    const chartData = data.map((d) => ({
        label: d.label,
        current: isOmzet ? d.total : d.count,
        previous: isOmzet ? d.prevTotal : d.prevCount,
    }));

    return (
        <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={chartData} margin={{ top: 10, right: 28, left: 8, bottom: 0 }}>
                <defs>
                    <linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={LINE_COLOR} stopOpacity={0.25} />
                        <stop offset="100%" stopColor={LINE_COLOR} stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis
                    dataKey="label"
                    interval={interval}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11, fill: 'var(--grey-text-muted)' }}
                    dy={8}
                />
                <YAxis
                    tickFormatter={(v) => (isOmzet ? formatCompactRupiah(v) : formatNumber(v))}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11, fill: 'var(--grey-text-muted)' }}
                    width={isOmzet ? 70 : 40}
                />
                <Tooltip content={(props) => <TrendTooltip {...props} metric={metric} />} />
                <Line type="monotone" dataKey="previous" stroke={PREV_COLOR} strokeWidth={2} strokeDasharray="5 4" dot={false} />
                <Area
                    type="monotone"
                    dataKey="current"
                    stroke={LINE_COLOR}
                    strokeWidth={2.5}
                    fill="url(#salesFill)"
                    dot={{ r: data.length > 35 ? 1.75 : 3, strokeWidth: 0, fill: LINE_COLOR }}
                    activeDot={{ r: 4.5, strokeWidth: 0 }}
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}
