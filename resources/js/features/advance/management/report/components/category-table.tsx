import { Table, TableBody, TableCell, TableEmptyState, TableHead, TableHeader, TableRow } from '@/components';
import { useFilteredRows, type SortKey } from '@/features/advance/management/report/hooks';
import { cur, num, pct, runExport, type Cell, type CompanyInfo, type ReportExport } from '@/features/advance/management/report/lib';
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
    const [query, setQuery] = useState('');
    const [sort, setSort] = useState<SortKey>('omzet_desc');
    const data = useFilteredRows(rows, query, sort);

    const report: ReportExport = {
        title: 'Kategori Penjualan',
        subtitle,
        company,
        columns: [
            { header: 'Nama Kategori', align: 'left', width: 28 },
            { header: 'Terjual', align: 'right' },
            { header: 'Penjualan', align: 'right' },
            { header: 'HPP', align: 'right' },
            { header: 'Margin', align: 'right' },
            { header: 'Margin %', align: 'right' },
        ],
        filenameBase: `kategori-penjualan-${periodSuffix}`,
        rows: data.map((r): Cell[] => [r.name, num(r.qty), cur(r.omzet), cur(r.hpp), cur(r.margin), pct(r.marginPct)]),
    };

    return (
        <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--neutral-white)] shadow-sm dark:border-[var(--border-strong)] dark:bg-[var(--card)]">
            <TableToolbar query={query} setQuery={setQuery} sort={sort} setSort={setSort} onExport={(f) => runExport(f, report)} />
            <div className="overflow-x-auto">
                <Table className="min-w-[560px]">
                    <TableHeader className="bg-[var(--surface-header)] dark:bg-[var(--border-strong)]">
                        <TableRow className="border-none hover:bg-[var(--surface-header)] dark:hover:bg-[var(--border-strong)]">
                            <TableHead className="text-[var(--text-light)] dark:text-white">Nama Kategori</TableHead>
                            <TableHead className="text-right text-[var(--text-light)] dark:text-white">Terjual</TableHead>
                            <TableHead className="text-right text-[var(--text-light)] dark:text-white">Penjualan</TableHead>
                            <TableHead className="text-right text-[var(--text-light)] dark:text-white">HPP</TableHead>
                            <TableHead className="text-right text-[var(--text-light)] dark:text-white">Margin</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.length === 0 ? (
                            <TableEmptyState colSpan={5} message="Belum ada kategori terjual" />
                        ) : (
                            data.map((row) => (
                                <TableRow key={row.name} className="dark:border-[var(--border-strong)]">
                                    <TableCell className="font-medium text-[var(--subheading)] dark:text-white">{row.name}</TableCell>
                                    <TableCell className="text-right text-[var(--grey-text)] dark:text-[var(--muted-foreground)]">
                                        {formatNumber(row.qty)}
                                    </TableCell>
                                    <TableCell className="text-right font-semibold text-[var(--subheading)] dark:text-white">
                                        {formatRupiah(row.omzet)}
                                    </TableCell>
                                    <TableCell className="text-right text-[var(--grey-text)] dark:text-[var(--muted-foreground)]">
                                        {formatRupiah(row.hpp)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <span className="font-semibold text-[var(--success)]">{formatRupiah(row.margin)}</span>
                                        <span className="ml-1 text-xs text-[var(--grey-text)] dark:text-[var(--muted-foreground)]">
                                            ({formatPct(row.marginPct)})
                                        </span>
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
