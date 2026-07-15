import { Button } from '@/components/ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { router } from '@inertiajs/react';
import { Printer, Store } from 'lucide-react';
import { useState } from 'react';

export interface OutletOption {
    id: number;
    name: string;
}

export interface SalesFilters {
    outlet_id: number | null;
    range: string;
    from: string;
    to: string;
    label: string;
    days: number;
}

interface Props {
    routeName: string;
    outlets: OutletOption[];
    filters: SalesFilters;
    extraParams?: Record<string, string>;
    onPrint?: () => void;
    showPrint?: boolean;
}

const RANGE_PRESETS: { value: string; label: string }[] = [
    { value: 'today', label: 'Hari ini' },
    { value: '7d', label: '7 Hari' },
    { value: '30d', label: '30 Hari' },
    { value: '90d', label: '90 Hari' },
    { value: 'custom', label: 'Custom' },
];

export function SalesFilterBar({ routeName, outlets, filters, extraParams = {}, onPrint, showPrint = true }: Props) {
    const [from, setFrom] = useState(filters.from);
    const [to, setTo] = useState(filters.to);

    const visit = (next: Partial<SalesFilters>) => {
        const merged = { ...filters, ...next };
        const params: Record<string, string> = { ...extraParams, range: merged.range };

        if (merged.outlet_id) params.outlet_id = String(merged.outlet_id);
        if (merged.range === 'custom') {
            params.from = next.from ?? from;
            params.to = next.to ?? to;
        }

        router.get(route(routeName), params, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };
    const showOutletSelect = outlets.length > 1;

    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                {showOutletSelect ? (
                    <Select
                        value={filters.outlet_id ? String(filters.outlet_id) : 'all'}
                        onValueChange={(v) => visit({ outlet_id: v === 'all' ? null : Number(v) })}
                    >
                        <SelectTrigger className="h-10 w-full gap-2 rounded-lg border-transparent bg-[var(--second-accent)] font-medium text-[var(--subheading)] shadow-sm sm:w-[200px] dark:border-[var(--border-strong)] dark:bg-[var(--card)] dark:text-white">
                            <span className="!flex min-w-0 items-center gap-2">
                                <Store className="h-4 w-4 shrink-0 text-[var(--grey-text)] dark:text-[var(--muted-foreground)]" />
                                <SelectValue placeholder="Semua Outlet" />
                            </span>
                        </SelectTrigger>
                        <SelectContent className="dark:border-[var(--border-strong)] dark:bg-[var(--card)]">
                            <SelectItem value="all">Semua Outlet</SelectItem>
                            {outlets.map((o) => (
                                <SelectItem key={o.id} value={String(o.id)}>
                                    {o.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                ) : (
                    outlets.length === 1 && (
                        <div className="flex shrink-0 items-center gap-2 rounded-lg bg-[var(--second-accent)] px-3 py-2 text-sm font-medium text-[var(--subheading)] dark:border-[var(--border-strong)] dark:bg-[var(--card)] dark:text-white">
                            <Store className="h-4 w-4 shrink-0 text-[var(--grey-text)] dark:text-[var(--muted-foreground)]" />
                            {outlets[0].name}
                        </div>
                    )
                )}

                {/* Preset rentang tanggal */}
                <div className="flex h-10 w-full items-center rounded-md border border-[var(--border)] bg-[var(--neutral-white)] p-1 shadow-sm sm:w-auto dark:border-[var(--border-strong)] dark:bg-[var(--card)]">
                    {RANGE_PRESETS.map((preset) => (
                        <button
                            key={preset.value}
                            onClick={() => visit({ range: preset.value })}
                            className={`h-full flex-1 rounded px-2 text-sm font-medium whitespace-nowrap transition-colors sm:flex-none sm:px-3 ${
                                filters.range === preset.value
                                    ? 'bg-[var(--surface-header)] text-white'
                                    : 'text-[var(--grey-text)] hover:bg-[var(--second-accent)] dark:text-[var(--muted-foreground)] dark:hover:bg-[var(--border-strong)]'
                            }`}
                        >
                            {preset.label}
                        </button>
                    ))}
                </div>

                {/* Input tanggal custom */}
                {filters.range === 'custom' && (
                    <div className="flex h-10 w-full items-center gap-2 rounded-md border border-[var(--border)] bg-[var(--neutral-white)] px-3 shadow-sm sm:w-auto dark:border-[var(--border-strong)] dark:bg-[var(--card)]">
                        <input
                            aria-label="input-date"
                            type="date"
                            value={from}
                            max={to}
                            onChange={(e) => setFrom(e.target.value)}
                            onBlur={() => visit({ range: 'custom', from })}
                            className="min-w-0 flex-1 bg-transparent text-sm text-[var(--subheading)] outline-none sm:flex-none dark:text-white"
                        />
                        <span className="text-[var(--grey-text)] dark:text-[var(--muted-foreground)]">–</span>
                        <input
                            aria-label="input-date"
                            type="date"
                            value={to}
                            min={from}
                            onChange={(e) => setTo(e.target.value)}
                            onBlur={() => visit({ range: 'custom', to })}
                            className="min-w-0 flex-1 bg-transparent text-sm text-[var(--subheading)] outline-none sm:flex-none dark:text-white"
                        />
                    </div>
                )}
            </div>

            {showPrint && (
                <Button
                    onClick={onPrint ?? (() => window.print())}
                    className="h-10 w-full justify-center rounded-lg bg-[var(--surface-header)] font-semibold text-[var(--text-light)] shadow-sm hover:opacity-90 sm:w-auto"
                >
                    <Printer className="mr-2 h-4 w-4" />
                    Cetak
                </Button>
            )}
        </div>
    );
}
