import { useLanguage } from '@/hooks';
import { formatRupiah } from '@/lib/format';
import { useState } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';

export interface CategorySlice {
    name: string;
    omzet: number;
    color: string;
}

export function CategoryDonut({ data }: { data: CategorySlice[] }) {
    const { t } = useLanguage();
    const [active, setActive] = useState<number | null>(null);
    const total = data.reduce((sum, d) => sum + d.omzet, 0);

    if (total === 0) {
        return (
            <div className="flex h-[220px] items-center justify-center text-sm text-[var(--grey-text)]">
                {t('dashboardAdvance.dashboard.donut.empty')}
            </div>
        );
    }

    const shown = active != null ? data[active] : null;

    return (
        <div className="flex flex-col items-center gap-5">
            <div className="relative h-[180px] w-[180px] shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            dataKey="omzet"
                            nameKey="name"
                            innerRadius={56}
                            outerRadius={84}
                            paddingAngle={2}
                            stroke="none"
                            onMouseEnter={(_, i) => setActive(i)}
                            onMouseLeave={() => setActive(null)}
                        >
                            {data.map((slice, i) => (
                                <Cell
                                    key={slice.name}
                                    fill={slice.color}
                                    fillOpacity={active === null || active === i ? 1 : 0.35}
                                    className="cursor-pointer transition-opacity outline-none"
                                />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>

                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
                    {shown ? (
                        <>
                            <span className="flex items-center gap-1.5 text-[11px] font-medium text-[var(--grey-text)]">
                                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: shown.color }} />
                                {shown.name}
                            </span>
                            <span className="text-sm font-bold text-[var(--subheading)]">{formatRupiah(shown.omzet)}</span>
                            <span className="text-[11px] text-[var(--grey-text)]">{Math.round((shown.omzet / total) * 100)}%</span>
                        </>
                    ) : (
                        <>
                            <span className="text-[11px] text-[var(--grey-text)]">{t('dashboardAdvance.dashboard.donut.total')}</span>
                            <span className="text-sm font-bold text-[var(--subheading)]">{formatRupiah(total)}</span>
                        </>
                    )}
                </div>
            </div>

            <ul className="flex w-full flex-col gap-2.5">
                {data.map((slice, i) => {
                    const pct = Math.round((slice.omzet / total) * 100);
                    return (
                        <li
                            key={slice.name}
                            onMouseEnter={() => setActive(i)}
                            onMouseLeave={() => setActive(null)}
                            className={`flex cursor-default items-center justify-between gap-2 rounded-md px-2 py-1 text-sm transition-colors ${
                                active === i ? 'bg-[var(--second-accent)]' : ''
                            }`}
                        >
                            <span className="flex min-w-0 items-center gap-2 text-[var(--grey-text)]">
                                <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: slice.color }} />
                                <span className="truncate">{slice.name}</span>
                            </span>
                            <span className="flex shrink-0 items-baseline gap-2">
                                <span className="text-xs text-[var(--grey-text)]">{formatRupiah(slice.omzet)}</span>
                                <span className="w-9 text-right font-semibold text-[var(--subheading)]">{pct}%</span>
                            </span>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
