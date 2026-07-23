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
import { useLanguage } from '@/hooks';
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

export default function Report({ filters, outlets, statement, productSales, categorySales }: Props) {
    const { t } = useLanguage();
    const [tab, setTab] = useState<TabKey>('penjualan');
    const [compare, setCompare] = useState(true);
    const { current, previous } = statement;

    const TABS: { key: TabKey; label: string }[] = [
        { key: 'penjualan', label: t('dashboardAdvance.report.tabs.sales') },
        { key: 'laba', label: t('dashboardAdvance.report.tabs.grossProfit') },
        { key: 'produk', label: t('dashboardAdvance.report.tabs.productSales') },
        { key: 'kategori', label: t('dashboardAdvance.report.tabs.categorySales') },
    ];

    const outletName = filters.outlet_id
        ? (outlets.find((o) => o.id === filters.outlet_id)?.name ?? t('dashboardAdvance.report.outletFallback'))
        : t('dashboardAdvance.report.allOutlets');
    const subtitle = `${t('dashboardAdvance.report.periodPrefix')} ${filters.label} · ${outletName}`;
    const periodSuffix = `${filters.from}_sd_${filters.to}`;

    const salesLines: Line[] = [
        { label: t('dashboardAdvance.report.lines.grossSales'), current: current.grossSales, previous: previous.grossSales },
        { label: t('dashboardAdvance.report.lines.refunds'), current: current.refunds, previous: previous.refunds, deduction: true },
        { label: t('dashboardAdvance.report.lines.nettSales'), current: current.nettSales, previous: previous.nettSales, bold: true },
        { label: t('dashboardAdvance.report.lines.rounding'), current: current.rounding, previous: previous.rounding },
        { label: t('dashboardAdvance.report.lines.totalCollected'), current: current.totalCollected, previous: previous.totalCollected, bold: true },
    ];

    const labaLines: Line[] = [
        { label: t('dashboardAdvance.report.lines.grossSales'), current: current.grossSales, previous: previous.grossSales },
        { label: t('dashboardAdvance.report.lines.discounts'), current: current.discounts, previous: previous.discounts, deduction: true },
        { label: t('dashboardAdvance.report.lines.refunds'), current: current.refunds, previous: previous.refunds, deduction: true },
        { label: t('dashboardAdvance.report.lines.nettSales'), current: current.nettSales, previous: previous.nettSales, bold: true },
        { label: t('dashboardAdvance.report.lines.cogs'), current: current.cogs, previous: previous.cogs, deduction: true },
        { label: t('dashboardAdvance.report.lines.grossProfit'), current: current.grossProfit, previous: previous.grossProfit, bold: true },
        { label: t('dashboardAdvance.report.lines.margin'), current: current.margin, previous: previous.margin, bold: true, format: 'percent' },
    ];

    const valueCell = (l: Line, v: number): Cell => (l.format === 'percent' ? pct(v) : cur(l.deduction ? -v : v));

    const buildStatementExport = (lines: Line[], title: string, filenameBase: string): ReportExport => ({
        title,
        subtitle,
        company: COMPANY,
        columns: compare
            ? [
                  { header: t('dashboardAdvance.report.exportColumns.description'), align: 'left', width: 34 },
                  { header: t('dashboardAdvance.report.exportColumns.currentPeriod'), align: 'right' },
                  { header: t('dashboardAdvance.report.exportColumns.previousPeriod'), align: 'right' },
                  { header: t('dashboardAdvance.report.exportColumns.changePercent'), align: 'right' },
              ]
            : [
                  { header: t('dashboardAdvance.report.exportColumns.description'), align: 'left', width: 34 },
                  { header: t('dashboardAdvance.report.exportColumns.value'), align: 'right' },
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
        <DashboardSidebarLayout title={t('dashboardAdvance.report.layoutTitle')} description={t('dashboardAdvance.report.layoutDescription')}>
            <Head title={t('dashboardAdvance.report.headTitle')} />

            <div className="flex min-h-screen flex-col gap-6 bg-[var(--page-bg)] p-4 sm:p-6">
                <SalesFilterBar routeName="dashboard.reports.index" outlets={outlets} filters={filters} showPrint={false} />

                <div className="-mt-2 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-xs text-[var(--grey-text)]">
                        {t('dashboardAdvance.report.periodPrefix')} <span className="font-medium text-[var(--subheading)]">{filters.label}</span>
                        {compare ? t('dashboardAdvance.report.periodComparedSuffix') : t('dashboardAdvance.report.periodCurrentSuffix')}
                    </p>
                    <button
                        type="button"
                        role="switch"
                        aria-checked={compare}
                        onClick={() => setCompare((v) => !v)}
                        className="flex cursor-pointer items-center gap-2.5 text-xs font-medium text-[var(--grey-text)] select-none"
                    >
                        {t('dashboardAdvance.report.compareToggleLabel')}
                        <span
                            className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
                                compare ? 'bg-[var(--surface-header)]' : 'bg-[var(--border-strong)]'
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
                        {TABS.map((tItem) => (
                            <button
                                key={tItem.key}
                                onClick={() => setTab(tItem.key)}
                                className={`rounded-lg px-4 py-2.5 text-left text-sm font-medium transition-colors ${
                                    tab === tItem.key
                                        ? 'bg-[var(--surface-header)] text-white'
                                        : 'bg-[var(--card)] text-[var(--grey-text)] hover:bg-[var(--second-accent)]'
                                }`}
                            >
                                {tItem.label}
                            </button>
                        ))}
                    </nav>

                    <div className="lg:col-span-9">
                        {tab === 'penjualan' && (
                            <StatementCard
                                lines={salesLines}
                                compare={compare}
                                report={buildStatementExport(salesLines, t('dashboardAdvance.report.tabs.sales'), 'laporan-penjualan')}
                            />
                        )}
                        {tab === 'laba' && (
                            <StatementCard
                                lines={labaLines}
                                compare={compare}
                                note={t('dashboardAdvance.report.grossProfitNote')}
                                report={buildStatementExport(labaLines, t('dashboardAdvance.report.tabs.grossProfit'), 'laba-kotor')}
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
