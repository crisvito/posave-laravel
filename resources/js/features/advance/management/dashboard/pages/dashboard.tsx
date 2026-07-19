import { SalesFilterBar, type OutletOption, type SalesFilters } from '@/components';
import {
    ChartSkeleton,
    DeltaBadge,
    KpiCard,
    MetricToggle,
    PaymentBreakdown,
    PendingTransfersCard,
    QuickActionsCard,
    RecentTransaction,
    RecentTransactionsCard,
    TopProduct,
    TopProductsCard,
    TrendMetric,
    TrendPoint,
    type CategorySlice,
    type HourPoint,
    type Kpi,
    type PaymentSlice,
    type PendingTransfer,
} from '@/features/advance/management/dashboard/components';
import { useLanguage } from '@/hooks';
import { DashboardSidebarLayout } from '@/layouts';
import { formatNumber, formatPct, formatRupiah } from '@/lib/format';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowUpRight, Boxes, Clock, CreditCard, Percent, PiggyBank, Receipt, TrendingUp, Wallet } from 'lucide-react';
import { lazy, Suspense, useState } from 'react';

const SalesTrendChart = lazy(() => import('../components/sales-trend-chart').then((m) => ({ default: m.SalesTrendChart })));
const HourlySalesChart = lazy(() => import('../components/hourly-sales-chart').then((m) => ({ default: m.HourlySalesChart })));
const CategoryDonut = lazy(() => import('../components/category-donut').then((m) => ({ default: m.CategoryDonut })));

interface Kpis {
    totalSales: Kpi;
    totalTransactions: Kpi;
    productsSold: Kpi;
    averageSale: Kpi;
    grossProfit: Kpi;
    margin: Kpi;
}

interface Props {
    filters: SalesFilters;
    outlets: OutletOption[];
    kpis: Kpis;
    salesTrend: TrendPoint[];
    hourlySales: HourPoint[];
    paymentBreakdown: PaymentSlice[];
    categorySummary: CategorySlice[];
    topProducts: TopProduct[];
    recentTransactions: RecentTransaction[];
    pendingTransfers: PendingTransfer[];
    pendingTransfersCount: number;
}

export default function Dashboard({
    filters,
    outlets,
    kpis,
    salesTrend,
    hourlySales,
    paymentBreakdown,
    categorySummary,
    topProducts,
    recentTransactions,
    pendingTransfers,
    pendingTransfersCount,
}: Props) {
    const { t } = useLanguage();
    const [metric, setMetric] = useState<TrendMetric>('omzet');

    const goToReports = () => {
        const params: Record<string, string> = { range: filters.range };
        if (filters.outlet_id) params.outlet_id = String(filters.outlet_id);
        if (filters.range === 'custom') {
            params.from = filters.from;
            params.to = filters.to;
        }
        router.get(route('dashboard.reports.index'), params);
    };

    return (
        <DashboardSidebarLayout title={t('dashboardAdvance.dashboard.layoutTitle')} description={t('dashboardAdvance.dashboard.layoutDescription')}>
            <Head title={t('dashboardAdvance.dashboard.headTitle')} />

            <div className="flex min-h-screen flex-col gap-6 bg-[var(--page-bg)] p-4 sm:p-6">
                <SalesFilterBar routeName="dashboard.index" outlets={outlets} filters={filters} onPrint={goToReports} />

                <p className="-mt-2 text-xs text-[var(--grey-text)]">
                    {t('dashboardAdvance.dashboard.periodPrefix')} <span className="font-medium text-[var(--subheading)]">{filters.label}</span> ·{' '}
                    {t('dashboardAdvance.dashboard.periodSuffix').replace('· ', '')}
                </p>

                <PendingTransfersCard transfers={pendingTransfers} count={pendingTransfersCount} />

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
                    <KpiCard
                        icon={Wallet}
                        label={t('dashboardAdvance.dashboard.kpis.totalSales')}
                        value={formatRupiah(kpis.totalSales.value)}
                        color="var(--success)"
                        bg="var(--success-background)"
                        delta={kpis.totalSales.deltaPct}
                    />
                    <KpiCard
                        icon={Receipt}
                        label={t('dashboardAdvance.dashboard.kpis.totalTransactions')}
                        value={formatNumber(kpis.totalTransactions.value)}
                        color="var(--income-icon-text)"
                        bg="var(--income-icon-bg)"
                        delta={kpis.totalTransactions.deltaPct}
                    />
                    <KpiCard
                        icon={Boxes}
                        label={t('dashboardAdvance.dashboard.kpis.productsSold')}
                        value={formatNumber(kpis.productsSold.value)}
                        suffix={t('dashboardAdvance.dashboard.kpis.productsSoldSuffix')}
                        color="var(--warning)"
                        bg="var(--warning-background)"
                        delta={kpis.productsSold.deltaPct}
                    />
                    <KpiCard
                        icon={TrendingUp}
                        label={t('dashboardAdvance.dashboard.kpis.averageSale')}
                        value={formatRupiah(kpis.averageSale.value)}
                        color="var(--category-color-1)"
                        bg="var(--category-bg-color-3)"
                        delta={kpis.averageSale.deltaPct}
                    />
                    <KpiCard
                        icon={PiggyBank}
                        label={t('dashboardAdvance.dashboard.kpis.grossProfit')}
                        value={formatRupiah(kpis.grossProfit.value)}
                        color="var(--success)"
                        bg="var(--success-background)"
                        delta={kpis.grossProfit.deltaPct}
                    />
                    <KpiCard
                        icon={Percent}
                        label={t('dashboardAdvance.dashboard.kpis.margin')}
                        value={formatPct(kpis.margin.value)}
                        color="var(--income-icon-text)"
                        bg="var(--income-icon-bg)"
                        delta={kpis.margin.deltaPct}
                    />
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                    <div className="rounded-2xl border border-[var(--border-strong)] bg-[var(--card)] p-4 shadow-sm sm:p-6 lg:col-span-8">
                        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="text-sm font-semibold text-[var(--subheading)]">
                                        {t('dashboardAdvance.dashboard.salesChart.title')}
                                    </h3>
                                    <DeltaBadge value={kpis.totalSales.deltaPct} compact />
                                </div>
                                <p className="mt-1 text-2xl font-bold text-[var(--subheading)]">
                                    {metric === 'omzet'
                                        ? formatRupiah(kpis.totalSales.value)
                                        : `${formatNumber(kpis.totalTransactions.value)} ${t('dashboardAdvance.dashboard.salesChart.transactionsSuffix')}`}
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <MetricToggle metric={metric} onChange={setMetric} />
                                <Link
                                    href={route('dashboard.reports.index')}
                                    className="flex items-center gap-1 text-xs font-medium text-[var(--secondary-700)] hover:underline"
                                >
                                    {t('dashboardAdvance.dashboard.salesChart.viewReport')}
                                    <ArrowUpRight className="h-3.5 w-3.5" />
                                </Link>
                            </div>
                        </div>
                        <Suspense fallback={<ChartSkeleton className="h-[260px]" />}>
                            <SalesTrendChart data={salesTrend} metric={metric} />
                        </Suspense>
                        <div className="mt-2 flex items-center gap-4 text-[11px] text-[var(--grey-text)]">
                            <span className="flex items-center gap-1.5">
                                <span className="h-2 w-4 rounded-full bg-[var(--secondary-700)]" />{' '}
                                {t('dashboardAdvance.dashboard.salesChart.currentPeriod')}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="h-0.5 w-4 rounded-full bg-[var(--border-strong)]" />{' '}
                                {t('dashboardAdvance.dashboard.salesChart.previousPeriod')}
                            </span>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-[var(--border-strong)] bg-[var(--card)] p-4 shadow-sm sm:p-6 lg:col-span-4">
                        <h3 className="mb-4 text-sm font-semibold text-[var(--subheading)]">
                            {t('dashboardAdvance.dashboard.categorySummary.title')}
                        </h3>
                        <Suspense fallback={<ChartSkeleton className="h-[240px]" />}>
                            <CategoryDonut data={categorySummary} />
                        </Suspense>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                    <div className="rounded-2xl border border-[var(--border-strong)] bg-[var(--card)] p-4 shadow-sm sm:p-6 lg:col-span-8">
                        <div className="mb-4 flex items-center gap-2">
                            <Clock className="h-4 w-4 text-[var(--grey-text)]" />
                            <h3 className="text-sm font-semibold text-[var(--subheading)]">{t('dashboardAdvance.dashboard.hourlyPeak.title')}</h3>
                            <span className="text-xs text-[var(--grey-text)]">{t('dashboardAdvance.dashboard.hourlyPeak.subtitle')}</span>
                        </div>
                        <Suspense fallback={<ChartSkeleton className="h-[220px]" />}>
                            <HourlySalesChart data={hourlySales} />
                        </Suspense>
                    </div>

                    <div className="rounded-2xl border border-[var(--border-strong)] bg-[var(--card)] p-4 shadow-sm sm:p-6 lg:col-span-4">
                        <div className="mb-4 flex items-center gap-2">
                            <CreditCard className="h-4 w-4 text-[var(--grey-text)]" />
                            <h3 className="text-sm font-semibold text-[var(--subheading)]">{t('dashboardAdvance.dashboard.paymentMethod.title')}</h3>
                        </div>
                        <PaymentBreakdown data={paymentBreakdown} />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                    <TopProductsCard products={topProducts} className="lg:col-span-4" />
                    <RecentTransactionsCard transactions={recentTransactions} className="lg:col-span-4" />
                    <QuickActionsCard className="lg:col-span-4" />
                </div>
            </div>
        </DashboardSidebarLayout>
    );
}
