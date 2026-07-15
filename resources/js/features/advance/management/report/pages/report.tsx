import { SalesFilterBar, type OutletOption, type SalesFilters } from '@/components';
import {
    CategoryTable,
    ProductTable,
    StatementCard,
    type CategoryRow,
    type Line,
    type ProductRow,
} from '@/features/advance/management/report/components';
import { deltaPct } from '@/features/advance/management/report/lib/calculations';
import { cur, pct, type Cell, type CompanyInfo, type ReportExport } from '@/features/advance/management/report/lib/export';
import { DashboardSidebarLayout } from '@/layouts';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

const COMPANY: CompanyInfo = { name: 'Posave' };

interface Statement {
    grossSales: number;
    discounts: number;
    refunds: number;
    nettSales: number;
    gratuity: number;
    tax: number;
    rounding: number;
    totalCollected: number;
    cogs: number;
    grossProfit: number;
    margin: number;
}

interface Props {
    filters: SalesFilters;
    outlets: OutletOption[];
    statement: { current: Statement; previous: Statement };
    productSales: ProductRow[];
    categorySales: CategoryRow[];
}

type TabKey = 'penjualan' | 'laba' | 'produk' | 'kategori';

const TABS: { key: TabKey; label: string }[] = [
    { key: 'penjualan', label: 'Laporan Penjualan' },
    { key: 'laba', label: 'Laba Kotor' },
    { key: 'produk', label: 'Penjualan Barang' },
    { key: 'kategori', label: 'Kategori Penjualan' },
];

export default function Report({ filters, outlets, statement, productSales, categorySales }: Props) {
    const [tab, setTab] = useState<TabKey>('penjualan');
    const [compare, setCompare] = useState(true);
    const { current, previous } = statement;

    const outletName = filters.outlet_id ? (outlets.find((o) => o.id === filters.outlet_id)?.name ?? 'Outlet') : 'Semua Outlet';
    const subtitle = `Periode ${filters.label} · ${outletName}`;
    const periodSuffix = `${filters.from}_sd_${filters.to}`;

    const salesLines: Line[] = [
        { label: 'Gross Sales', current: current.grossSales, previous: previous.grossSales },
        { label: 'Discounts', current: current.discounts, previous: previous.discounts, deduction: true },
        { label: 'Refunds', current: current.refunds, previous: previous.refunds, deduction: true },
        { label: 'Nett Sales', current: current.nettSales, previous: previous.nettSales, bold: true },
        { label: 'Gratuity', current: current.gratuity, previous: previous.gratuity },
        { label: 'Tax', current: current.tax, previous: previous.tax },
        { label: 'Rounding', current: current.rounding, previous: previous.rounding },
        { label: 'Total Collected', current: current.totalCollected, previous: previous.totalCollected, bold: true },
    ];

    const labaLines: Line[] = [
        { label: 'Gross Sales', current: current.grossSales, previous: previous.grossSales },
        { label: 'Discounts', current: current.discounts, previous: previous.discounts, deduction: true },
        { label: 'Refunds', current: current.refunds, previous: previous.refunds, deduction: true },
        { label: 'Nett Sales', current: current.nettSales, previous: previous.nettSales, bold: true },
        { label: 'Cost of Goods Sold (COGS)', current: current.cogs, previous: previous.cogs, deduction: true },
        { label: 'Laba Kotor', current: current.grossProfit, previous: previous.grossProfit, bold: true },
        { label: 'Margin', current: current.margin, previous: previous.margin, bold: true, format: 'percent' },
    ];

    const valueCell = (l: Line, v: number): Cell => (l.format === 'percent' ? pct(v) : cur(l.deduction ? -v : v));

    const buildStatementExport = (lines: Line[], title: string, filenameBase: string): ReportExport => ({
        title,
        subtitle,
        company: COMPANY,
        columns: compare
            ? [
                  { header: 'Keterangan', align: 'left', width: 34 },
                  { header: 'Periode Ini', align: 'right' },
                  { header: 'Periode Lalu', align: 'right' },
                  { header: 'Perubahan %', align: 'right' },
              ]
            : [
                  { header: 'Keterangan', align: 'left', width: 34 },
                  { header: 'Nilai', align: 'right' },
              ],
        filenameBase: `${filenameBase}-${periodSuffix}`,
        boldRows: lines.flatMap((l, i) => (l.bold ? [i] : [])),
        rows: lines.map((l): Cell[] =>
            compare
                ? [l.label, valueCell(l, l.current), valueCell(l, l.previous), pct(deltaPct(l.current, l.previous))]
                : [l.label, valueCell(l, l.current)],
        ),
    });

    return (
        <DashboardSidebarLayout title="Laporan" description="Lihat dan kelola ringkasan dari penjualan anda">
            <Head title="Laporan" />

            <div className="flex min-h-screen flex-col gap-6 bg-[var(--page-bg)] p-4 sm:p-6 dark:bg-[var(--background)]">
                <SalesFilterBar routeName="dashboard.reports.index" outlets={outlets} filters={filters} showPrint={false} />

                <div className="-mt-2 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-xs text-[var(--grey-text)] dark:text-[var(--muted-foreground)]">
                        Periode <span className="font-medium text-[var(--subheading)] dark:text-white">{filters.label}</span>
                        {compare ? ' · dibandingkan periode sebelumnya.' : ' · laporan periode ini.'}
                    </p>
                    <button
                        type="button"
                        role="switch"
                        aria-checked={compare}
                        onClick={() => setCompare((v) => !v)}
                        className="flex cursor-pointer items-center gap-2.5 text-xs font-medium text-[var(--grey-text)] select-none dark:text-[var(--muted-foreground)]"
                    >
                        Bandingkan periode sebelumnya
                        <span
                            className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
                                compare ? 'bg-[var(--surface-header)]' : 'bg-[var(--border)] dark:bg-[var(--border-strong)]'
                            }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${compare ? 'translate-x-[18px]' : 'translate-x-0.5'}`}
                            />
                        </span>
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                    <nav className="flex flex-row flex-wrap gap-2 lg:col-span-3 lg:flex-col">
                        {TABS.map((t) => (
                            <button
                                key={t.key}
                                onClick={() => setTab(t.key)}
                                className={`rounded-lg px-4 py-2.5 text-left text-sm font-medium transition-colors ${
                                    tab === t.key
                                        ? 'bg-[var(--surface-header)] text-white'
                                        : 'bg-[var(--neutral-white)] text-[var(--grey-text)] hover:bg-[var(--second-accent)] dark:bg-[var(--card)] dark:text-[var(--muted-foreground)] dark:hover:bg-[var(--border-strong)]'
                                }`}
                            >
                                {t.label}
                            </button>
                        ))}
                    </nav>

                    <div className="lg:col-span-9">
                        {tab === 'penjualan' && (
                            <StatementCard
                                lines={salesLines}
                                compare={compare}
                                report={buildStatementExport(salesLines, 'Laporan Penjualan', 'laporan-penjualan')}
                            />
                        )}
                        {tab === 'laba' && (
                            <StatementCard
                                lines={labaLines}
                                compare={compare}
                                note="Laba Kotor adalah Nett Sales dikurangi Harga Pokok Penjualan (COGS). Pastikan semua produk memiliki COGS agar laba kotor akurat."
                                report={buildStatementExport(labaLines, 'Laba Kotor', 'laba-kotor')}
                            />
                        )}
                        {tab === 'produk' && <ProductTable rows={productSales} subtitle={subtitle} periodSuffix={periodSuffix} company={COMPANY} />}
                        {tab === 'kategori' && (
                            <CategoryTable rows={categorySales} subtitle={subtitle} periodSuffix={periodSuffix} company={COMPANY} />
                        )}
                    </div>
                </div>
            </div>
        </DashboardSidebarLayout>
    );
}
