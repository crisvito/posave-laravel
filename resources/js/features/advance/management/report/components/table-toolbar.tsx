import { SearchInput } from '@/components';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { SortKey } from '@/features/advance/management/report/hooks';
import type { ExportFormat } from '@/features/advance/management/report/lib';
import { ExportMenu } from './export-menu';

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
    { value: 'omzet_desc', label: 'Penjualan Tertinggi' },
    { value: 'omzet_asc', label: 'Penjualan Terendah' },
    { value: 'margin_desc', label: 'Margin Tertinggi' },
    { value: 'name_asc', label: 'Nama A–Z' },
];

interface TableToolbarProps {
    query: string;
    setQuery: (v: string) => void;
    sort: SortKey;
    setSort: (v: SortKey) => void;
    onExport: (format: ExportFormat) => void | Promise<void>;
}

export function TableToolbar({ query, setQuery, sort, setSort, onExport }: TableToolbarProps) {
    return (
        <div className="flex flex-wrap items-center justify-between gap-3 p-4">
            <div className="max-w-xs flex-1">
                <SearchInput value={query} onChange={setQuery} onSubmit={(e) => e.preventDefault()} placeholder="Cari..." />
            </div>
            <div className="flex items-center gap-3">
                <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
                    <SelectTrigger className="h-10 min-w-[170px] border-[var(--border)] bg-[var(--neutral-white)] text-[var(--subheading)] dark:border-[var(--border-strong)] dark:bg-[var(--card)] dark:text-white">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="dark:border-[var(--border-strong)] dark:bg-[var(--card)] dark:text-white">
                        {SORT_OPTIONS.map((o) => (
                            <SelectItem key={o.value} value={o.value}>
                                {o.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <ExportMenu onExport={onExport} />
            </div>
        </div>
    );
}
