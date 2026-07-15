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
        <DashboardSidebarLayout title="Dashboard" description="Kelola semua kebutuhan anda disini">
            <Head title="Dashboard" />

            <div className="flex min-h-screen flex-col gap-6 bg-[var(--page-bg)] p-4 sm:p-6 dark:bg-[var(--background)]">
                <SalesFilterBar routeName="dashboard.index" outlets={outlets} filters={filters} onPrint={goToReports} />

                <p className="-mt-2 text-xs text-[var(--grey-text)] dark:text-[var(--muted-foreground)]">
                    Menampilkan data <span className="font-medium text-[var(--subheading)] dark:text-white">{filters.label}</span> · dibandingkan
                    dengan periode sebelumnya.
                </p>

                <PendingTransfersCard transfers={pendingTransfers} count={pendingTransfersCount} />

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
                    <KpiCard
                        icon={Wallet}
                        label="Total Penjualan"
                        value={formatRupiah(kpis.totalSales.value)}
                        color="var(--success)"
                        bg="var(--success-background)"
                        delta={kpis.totalSales.deltaPct}
                    />
                    <KpiCard
                        icon={Receipt}
                        label="Total Transaksi"
                        value={formatNumber(kpis.totalTransactions.value)}
                        color="var(--income-icon-text)"
                        bg="var(--income-icon-bg)"
                        delta={kpis.totalTransactions.deltaPct}
                    />
                    <KpiCard
                        icon={Boxes}
                        label="Produk Terjual"
                        value={formatNumber(kpis.productsSold.value)}
                        suffix="Item"
                        color="var(--warning)"
                        bg="var(--warning-background)"
                        delta={kpis.productsSold.deltaPct}
                    />
                    <KpiCard
                        icon={TrendingUp}
                        label="Rata-rata / Transaksi"
                        value={formatRupiah(kpis.averageSale.value)}
                        color="var(--category-color-1)"
                        bg="var(--category-bg-color-3)"
                        delta={kpis.averageSale.deltaPct}
                    />
                    <KpiCard
                        icon={PiggyBank}
                        label="Laba Kotor"
                        value={formatRupiah(kpis.grossProfit.value)}
                        color="var(--success)"
                        bg="var(--success-background)"
                        delta={kpis.grossProfit.deltaPct}
                    />
                    <KpiCard
                        icon={Percent}
                        label="Margin"
                        value={formatPct(kpis.margin.value)}
                        color="var(--income-icon-text)"
                        bg="var(--income-icon-bg)"
                        delta={kpis.margin.deltaPct}
                    />
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                    <div className="rounded-2xl border border-[var(--border)] bg-[var(--neutral-white)] p-4 shadow-sm sm:p-6 lg:col-span-8 dark:border-[var(--border-strong)] dark:bg-[var(--card)]">
                        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="text-sm font-semibold text-[var(--subheading)] dark:text-white">Grafik Penjualan</h3>
                                    <DeltaBadge value={kpis.totalSales.deltaPct} compact />
                                </div>
                                <p className="mt-1 text-2xl font-bold text-[var(--subheading)] dark:text-white">
                                    {metric === 'omzet'
                                        ? formatRupiah(kpis.totalSales.value)
                                        : `${formatNumber(kpis.totalTransactions.value)} transaksi`}
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <MetricToggle metric={metric} onChange={setMetric} />
                                <Link
                                    href={route('dashboard.reports.index')}
                                    className="flex items-center gap-1 text-xs font-medium text-[var(--secondary-700)] hover:underline dark:text-[var(--muted-foreground)] dark:hover:text-white"
                                >
                                    Lihat Laporan
                                    <ArrowUpRight className="h-3.5 w-3.5" />
                                </Link>
                            </div>
                        </div>
                        <Suspense fallback={<ChartSkeleton className="h-[260px]" />}>
                            <SalesTrendChart data={salesTrend} metric={metric} />
                        </Suspense>
                        <div className="mt-2 flex items-center gap-4 text-[11px] text-[var(--grey-text)] dark:text-[var(--muted-foreground)]">
                            <span className="flex items-center gap-1.5">
                                <span className="h-2 w-4 rounded-full bg-[#377ba3]" /> Periode ini
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="h-0.5 w-4 rounded-full bg-[#cbd5e1]" /> Periode sebelumnya
                            </span>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-[var(--border)] bg-[var(--neutral-white)] p-4 shadow-sm sm:p-6 lg:col-span-4 dark:border-[var(--border-strong)] dark:bg-[var(--card)]">
                        <h3 className="mb-4 text-sm font-semibold text-[var(--subheading)] dark:text-white">Ringkasan Kategori</h3>
                        <Suspense fallback={<ChartSkeleton className="h-[240px]" />}>
                            <CategoryDonut data={categorySummary} />
                        </Suspense>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                    <div className="rounded-2xl border border-[var(--border)] bg-[var(--neutral-white)] p-4 shadow-sm sm:p-6 lg:col-span-8 dark:border-[var(--border-strong)] dark:bg-[var(--card)]">
                        <div className="mb-4 flex items-center gap-2">
                            <Clock className="h-4 w-4 text-[var(--grey-text)] dark:text-[var(--muted-foreground)]" />
                            <h3 className="text-sm font-semibold text-[var(--subheading)] dark:text-white">Jam Ramai</h3>
                            <span className="text-xs text-[var(--grey-text)] dark:text-[var(--muted-foreground)]">— penjualan per jam</span>
                        </div>
                        <Suspense fallback={<ChartSkeleton className="h-[220px]" />}>
                            <HourlySalesChart data={hourlySales} />
                        </Suspense>
                    </div>

                    <div className="rounded-2xl border border-[var(--border)] bg-[var(--neutral-white)] p-4 shadow-sm sm:p-6 lg:col-span-4 dark:border-[var(--border-strong)] dark:bg-[var(--card)]">
                        <div className="mb-4 flex items-center gap-2">
                            <CreditCard className="h-4 w-4 text-[var(--grey-text)] dark:text-[var(--muted-foreground)]" />
                            <h3 className="text-sm font-semibold text-[var(--subheading)] dark:text-white">Metode Pembayaran</h3>
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
