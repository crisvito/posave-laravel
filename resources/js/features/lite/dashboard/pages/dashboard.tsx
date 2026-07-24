import { Button } from '@/components';
import { useLanguage } from '@/hooks';
import { DashboardSidebarLayout } from '@/layouts';
import { Head, Link, router } from '@inertiajs/react';
import { AlertTriangle, ArrowUpRight, Package, Receipt, TrendingUp } from 'lucide-react';
import { useState } from 'react';

interface TopItem {
    name: string;
    qty: number;
    omzet: number;
}
interface RecentTx {
    invoice: string;
    total: number;
    payment: string;
    time: string;
}

interface Props {
    filters: { range: string; label: string; from: string; to: string; days: number };
    kpis: { totalSales: number; totalTransactions: number; productsSold: number };
    stockSummary: { out_of_stock: number; low_stock: number };
    topItems: TopItem[];
    recentTransactions: RecentTx[];
}

export default function LiteDashboard({ filters, kpis, stockSummary, topItems, recentTransactions }: Props) {
    const { t } = useLanguage();
    const [showCustomPicker, setShowCustomPicker] = useState(filters.range === 'custom');
    const [fromDate, setFromDate] = useState(filters.from);
    const [toDate, setToDate] = useState(filters.to);

    const RANGE_CHIPS = [
        { value: 'today', label: t('dashboardLite.dashboard.rangeChips.today') },
        { value: '7d', label: t('dashboardLite.dashboard.rangeChips.week') },
        { value: '30d', label: t('dashboardLite.dashboard.rangeChips.month') },
        { value: 'custom', label: filters.range === 'custom' ? filters.label : t('dashboardLite.dashboard.rangeChips.custom') },
    ];

    const changeRange = (range: string) => {
        if (range === 'custom') {
            setShowCustomPicker(true);
            return;
        }
        setShowCustomPicker(false);
        router.get(route('dashboard.index'), { range }, { preserveState: true, preserveScroll: true, replace: true });
    };

    const applyCustomRange = () => {
        router.get(
            route('dashboard.index'),
            { range: 'custom', from: fromDate, to: toDate },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    return (
        <DashboardSidebarLayout title={t('dashboardLite.dashboard.pageTitle')} description={t('dashboardLite.dashboard.pageDescription')}>
            <Head title={t('dashboardLite.dashboard.headTitle')} />
            <div className="min-h-screen bg-[var(--page-bg)] p-4 sm:p-6 dark:bg-[var(--background)]">
                <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
                    {RANGE_CHIPS.map((chip) => (
                        <Button
                            aria-label={`${t('dashboardLite.dashboard.rangeAriaPrefix')} ${chip.label}`}
                            key={chip.value}
                            variant="outline"
                            onClick={() => changeRange(chip.value)}
                            className={`shrink-0 border-2 px-4 py-2 text-sm font-semibold whitespace-nowrap transition hover:bg-[var(--surface-header)] hover:text-[var(--neutral-white)]${
                                filters.range === chip.value
                                    ? 'bg-[var(--surface-header)] text-[var(--primary-900)] dark:bg-[var(--neutral-white)] dark:text-[var(--primary-900)]'
                                    : ''
                            }`}
                        >
                            {chip.label}
                        </Button>
                    ))}
                </div>

                {showCustomPicker && (
                    <div className="mb-5 flex flex-wrap items-end gap-3 rounded-md border border-[var(--border-strong)] bg-[var(--neutral-white)] p-4 dark:border-[var(--border-strong)] dark:bg-[var(--card)]">
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-medium text-[var(--grey-text)] dark:text-[var(--muted-foreground)]">
                                {t('dashboardLite.dashboard.customRange.fromLabel')}
                            </label>
                            <input
                                type="date"
                                value={fromDate}
                                max={toDate}
                                onChange={(e) => setFromDate(e.target.value)}
                                className="h-10 rounded-md border border-[var(--border-strong)] bg-transparent px-3 text-sm text-[var(--subheading)] dark:border-[var(--border-strong)] dark:text-[var(--neutral-white)]"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-medium text-[var(--grey-text)] dark:text-[var(--muted-foreground)]">
                                {t('dashboardLite.dashboard.customRange.toLabel')}
                            </label>
                            <input
                                type="date"
                                value={toDate}
                                min={fromDate}
                                onChange={(e) => setToDate(e.target.value)}
                                className="h-10 rounded-md border border-[var(--border-strong)] bg-transparent px-3 text-sm text-[var(--subheading)] dark:border-[var(--border-strong)] dark:text-[var(--neutral-white)]"
                            />
                        </div>
                        <Button
                            variant="outline"
                            onClick={applyCustomRange}
                            className="h-10 rounded-md bg-[var(--surface-header)] px-5 text-sm font-semibold text-white hover:bg-[var(--surface-header-hover)] dark:bg-[var(--neutral-white)] dark:text-[var(--primary-900)] dark:hover:text-[var(--neutral-white)] dark:hover:opacity-90"
                        >
                            {t('dashboardLite.dashboard.customRange.applyButton')}
                        </Button>
                    </div>
                )}

                <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div className="rounded-md border border-[var(--border-strong)] bg-[var(--neutral-white)] p-5 shadow-sm dark:border-[var(--border-strong)] dark:bg-[var(--card)]">
                        <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--success-background)]">
                            <TrendingUp className="h-5 w-5 text-[var(--success)]" />
                        </div>
                        <p className="text-sm text-[var(--grey-text)] dark:text-[var(--muted-foreground)]">
                            {t('dashboardLite.dashboard.kpi.totalSales')}
                        </p>
                        <p className="text-2xl font-extrabold text-[var(--subheading)] dark:text-white">
                            Rp {kpis.totalSales.toLocaleString('id-ID')}
                        </p>
                    </div>
                    <div className="rounded-md border border-[var(--border-strong)] bg-[var(--neutral-white)] p-5 shadow-sm dark:border-[var(--border-strong)] dark:bg-[var(--card)]">
                        <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--income-icon-bg)]">
                            <Receipt className="h-5 w-5 text-[var(--income-icon-text)]" />
                        </div>
                        <p className="text-sm text-[var(--grey-text)] dark:text-[var(--muted-foreground)]">
                            {t('dashboardLite.dashboard.kpi.totalTransactions')}
                        </p>
                        <p className="text-2xl font-extrabold text-[var(--subheading)] dark:text-white">{kpis.totalTransactions}</p>
                    </div>
                    <div className="rounded-md border border-[var(--border-strong)] bg-[var(--neutral-white)] p-5 shadow-sm dark:border-[var(--border-strong)] dark:bg-[var(--card)]">
                        <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--warning-background)]">
                            <Package className="h-5 w-5 text-[var(--warning)]" />
                        </div>
                        <p className="text-sm text-[var(--grey-text)] dark:text-[var(--muted-foreground)]">
                            {t('dashboardLite.dashboard.kpi.productsSold')}
                        </p>
                        <p className="text-2xl font-extrabold text-[var(--subheading)] dark:text-white">{kpis.productsSold}</p>
                    </div>
                </div>

                {(stockSummary.out_of_stock > 0 || stockSummary.low_stock > 0) && (
                    <div className="mb-5 flex flex-col gap-3 sm:flex-row">
                        {stockSummary.out_of_stock > 0 && (
                            <Link
                                href={route('lite.inventory.items.index', { stock_status: 'out' })}
                                className="flex flex-1 items-center justify-between rounded-md border-2 border-[var(--danger)] bg-[var(--danger-background)] px-5 py-4"
                            >
                                <span className="flex items-center gap-2 text-base font-bold text-[var(--danger)]">
                                    <AlertTriangle className="h-5 w-5" />
                                    {stockSummary.out_of_stock} {t('dashboardLite.dashboard.stockAlert.outOfStockSuffix')}
                                </span>
                                <ArrowUpRight className="h-5 w-5 text-[var(--danger)]" />
                            </Link>
                        )}
                        {stockSummary.low_stock > 0 && (
                            <Link
                                href={route('lite.inventory.items.index', { stock_status: 'low' })}
                                className="flex flex-1 items-center justify-between rounded-md border-2 border-[var(--warning)] bg-[var(--warning-background)] px-5 py-4"
                            >
                                <span className="flex items-center gap-2 text-base font-bold text-[var(--warning)]">
                                    <AlertTriangle className="h-5 w-5" />
                                    {stockSummary.low_stock} {t('dashboardLite.dashboard.stockAlert.lowStockSuffix')}
                                </span>
                                <ArrowUpRight className="h-5 w-5 text-[var(--warning)]" />
                            </Link>
                        )}
                    </div>
                )}

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <div className="rounded-md border border-[var(--border-strong)] bg-[var(--neutral-white)] p-5 shadow-sm dark:border-[var(--border-strong)] dark:bg-[var(--card)]">
                        <h3 className="mb-4 text-base font-bold text-[var(--subheading)] dark:text-white">
                            {t('dashboardLite.dashboard.topItems.title')}
                        </h3>
                        {topItems.length === 0 ? (
                            <p className="py-6 text-center text-sm text-[var(--grey-text)] dark:text-[var(--muted-foreground)]">
                                {t('dashboardLite.dashboard.topItems.empty')}
                            </p>
                        ) : (
                            <ul className="flex flex-col gap-3">
                                {topItems.map((item, i) => (
                                    <li key={item.name} className="flex items-center gap-3">
                                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--surface-header)] text-sm font-bold text-white">
                                            {i + 1}
                                        </span>
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-semibold text-[var(--subheading)] dark:text-white">{item.name}</p>
                                            <p className="text-xs text-[var(--grey-text)] dark:text-[var(--muted-foreground)]">
                                                {item.qty} {t('dashboardLite.dashboard.topItems.soldSuffix')}
                                            </p>
                                        </div>
                                        <span className="shrink-0 text-sm font-bold text-[var(--subheading)] dark:text-white">
                                            Rp {item.omzet.toLocaleString('id-ID')}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="rounded-md border border-[var(--border-strong)] bg-[var(--neutral-white)] p-5 shadow-sm dark:border-[var(--border-strong)] dark:bg-[var(--card)]">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-base font-bold text-[var(--subheading)] dark:text-white">
                                {t('dashboardLite.dashboard.recentTransactions.title')}
                            </h3>
                            <Link
                                href={route('lite.history.index')}
                                className="text-sm font-semibold text-[var(--surface-header)] hover:underline dark:text-white"
                            >
                                {t('dashboardLite.dashboard.recentTransactions.viewAll')}
                            </Link>
                        </div>
                        {recentTransactions.length === 0 ? (
                            <p className="py-6 text-center text-sm text-[var(--grey-text)] dark:text-[var(--muted-foreground)]">
                                {t('dashboardLite.dashboard.recentTransactions.empty')}
                            </p>
                        ) : (
                            <ul className="flex flex-col gap-3">
                                {recentTransactions.map((tx) => (
                                    <li key={tx.invoice} className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-semibold text-[var(--subheading)] dark:text-white">{tx.invoice}</p>
                                            <p className="text-xs text-[var(--grey-text)] dark:text-[var(--muted-foreground)]">{tx.time}</p>
                                        </div>
                                        <span className="text-sm font-bold text-[var(--subheading)] dark:text-white">
                                            Rp {tx.total.toLocaleString('id-ID')}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </DashboardSidebarLayout>
    );
}
