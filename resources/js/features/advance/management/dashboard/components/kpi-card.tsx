import type { LucideIcon } from 'lucide-react';
import { DeltaBadge } from './delta-badge';

export interface Kpi {
    value: number;
    previous: number;
    deltaPct: number;
}

export function KpiCard({
    icon: Icon,
    label,
    value,
    suffix,
    color,
    bg,
    delta,
}: {
    icon: LucideIcon;
    label: string;
    value: string;
    suffix?: string;
    color: string;
    bg: string;
    delta: number;
}) {
    return (
        <div className="flex flex-col gap-3 rounded-xl border border-[var(--border-strong)] bg-[var(--card)] p-4 shadow-sm">
            <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-full" style={{ backgroundColor: bg, color }}>
                    <Icon className="h-5 w-5" />
                </div>
                <DeltaBadge value={delta} compact />
            </div>
            <div className="min-w-0">
                <p className="truncate text-xs font-medium text-[var(--grey-text)]">{label}</p>
                <div className="flex items-baseline gap-1">
                    <h3 className="truncate text-xl font-bold text-[var(--subheading)]">{value}</h3>
                    {suffix && <span className="text-xs text-[var(--grey-text)]">{suffix}</span>}
                </div>
            </div>
        </div>
    );
}
