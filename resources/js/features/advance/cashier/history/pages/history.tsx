import {
    AskChatbotButton,
    Badge,
    Button,
    DateNavigator,
    SearchInput,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    SidebarTrigger,
} from '@/components';
import { Separator } from '@/components/ui';
import { CashierSidePanel } from '@/features/advance/cashier/components';
import { STATUS_BADGE_STYLES, STATUS_LABEL, type Transaction } from '@/features/advance/cashier/history/type';
import { useChatbot } from '@/features/chatbot';
import { useLanguage } from '@/hooks';
import { CashierLayout } from '@/layouts';
import { Head, router } from '@inertiajs/react';
import { Mail, Printer } from 'lucide-react';
import { useState } from 'react';

interface Props {
    transactions: Transaction[];
    filters: { date: string; search?: string; payment_method: string };
}

export default function HistoryPage({ transactions, filters }: Props) {
    const { open } = useChatbot();
    const { t } = useLanguage();
    const [search, setSearch] = useState(filters.search ?? '');
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [sheetOpen, setSheetOpen] = useState(false);

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

    const selected = transactions.find((t) => t.id === selectedId) ?? null;
    const subtotal = selected ? selected.items.reduce((s, i) => s + i.price * i.qty, 0) : 0;

    const handleRowClick = (id: number) => {
        setSelectedId(id);
        if (window.innerWidth < 1024) setSheetOpen(true);
    };

    const historyDetailInner = (
        <>
            <div className="p-5">
                <h2 className="text-base font-bold tracking-widest uppercase">{t('cashier.history.detail.title')}</h2>
                <div className="mt-1 flex items-center justify-between text-[11px]">
                    <span className="font-medium text-slate-300">Kopiakin Resto</span>
                    {selected && <span className="text-slate-400">{selected.dateLabel}</span>}
                </div>
            </div>
            <Separator className="bg-white/10" />

            <div className="flex-1 overflow-y-auto">
                {selected ? (
                    <div className="space-y-4 p-5">
                        <div className="flex items-center justify-between">
                            <Badge
                                variant="outline"
                                className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_BADGE_STYLES[selected.status]}`}
                            >
                                {STATUS_LABEL[selected.status]}
                            </Badge>
                            <span className="text-sm font-bold text-white">{selected.invoice}</span>
                        </div>

                        <div className="space-y-1.5 text-xs">
                            <div className="flex justify-between">
                                <span className="text-slate-400">{t('cashier.history.detail.timeLabel')}</span>
                                <span className="font-medium text-slate-200">
                                    {selected.date}, {selected.time}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">{t('cashier.history.detail.paymentMethodLabel')}</span>
                                <span className="font-medium text-slate-200">{selected.paymentMethod.toUpperCase()}</span>
                            </div>
                        </div>

                        <Separator className="bg-white/10" />

                        <div className="flex justify-between text-[11px] text-slate-400">
                            <span>{t('cashier.history.detail.itemHeader')}</span>
                            <div className="flex gap-8">
                                <span>{t('cashier.history.detail.qtyHeader')}</span>
                                <span>{t('cashier.history.detail.priceHeader')}</span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {selected.items.map((item, i) => (
                                <div key={i} className="space-y-1.5">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-white/10 text-lg">
                                                🛒
                                            </div>
                                            <div>
                                                <p className="text-xs leading-tight font-semibold text-slate-200">{item.name}</p>
                                                <p className="text-[10px] text-slate-400">Rp. {item.price.toLocaleString('id-ID')}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-shrink-0 items-center gap-3">
                                            <Badge className="rounded border border-white/20 bg-white/10 px-2 py-0.5 text-xs font-bold text-white">
                                                {item.qty}
                                            </Badge>
                                            <span className="text-[11px] font-medium text-slate-300">
                                                Rp. {(item.price * item.qty).toLocaleString('id-ID')}
                                            </span>
                                        </div>
                                    </div>
                                    {item.note && <p className="rounded-md bg-white/5 px-2 py-1 text-[11px] text-slate-300">📝 {item.note}</p>}
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="flex h-full items-center justify-center text-xs text-slate-500">{t('cashier.history.detail.emptySelection')}</div>
                )}
            </div>

            <div>
                <Separator className="bg-white/10" />
                <div className="space-y-1.5 p-5">
                    <div className="flex justify-between text-xs text-slate-400">
                        <span>{t('cashier.history.detail.discountLabel')}</span>
                        <span>Rp. {selected ? selected.discount.toLocaleString('id-ID') : 0}</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-white">
                        <span>{t('cashier.history.detail.subtotalLabel')}</span>
                        <span>Rp. {subtotal.toLocaleString('id-ID')}</span>
                    </div>
                </div>
                <Separator className="bg-white/10" />
                <div className="space-y-2 p-5">
                    <Button
                        aria-label={t('cashier.history.detail.printAria')}
                        variant="outline"
                        className="h-10 w-full border-white/20 bg-transparent text-xs font-semibold text-white hover:bg-white/10 hover:text-white"
                    >
                        <Printer className="h-3.5 w-3.5" />
                        {t('cashier.history.detail.printButton')}
                    </Button>
                    <Button
                        aria-label={t('cashier.history.detail.emailAria')}
                        className="h-11 w-full bg-white text-xs font-bold text-slate-900 hover:bg-slate-100"
                    >
                        <Mail className="h-3.5 w-3.5" />
                        {t('cashier.history.detail.emailButton')}
                    </Button>
                </div>
            </div>
        </>
    );

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
                            variant="kiosk"
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
                {historyDetailInner}
            </CashierSidePanel>
        </CashierLayout>
    );
}
