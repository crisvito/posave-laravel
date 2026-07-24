import { Button } from '@/components';
import { HistoryDetailModal } from '@/features/lite/order/components';
import { useLanguage } from '@/hooks';
import { DashboardSidebarLayout } from '@/layouts';
import { Head, router } from '@inertiajs/react';
import { CalendarDays, ChevronLeft, ChevronRight, ClipboardList } from 'lucide-react';
import { useRef, useState } from 'react';

type TransactionStatus = 'completed' | 'refunded' | 'void';
type CartItem = { name: string; price: number; qty: number };

type TransactionRow = {
    id: number;
    invoice: string;
    time: string;
    date: string;
    paymentMethod: string;
    total: number;
    status: TransactionStatus;
    items: CartItem[];
};

interface Props {
    transactions: TransactionRow[];
    filters: { date: string; payment_method: string };
}

const STATUS_META: Record<TransactionStatus, { bg: string; text: string }> = {
    completed: { bg: 'var(--success-background)', text: 'var(--success)' },
    refunded: { bg: 'var(--warning-background)', text: 'var(--warning)' },
    void: { bg: 'var(--danger-background)', text: 'var(--danger)' },
};

export default function HistoryPage({ transactions, filters }: Props) {
    const { t, locale } = useLanguage();
    const dateInputRef = useRef<HTMLInputElement>(null);
    const [selected, setSelected] = useState<TransactionRow | null>(null);

    const STATUS_LABEL: Record<TransactionStatus, string> = {
        completed: t('dashboardLite.history.status.completed'),
        refunded: t('dashboardLite.history.status.refunded'),
        void: t('dashboardLite.history.status.void'),
    };

    const PAYMENT_CHIPS = [
        { value: 'all', label: t('dashboardLite.history.paymentChips.all') },
        { value: 'cash', label: t('dashboardLite.history.paymentChips.cash') },
        { value: 'qris', label: t('dashboardLite.history.paymentChips.qris') },
    ];

    const dateLocale = locale === 'en' ? 'en-US' : 'id-ID';
    const activeDate = new Date(filters.date + 'T00:00:00');
    const formattedDate = activeDate.toLocaleDateString(dateLocale, { day: 'numeric', month: 'long', year: 'numeric' });

    const goTo = (params: { date?: string; payment_method?: string }) => {
        router.get(
            route('lite.history.index'),
            { date: params.date ?? filters.date, payment_method: params.payment_method ?? filters.payment_method },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    const prevDay = () => {
        const n = new Date(filters.date);
        n.setDate(n.getDate() - 1);
        const year = n.getFullYear();
        const month = String(n.getMonth() + 1).padStart(2, '0');
        const day = String(n.getDate()).padStart(2, '0');

        goTo({ date: `${year}-${month}-${day}` });
    };

    const nextDay = () => {
        const n = new Date(filters.date);
        n.setDate(n.getDate() + 1);
        const year = n.getFullYear();
        const month = String(n.getMonth() + 1).padStart(2, '0');
        const day = String(n.getDate()).padStart(2, '0');

        goTo({ date: `${year}-${month}-${day}` });
    };

    const totalHariIni = transactions.reduce((s, t) => s + t.total, 0);

    return (
        <DashboardSidebarLayout title={t('dashboardLite.history.pageTitle')} description={t('dashboardLite.history.pageDescription')}>
            <Head title={t('dashboardLite.history.pageTitle')} />
            <div className="min-h-screen bg-[var(--page-bg)] p-4 sm:p-6 dark:bg-[var(--background)]">
                <div className="mb-4 flex items-center justify-center gap-3 rounded-md border border-[var(--border-strong)] bg-[var(--neutral-white)] p-3 dark:border-[var(--border-strong)] dark:bg-[var(--primary-900)]">
                    <button
                        aria-label={t('dashboardLite.history.prevDayAria')}
                        onClick={prevDay}
                        className="rounded-full p-2 hover:bg-[var(--second-accent)] dark:hover:bg-[var(--border-strong)]"
                    >
                        <ChevronLeft className="h-5 w-5 text-[var(--subheading)] dark:text-[var(--neutral-white)]" />
                    </button>
                    <div
                        onClick={() => dateInputRef.current?.showPicker()}
                        className="flex cursor-pointer items-center gap-2 text-base font-bold text-[var(--subheading)] dark:text-[var(--neutral-white)]"
                    >
                        <CalendarDays className="h-5 w-5 text-[var(--grey-text)] dark:text-[var(--neutral-white)]" />
                        {formattedDate}
                        <input
                            aria-label={t('dashboardLite.history.datePickerAria')}
                            ref={dateInputRef}
                            type="date"
                            value={filters.date}
                            onChange={(e) => e.target.value && goTo({ date: e.target.value })}
                            className="pointer-events-none absolute h-0 w-0 opacity-0"
                        />
                    </div>
                    <button
                        aria-label={t('dashboardLite.history.nextDayAria')}
                        onClick={nextDay}
                        className="rounded-full p-2 hover:bg-[var(--second-accent)] dark:hover:bg-[var(--border-strong)]"
                    >
                        <ChevronRight className="h-5 w-5 text-[var(--subheading)] dark:text-[var(--neutral-white)]" />
                    </button>
                </div>

                {transactions.length > 0 && (
                    <div className="mb-4 flex items-center justify-between rounded-2xl border-2 border-[var(--surface-header)] bg-[var(--second-accent)] px-5 py-4 dark:border-[var(--border-strong)] dark:bg-[var(--border-strong)]">
                        <span className="text-base font-bold text-[var(--subheading)] dark:text-[var(--neutral-white)]">
                            {t('dashboardLite.history.totalToday')}
                        </span>
                        <span className="text-xl font-extrabold text-[var(--subheading)] dark:text-[var(--neutral-white)]">
                            Rp {totalHariIni.toLocaleString('id-ID')}
                        </span>
                    </div>
                )}

                <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
                    {PAYMENT_CHIPS.map((chip) => (
                        <Button
                            aria-label={`${t('dashboardLite.history.filterAriaPrefix')} ${chip.label}`}
                            key={chip.value}
                            variant="outline"
                            onClick={() => goTo({ payment_method: chip.value })}
                            className={`shrink-0 border-2 px-4 py-2 text-sm font-semibold transition hover:bg-[var(--surface-header)] hover:text-[var(--neutral-white)] dark:hover:bg-[var(--neutral-white)] dark:hover:text-[var(--primary-900)] ${
                                filters.payment_method === chip.value
                                    ? 'bg-[var(--surface-header)] text-white dark:bg-[var(--neutral-white)] dark:text-[var(--primary-900)]'
                                    : ''
                            }`}
                        >
                            {chip.label}
                        </Button>
                    ))}
                </div>

                {transactions.length === 0 ? (
                    <div className="rounded-md border-2 border-dashed border-[var(--border-strong)] bg-[var(--neutral-white)] py-16 text-center dark:border-[var(--border-strong)] dark:bg-[var(--primary-900)]">
                        <ClipboardList className="mx-auto mb-2 h-8 w-8 text-[var(--grey-text-muted)]" />
                        <p className="font-medium text-[var(--subheading)] dark:text-[var(--neutral-white)]">
                            {t('dashboardLite.history.emptyState')}
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {transactions.map((tx) => {
                            const meta = STATUS_META[tx.status];
                            return (
                                <button
                                    aria-label={`${t('dashboardLite.history.rowAriaPrefix')} ${tx.invoice}`}
                                    key={tx.id}
                                    onClick={() => setSelected(tx)}
                                    className="flex items-center justify-between gap-3 rounded-2xl border border-[var(--border-strong)] bg-[var(--neutral-white)] p-4 text-left shadow-sm transition hover:border-[var(--surface-header)] dark:border-[var(--border-strong)] dark:bg-[var(--primary-900)]"
                                >
                                    <div>
                                        <p className="text-base font-bold text-[var(--subheading)] dark:text-[var(--neutral-white)]">{tx.invoice}</p>
                                        <p className="text-sm text-[var(--grey-text)] dark:text-[var(--neutral-white)]">
                                            {tx.time} · {tx.paymentMethod.toUpperCase()}
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <span className="text-base font-extrabold text-[var(--subheading)] dark:text-[var(--neutral-white)]">
                                            Rp {tx.total.toLocaleString('id-ID')}
                                        </span>
                                        <span
                                            className="rounded-full px-2.5 py-0.5 text-xs font-bold"
                                            style={{ backgroundColor: meta.bg, color: meta.text }}
                                        >
                                            {STATUS_LABEL[tx.status]}
                                        </span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            {selected && <HistoryDetailModal transaction={selected} onClose={() => setSelected(null)} />}
        </DashboardSidebarLayout>
    );
}
