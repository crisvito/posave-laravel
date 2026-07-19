import { Table, TableBody, TableCell, TableEmptyState, TableHead, TableHeader, TableRow } from '@/components';
import { useFilteredRows, type SortKey } from '@/features/advance/management/report/hooks';
import { cur, num, pct, runExport, type Cell, type CompanyInfo, type ReportExport } from '@/features/advance/management/report/lib';
import { useLanguage } from '@/hooks';
import { formatNumber, formatPct, formatRupiah } from '@/lib/format';
import { useState } from 'react';
import { TableToolbar } from './table-toolbar';

export interface CategoryRow {
    name: string;
    qty: number;
    omzet: number;
    hpp: number;
    margin: number;
    marginPct: number;
}

interface CategoryTableProps {
    rows: CategoryRow[];
    subtitle: string;
    periodSuffix: string;
    company: CompanyInfo;
}

export function CategoryTable({ rows, subtitle, periodSuffix, company }: CategoryTableProps) {
    const { t } = useLanguage();
    const [query, setQuery] = useState('');
    const [sort, setSort] = useState<SortKey>('omzet_desc');
    const data = useFilteredRows(rows, query, sort);

    const report: ReportExport = {
        title: t('dashboardAdvance.report.tabs.categorySales'),
        subtitle,
        company,
        columns: [
            { header: t('dashboardAdvance.report.categoryTable.columnCategoryName'), align: 'left', width: 28 },
            { header: t('dashboardAdvance.report.categoryTable.columnSold'), align: 'right' },
            { header: t('dashboardAdvance.report.categoryTable.columnSales'), align: 'right' },
            { header: t('dashboardAdvance.report.categoryTable.columnCogs'), align: 'right' },
            { header: t('dashboardAdvance.report.categoryTable.columnMargin'), align: 'right' },
            { header: t('dashboardAdvance.report.categoryTable.columnMarginPercent'), align: 'right' },
        ],
        filenameBase: `kategori-penjualan-${periodSuffix}`,
        rows: data.map((r): Cell[] => [r.name, num(r.qty), cur(r.omzet), cur(r.hpp), cur(r.margin), pct(r.marginPct)]),
    };

    return (
        <div className="overflow-hidden rounded-2xl border border-[var(--border-strong)] bg-[var(--card)] shadow-sm">
            <TableToolbar query={query} setQuery={setQuery} sort={sort} setSort={setSort} onExport={(f) => runExport(f, report)} />
            <div className="overflow-x-auto">
                <Table className="min-w-[560px]">
                    <TableHeader className="bg-[var(--surface-header)]">
                        <TableRow className="border-none hover:bg-[var(--surface-header)]">
                            <TableHead className="text-[var(--text-light)]">
                                {t('dashboardAdvance.report.categoryTable.columnCategoryName')}
                            </TableHead>
                            <TableHead className="text-right text-[var(--text-light)]">
                                {t('dashboardAdvance.report.categoryTable.columnSold')}
                            </TableHead>
                            <TableHead className="text-right text-[var(--text-light)]">
                                {t('dashboardAdvance.report.categoryTable.columnSales')}
                            </TableHead>
                            <TableHead className="text-right text-[var(--text-light)]">
                                {t('dashboardAdvance.report.categoryTable.columnCogs')}
                            </TableHead>
                            <TableHead className="text-right text-[var(--text-light)]">
                                {t('dashboardAdvance.report.categoryTable.columnMargin')}
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.length === 0 ? (
                            <TableEmptyState colSpan={5} message={t('dashboardAdvance.report.categoryTable.emptyState')} />
                        ) : (
                            data.map((row) => (
                                <TableRow key={row.name}>
                                    <TableCell className="font-medium text-[var(--subheading)]">{row.name}</TableCell>
                                    <TableCell className="text-right text-[var(--grey-text)]">{formatNumber(row.qty)}</TableCell>
                                    <TableCell className="text-right font-semibold text-[var(--subheading)]">{formatRupiah(row.omzet)}</TableCell>
                                    <TableCell className="text-right text-[var(--grey-text)]">{formatRupiah(row.hpp)}</TableCell>
                                    <TableCell className="text-right">
                                        <span className="font-semibold text-[var(--success)]">{formatRupiah(row.margin)}</span>
                                        <span className="ml-1 text-xs text-[var(--grey-text)]">({formatPct(row.marginPct)})</span>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
