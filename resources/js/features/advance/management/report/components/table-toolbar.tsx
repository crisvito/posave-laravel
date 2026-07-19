import { SearchInput } from '@/components';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { SortKey } from '@/features/advance/management/report/hooks';
import type { ExportFormat } from '@/features/advance/management/report/lib';
import { useLanguage } from '@/hooks';
import { ExportMenu } from './export-menu';

interface TableToolbarProps {
    query: string;
    setQuery: (v: string) => void;
    sort: SortKey;
    setSort: (v: SortKey) => void;
    onExport: (format: ExportFormat) => void | Promise<void>;
}

export function TableToolbar({ query, setQuery, sort, setSort, onExport }: TableToolbarProps) {
    const { t } = useLanguage();

    const SORT_OPTIONS: { value: SortKey; label: string }[] = [
        { value: 'omzet_desc', label: t('dashboardAdvance.report.tableToolbar.sortHighestSales') },
        { value: 'omzet_asc', label: t('dashboardAdvance.report.tableToolbar.sortLowestSales') },
        { value: 'margin_desc', label: t('dashboardAdvance.report.tableToolbar.sortHighestMargin') },
        { value: 'name_asc', label: t('dashboardAdvance.report.tableToolbar.sortNameAsc') },
    ];

    return (
        <div className="flex flex-wrap items-center justify-between gap-3 p-4">
            <div className="max-w-xs flex-1">
                <SearchInput
                    value={query}
                    onChange={setQuery}
                    onSubmit={(e) => e.preventDefault()}
                    placeholder={t('dashboardAdvance.report.tableToolbar.searchPlaceholder')}
                />
            </div>
            <div className="flex items-center gap-3">
                <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
                    <SelectTrigger className="h-10 min-w-[170px] border-[var(--border-strong)] bg-[var(--card)] text-[var(--subheading)]">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="border-[var(--border-strong)] bg-[var(--card)]">
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
