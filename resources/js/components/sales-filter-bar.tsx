import { Button } from '@/components/ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/hooks';
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

export function SalesFilterBar({ routeName, outlets, filters, extraParams = {}, onPrint, showPrint = true }: Props) {
    const { t } = useLanguage();
    const [from, setFrom] = useState(filters.from);
    const [to, setTo] = useState(filters.to);

    const RANGE_PRESETS: { value: string; label: string }[] = [
        { value: 'today', label: t('shared.salesFilterBar.rangeToday') },
        { value: '7d', label: t('shared.salesFilterBar.range7d') },
        { value: '30d', label: t('shared.salesFilterBar.range30d') },
        { value: '90d', label: t('shared.salesFilterBar.range90d') },
        { value: 'custom', label: t('shared.salesFilterBar.rangeCustom') },
    ];

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
                        <SelectTrigger className="h-10 w-full gap-2 rounded-lg border-transparent bg-[var(--second-accent)] font-medium text-[var(--subheading)] shadow-sm sm:w-[200px]">
                            <span className="!flex min-w-0 items-center gap-2">
                                <Store className="h-4 w-4 shrink-0 text-[var(--grey-text)]" />
                                <SelectValue placeholder={t('shared.salesFilterBar.allOutlets')} />
                            </span>
                        </SelectTrigger>
                        <SelectContent className="border-[var(--border-strong)] bg-[var(--card)]">
                            <SelectItem value="all">{t('shared.salesFilterBar.allOutlets')}</SelectItem>
                            {outlets.map((o) => (
                                <SelectItem key={o.id} value={String(o.id)}>
                                    {o.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                ) : (
                    outlets.length === 1 && (
                        <div className="flex shrink-0 items-center gap-2 rounded-lg bg-[var(--second-accent)] px-3 py-2 text-sm font-medium text-[var(--subheading)]">
                            <Store className="h-4 w-4 shrink-0 text-[var(--grey-text)]" />
                            {outlets[0].name}
                        </div>
                    )
                )}

                <div className="flex h-10 w-full items-center rounded-md border border-[var(--border-strong)] bg-[var(--card)] p-1 shadow-sm sm:w-auto">
                    {RANGE_PRESETS.map((preset) => (
                        <button
                            key={preset.value}
                            onClick={() => visit({ range: preset.value })}
                            className={`h-full flex-1 rounded px-2 text-sm font-medium whitespace-nowrap transition-colors sm:flex-none sm:px-3 ${
                                filters.range === preset.value
                                    ? 'bg-[var(--surface-header)] text-white'
                                    : 'text-[var(--grey-text)] hover:bg-[var(--second-accent)]'
                            }`}
                        >
                            {preset.label}
                        </button>
                    ))}
                </div>

                {filters.range === 'custom' && (
                    <div className="flex h-10 w-full items-center gap-2 rounded-md border border-[var(--border-strong)] bg-[var(--card)] px-3 shadow-sm sm:w-auto">
                        <input
                            aria-label={t('shared.salesFilterBar.fromDateAriaLabel')}
                            type="date"
                            value={from}
                            max={to}
                            onChange={(e) => setFrom(e.target.value)}
                            onBlur={() => visit({ range: 'custom', from })}
                            className="min-w-0 flex-1 bg-transparent text-sm text-[var(--subheading)] outline-none sm:flex-none"
                        />
                        <span className="text-[var(--grey-text)]">–</span>
                        <input
                            aria-label={t('shared.salesFilterBar.toDateAriaLabel')}
                            type="date"
                            value={to}
                            min={from}
                            onChange={(e) => setTo(e.target.value)}
                            onBlur={() => visit({ range: 'custom', to })}
                            className="min-w-0 flex-1 bg-transparent text-sm text-[var(--subheading)] outline-none sm:flex-none"
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
                    {t('shared.salesFilterBar.printButton')}
                </Button>
            )}
        </div>
    );
}
