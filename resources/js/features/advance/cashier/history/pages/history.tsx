import {
    AskChatbotButton,
    DateNavigator,
    SearchInput,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    SidebarTrigger,
} from '@/components';
import { CashierSidePanel, HistoryDetailPanel, PrintableReceipt, SendReceiptEmailModal } from '@/features/advance/cashier/components';
import type { Transaction } from '@/features/advance/cashier/history/type';
import { useChatbot } from '@/features/chatbot';
import { useLanguage } from '@/hooks';
import { CashierLayout } from '@/layouts';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

interface CompanyProfileForReceipt {
    name?: string;
    address?: string;
    phone?: string;
    logo?: string;
}

interface Props {
    transactions: Transaction[];
    filters: { date: string; search?: string; payment_method: string };
    company_profile?: CompanyProfileForReceipt | null;
    receipt_notes?: string | null;
}

export default function HistoryPage({ transactions, filters, company_profile = null, receipt_notes = null }: Props) {
    const { open } = useChatbot();
    const { t } = useLanguage();
    const [search, setSearch] = useState(filters.search ?? '');
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [sheetOpen, setSheetOpen] = useState(false);
    const [showEmailModal, setShowEmailModal] = useState(false);

    const goToDate = (date: string) => {
        router.get(
            route('cashier.history.index'),
            { date, search: filters.search, payment_method: filters.payment_method },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            route('cashier.history.index'),
            { date: filters.date, search: search || undefined, payment_method: filters.payment_method },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    const handlePaymentFilter = (value: string) => {
        router.get(
            route('cashier.history.index'),
            { date: filters.date, search: filters.search, payment_method: value },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    const selected = transactions.find((tx) => tx.id === selectedId) ?? null;
    const subtotal = selected ? selected.items.reduce((s, i) => s + i.price * i.qty, 0) : 0;

    const handleRowClick = (id: number) => {
        setSelectedId(id);
        if (window.innerWidth < 1024) setSheetOpen(true);
    };

    return (
        <CashierLayout>
            <Head title={t('cashier.history.pageTitle')} />

            <div className="bg-background flex flex-1 flex-col overflow-hidden">
                <div className="flex flex-wrap items-center gap-3 p-4 sm:gap-4 sm:p-6">
                    <SidebarTrigger />
                    <div className="min-w-[180px] flex-1 sm:max-w-sm sm:flex-none">
                        <SearchInput
                            value={search}
                            onChange={setSearch}
                            onSubmit={handleSearchSubmit}
                            placeholder={t('cashier.history.searchPlaceholder')}
                        />
                    </div>
                    <AskChatbotButton className="ml-auto" />
                </div>

                <div className="flex flex-wrap items-center gap-3 px-4 pb-2 sm:px-6">
                    <DateNavigator date={filters.date} onChange={goToDate} variant="kiosk" size="sm" />

                    <div className="ml-auto">
                        <Select value={filters.payment_method} onValueChange={handlePaymentFilter}>
                            <SelectTrigger
                                aria-label={t('cashier.history.paymentFilter.aria')}
                                className="h-9 w-44 border-[var(--border-strong)] bg-[var(--card)] text-sm"
                            >
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">{t('cashier.history.paymentFilter.all')}</SelectItem>
                                <SelectItem value="cash">{t('cashier.history.paymentFilter.cash')}</SelectItem>
                                <SelectItem value="qris">{t('cashier.history.paymentFilter.qris')}</SelectItem>
                                <SelectItem value="debit">{t('cashier.history.paymentFilter.debit')}</SelectItem>
                                <SelectItem value="transfer">{t('cashier.history.paymentFilter.transfer')}</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    <div className="px-4 pt-4 pb-6 sm:px-6">
                        <div className="mb-3 hidden grid-cols-[1.2fr_1fr_1fr_1fr] border-b border-[var(--border-strong)] px-4 pb-2.5 sm:grid">
                            {[
                                { label: t('cashier.history.table.order'), align: 'text-left' },
                                { label: t('cashier.history.table.time'), align: 'text-left' },
                                { label: t('cashier.history.table.paymentMethod'), align: 'text-center' },
                                { label: t('cashier.history.table.total'), align: 'text-center' },
                            ].map(({ label, align }) => (
                                <span key={label} className={`text-sm font-bold tracking-wide text-[var(--subheading)] ${align}`}>
                                    {label}
                                </span>
                            ))}
                        </div>

                        {transactions.length === 0 ? (
                            <div className="flex h-64 items-center justify-center text-sm text-[var(--grey-text-muted)]">
                                {t('cashier.history.emptyState')}
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {transactions.map((tx) => (
                                    <button
                                        aria-label={`${t('cashier.history.rowAriaPrefix')} ${tx.invoice}`}
                                        key={tx.id}
                                        onClick={() => handleRowClick(tx.id)}
                                        className={`w-full rounded-xl border px-4 py-4 text-left transition ${
                                            selectedId === tx.id
                                                ? 'border-[var(--secondary-600)] bg-[var(--secondary-600)]/10'
                                                : 'border-[var(--border-strong)] bg-[var(--card)] hover:bg-[var(--accent)]'
                                        }`}
                                    >
                                        <div className="flex items-start justify-between sm:hidden">
                                            <div>
                                                <p className="text-sm font-semibold text-[var(--subheading)]">{tx.invoice}</p>
                                                <p className="text-xs text-[var(--grey-text)]">
                                                    {tx.date} · {tx.time}
                                                </p>
                                                <p className="mt-0.5 text-xs text-[var(--grey-text)]">{tx.paymentMethod.toUpperCase()}</p>
                                            </div>
                                            <div className="flex flex-col items-end gap-1.5">
                                                <span className="text-sm font-semibold text-[var(--subheading)]">
                                                    Rp. {tx.total.toLocaleString('id-ID')}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="hidden grid-cols-[1.2fr_1fr_1fr_1fr] items-center sm:grid">
                                            <span className="text-sm font-semibold text-[var(--subheading)]">{tx.invoice}</span>
                                            <div>
                                                <p className="text-sm font-medium text-[var(--subheading)]">{tx.time}</p>
                                                <p className="text-xs text-[var(--grey-text-muted)]">{tx.date}</p>
                                            </div>
                                            <span className="text-center text-sm text-[var(--grey-text)]">{tx.paymentMethod.toUpperCase()}</span>
                                            <span className="text-center text-sm font-semibold text-[var(--subheading)]">
                                                Rp. {tx.total.toLocaleString('id-ID')}
                                            </span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <CashierSidePanel sheetOpen={sheetOpen} onSheetOpenChange={setSheetOpen}>
                <HistoryDetailPanel
                    selected={selected}
                    subtotal={subtotal}
                    onPrint={() => window.print()}
                    onSendEmail={() => setShowEmailModal(true)}
                />
            </CashierSidePanel>

            {selected && (
                <PrintableReceipt
                    invoice={selected.invoice}
                    dateLabel={`${selected.date}, ${selected.time}`}
                    items={selected.items}
                    subtotal={subtotal}
                    discount={selected.discount}
                    total={selected.total}
                    paymentMethod={selected.paymentMethod}
                    companyProfile={company_profile}
                    receiptNotes={receipt_notes}
                />
            )}

            {showEmailModal && selected && (
                <SendReceiptEmailModal transactionId={selected.id} invoice={selected.invoice} onClose={() => setShowEmailModal(false)} />
            )}
        </CashierLayout>
    );
}
