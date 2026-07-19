import { Table, TableBody, TableCell, TableEmptyState, TableHead, TableHeader, TableRow } from '@/components';
import { useFilteredRows, type SortKey } from '@/features/advance/management/report/hooks';
import { cur, num, pct, runExport, type Cell, type CompanyInfo, type ReportExport } from '@/features/advance/management/report/lib';
import { useLanguage } from '@/hooks';
import { formatNumber, formatPct, formatRupiah } from '@/lib/format';
import { useState } from 'react';
import { TableToolbar } from './table-toolbar';

export interface ProductRow {
    name: string;
    category: string;
    qty: number;
    omzet: number;
    hpp: number;
    margin: number;
    marginPct: number;
}

interface ProductTableProps {
    rows: ProductRow[];
    subtitle: string;
    periodSuffix: string;
    company: CompanyInfo;
}

export function ProductTable({ rows, subtitle, periodSuffix, company }: ProductTableProps) {
    const { t } = useLanguage();
    const [query, setQuery] = useState('');
    const [sort, setSort] = useState<SortKey>('omzet_desc');
    const data = useFilteredRows(rows, query, sort);

    const report: ReportExport = {
        title: t('dashboardAdvance.report.tabs.productSales'),
        subtitle,
        company,
        columns: [
            { header: t('dashboardAdvance.report.productTable.columnProductName'), align: 'left', width: 32 },
            { header: t('dashboardAdvance.report.productTable.columnCategory'), align: 'left', width: 20 },
            { header: t('dashboardAdvance.report.productTable.columnSold'), align: 'right' },
            { header: t('dashboardAdvance.report.productTable.columnSales'), align: 'right' },
            { header: t('dashboardAdvance.report.productTable.columnCogs'), align: 'right' },
            { header: t('dashboardAdvance.report.productTable.columnMargin'), align: 'right' },
            { header: t('dashboardAdvance.report.productTable.columnMarginPercent'), align: 'right' },
        ],
        filenameBase: `penjualan-barang-${periodSuffix}`,
        rows: data.map((r): Cell[] => [r.name, r.category, num(r.qty), cur(r.omzet), cur(r.hpp), cur(r.margin), pct(r.marginPct)]),
    };

    return (
        <div className="overflow-hidden rounded-2xl border border-[var(--border-strong)] bg-[var(--card)] shadow-sm">
            <TableToolbar query={query} setQuery={setQuery} sort={sort} setSort={setSort} onExport={(f) => runExport(f, report)} />
            <div className="overflow-x-auto">
                <Table className="min-w-[680px]">
                    <TableHeader className="bg-[var(--surface-header)]">
                        <TableRow className="border-none hover:bg-[var(--surface-header)]">
                            <TableHead className="text-[var(--text-light)]">{t('dashboardAdvance.report.productTable.columnProductName')}</TableHead>
                            <TableHead className="text-[var(--text-light)]">{t('dashboardAdvance.report.productTable.columnCategory')}</TableHead>
                            <TableHead className="text-right text-[var(--text-light)]">
                                {t('dashboardAdvance.report.productTable.columnSold')}
                            </TableHead>
                            <TableHead className="text-right text-[var(--text-light)]">
                                {t('dashboardAdvance.report.productTable.columnSales')}
                            </TableHead>
                            <TableHead className="text-right text-[var(--text-light)]">
                                {t('dashboardAdvance.report.productTable.columnCogs')}
                            </TableHead>
                            <TableHead className="text-right text-[var(--text-light)]">
                                {t('dashboardAdvance.report.productTable.columnMargin')}
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.length === 0 ? (
                            <TableEmptyState colSpan={6} message={t('dashboardAdvance.report.productTable.emptyState')} />
                        ) : (
                            data.map((row) => (
                                <TableRow key={row.name}>
                                    <TableCell className="font-medium text-[var(--subheading)]">{row.name}</TableCell>
                                    <TableCell className="text-[var(--grey-text)]">{row.category}</TableCell>
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
