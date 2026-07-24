import { AskChatbotButton, Button, SearchInput } from '@/components';
import { Card, CardContent, Sheet, SheetContent, SidebarTrigger } from '@/components/ui';
import {
    OrderCartPanel,
    OrderPaymentPanel,
    PaymentConfirmModal,
    PaymentSuccessModal,
    PrintableOrderSlip,
    PrintableReceipt,
} from '@/features/advance/cashier/components';
import { CartItem, CategoryOption, ItemOption } from '@/features/advance/cashier/order/type';
import { useChatbot } from '@/features/chatbot';
import { useLanguage } from '@/hooks';
import { CashierLayout } from '@/layouts';
import { Head, router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react';
import { useMemo, useState } from 'react';

interface CompanyProfileForReceipt {
    name?: string;
    address?: string;
    phone?: string;
    logo?: string;
}

interface Props {
    items: ItemOption[];
    categories: CategoryOption[];
    company_profile?: CompanyProfileForReceipt | null;
    receipt_notes?: string | null;
}

interface SuccessSnapshot {
    invoice: string;
    total: number;
    date: Date;
    items: CartItem[];
    paymentMethod: 'cash' | 'qris';
    customerMoney: number;
    change: number;
    subtotal: number;
    discount: number;
}

export default function OrderPage({ items, categories, company_profile = null, receipt_notes = null }: Props) {
    const { open } = useChatbot();
    const { t, locale } = useLanguage();
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState<number | 'all'>('all');
    const [cart, setCart] = useState<CartItem[]>([]);
    const [qtyDrafts, setQtyDrafts] = useState<Record<number, string>>({});
    const [showPayment, setShowPayment] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'cash' | 'qris'>('cash');
    const [customerMoney, setCustomerMoney] = useState(0);
    const [showQris, setShowQris] = useState(false);
    const [sheetOpen, setSheetOpen] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [successData, setSuccessData] = useState<SuccessSnapshot | null>(null);

    const discount = 0;
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const totalTagihan = subtotal - discount;
    const kembalian = customerMoney > totalTagihan ? customerMoney - totalTagihan : 0;
    const cartCount = cart.reduce((s, i) => s + i.qty, 0);

    const filteredItems = useMemo(() => {
        return items.filter((i) => {
            const matchCategory = activeCategory === 'all' || i.category_id === activeCategory;
            const matchSearch = !search || i.name.toLowerCase().includes(search.toLowerCase());
            return matchCategory && matchSearch;
        });
    }, [items, activeCategory, search]);

    const remainingStock = (item: ItemOption) => {
        const inCart = cart.find((c) => c.itemId === item.id);
        return item.available_stock - (inCart?.qty ?? 0);
    };

    const handleAddToCart = (item: ItemOption) => {
        if (remainingStock(item) <= 0) return;

        setCart((prev) => {
            const existing = prev.find((c) => c.itemId === item.id);
            if (existing) {
                return prev.map((c) => (c.itemId === item.id ? { ...c, qty: c.qty + 1 } : c));
            }
            return [...prev, { itemId: item.id, name: item.name, price: item.price, qty: 1, note: '', maxStock: item.available_stock }];
        });
    };

    const updateNote = (index: number, note: string) => setCart((prev) => prev.map((item, i) => (i === index ? { ...item, note } : item)));

    const updateQty = (index: number, rawQty: number) => {
        setCart((prev) => {
            const item = prev[index];
            if (!item) return prev;
            const clamped = Math.max(0, Math.min(rawQty, item.maxStock));
            if (clamped === 0) return prev.filter((_, i) => i !== index);
            return prev.map((c, i) => (i === index ? { ...c, qty: clamped } : c));
        });
    };

    const handleIncrement = (index: number) => {
        const item = cart[index];
        if (item) updateQty(index, item.qty + 1);
    };

    const handleDecrement = (index: number) => {
        const item = cart[index];
        if (item) updateQty(index, item.qty - 1);
    };

    const handleRemoveItem = (index: number) => setCart((prev) => prev.filter((_, i) => i !== index));

    const handleQtyFocus = (itemId: number, currentQty: number) => setQtyDrafts((prev) => ({ ...prev, [itemId]: String(currentQty) }));

    const handleQtyDraftChange = (itemId: number, value: string) => {
        if (value !== '' && !/^\d+$/.test(value)) return;
        setQtyDrafts((prev) => ({ ...prev, [itemId]: value }));
    };

    const commitQtyDraft = (index: number, itemId: number) => {
        const draft = qtyDrafts[itemId];
        setQtyDrafts((prev) => {
            const next = { ...prev };
            delete next[itemId];
            return next;
        });
        if (draft === undefined) return;
        const parsed = draft === '' ? 0 : Number(draft);
        updateQty(index, parsed);
    };

    const handleLanjutPembayaran = () => {
        setShowPayment(true);
        if (window.innerWidth < 1280) setSheetOpen(true);
    };

    const handleCancel = () => {
        setShowPayment(false);
        setShowQris(false);
        setCustomerMoney(0);
        setSheetOpen(false);
    };

    const handlePaymentSuccess = (data: { invoice: string; total: number; date: Date }) => {
        setSuccessData({
            invoice: data.invoice,
            total: data.total,
            date: data.date,
            items: cart,
            paymentMethod,
            customerMoney,
            change: kembalian,
            subtotal,
            discount,
        });
        setShowConfirmModal(false);
        handleCancel();
        setCart([]);
        router.reload({ only: ['items'] });
    };

    const paymentPanelProps = {
        paymentMethod,
        onPaymentMethodChange: (method: 'cash' | 'qris') => {
            setPaymentMethod(method);
            setShowQris(false);
        },
        totalTagihan,
        customerMoney,
        onCustomerMoneyChange: setCustomerMoney,
        kembalian,
        showQris,
        onShowQris: () => setShowQris(true),
        onCancel: handleCancel,
        onConfirmClick: () => setShowConfirmModal(true),
        confirmDisabled: paymentMethod === 'cash' && customerMoney < totalTagihan,
    };

    const cartPanelProps = {
        cart,
        qtyDrafts,
        onQtyFocus: handleQtyFocus,
        onQtyDraftChange: handleQtyDraftChange,
        onQtyDraftCommit: commitQtyDraft,
        onIncrement: handleIncrement,
        onDecrement: handleDecrement,
        onRemove: handleRemoveItem,
        onNoteChange: updateNote,
        subtotal,
        discount,
        showContinueButton: !showPayment,
        onContinue: handleLanjutPembayaran,
        onPrintOrderSlip: () => window.print(),
    };

    return (
        <CashierLayout>
            <Head title={t('cashier.order.pageTitle')} />

            <div className="bg-background flex flex-1 flex-col overflow-y-auto p-4 sm:p-6">
                <div className="mb-6 flex items-center gap-3 sm:gap-4">
                    <SidebarTrigger />
                    <SearchInput
                        value={search}
                        onChange={setSearch}
                        onSubmit={(e) => e.preventDefault()}
                        placeholder={t('cashier.order.searchPlaceholder')}
                    />
                    <AskChatbotButton className="ml-auto" />
                </div>

                <div className="mb-6">
                    <div className="mb-3 flex items-center justify-between">
                        <h2 className="text-sm font-bold text-[var(--subheading)]">{t('cashier.order.category.title')}</h2>
                        <div className="hidden gap-1 sm:flex">
                            <Button
                                aria-label={t('cashier.order.category.scrollLeftAria')}
                                variant="outline"
                                size="icon"
                                className="h-7 w-7 rounded-full border-[var(--border-strong)]"
                            >
                                <ChevronLeft className="h-3 w-3" />
                            </Button>
                            <Button
                                aria-label={t('cashier.order.category.scrollRightAria')}
                                variant="outline"
                                size="icon"
                                className="h-7 w-7 rounded-full border-[var(--border-strong)]"
                            >
                                <ChevronRight className="h-3 w-3" />
                            </Button>
                        </div>
                    </div>
                    <div className="flex gap-3 overflow-x-auto pb-2">
                        <button
                            aria-label={t('cashier.order.category.allAria')}
                            onClick={() => setActiveCategory('all')}
                            className={`flex min-w-[76px] shrink-0 cursor-pointer items-center justify-center rounded-full border px-4 py-2.5 transition ${
                                activeCategory === 'all'
                                    ? 'border-[var(--surface-header)] bg-[var(--surface-header)] text-[var(--text-light)]'
                                    : 'border-[var(--border-strong)] bg-[var(--card)] text-[var(--subheading)] hover:bg-[var(--accent)]'
                            }`}
                        >
                            <span className="text-[11px] font-semibold">{t('cashier.order.category.all')}</span>
                        </button>
                        {categories.map((cat) => (
                            <button
                                aria-label={`${t('cashier.order.category.filterAriaPrefix')} ${cat.name}`}
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`flex min-w-[76px] shrink-0 cursor-pointer items-center justify-center rounded-full border px-4 py-2.5 transition ${
                                    activeCategory === cat.id
                                        ? 'border-[var(--surface-header)] bg-[var(--surface-header)] text-[var(--text-light)]'
                                        : 'border-[var(--border-strong)] bg-[var(--card)] text-[var(--subheading)] hover:bg-[var(--accent)]'
                                }`}
                            >
                                <span className="text-[11px] font-semibold">{cat.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <h2 className="mb-3 text-sm font-bold text-[var(--subheading)]">{t('cashier.order.menu.title')}</h2>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-4">
                        {filteredItems.map((item) => {
                            const stockLeft = remainingStock(item);
                            const isOut = stockLeft <= 0;
                            return (
                                <Card key={item.id} className="overflow-hidden border border-[var(--border-strong)] hover:shadow-sm">
                                    <CardContent className="flex flex-col items-center p-3">
                                        <div className="mb-3 flex h-24 w-full items-center justify-center overflow-hidden rounded-xl bg-[var(--second-accent)]">
                                            {item.image ? (
                                                <img src={`/storage/${item.image}`} alt={item.name} className="h-full w-full object-cover" />
                                            ) : (
                                                <span className="text-4xl">📦</span>
                                            )}
                                        </div>
                                        <p className="text-center text-xs leading-tight font-bold text-[var(--subheading)]">{item.name}</p>
                                        <p className="mb-1 text-center text-xs text-[var(--grey-text)]">Rp. {item.price.toLocaleString('id-ID')}</p>
                                        <p className={`mb-3 text-[10px] ${isOut ? 'text-[var(--danger)]' : 'text-[var(--grey-text-muted)]'}`}>
                                            {isOut ? t('cashier.order.menu.outOfStock') : `${t('cashier.order.menu.stockLeftLabel')} ${stockLeft}`}
                                        </p>
                                        <Button
                                            aria-label={`${t('cashier.order.menu.addAriaPrefix')} ${item.name} ${t('cashier.order.menu.addAriaSuffix')}`}
                                            size="sm"
                                            disabled={isOut}
                                            className="w-full rounded-full bg-[var(--surface-header)] text-xs font-medium text-white hover:bg-[var(--surface-header-hover)] disabled:opacity-40"
                                            onClick={() => handleAddToCart(item)}
                                        >
                                            {t('cashier.order.menu.addButton')}
                                        </Button>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="hidden w-[340px] flex-col border-l border-white/10 bg-[var(--sidebar)] text-white lg:flex">
                <OrderCartPanel {...cartPanelProps} />
            </div>

            {showPayment && (
                <div className="hidden w-[320px] flex-col border-l border-[var(--border-strong)] bg-[var(--primary-900)] text-white xl:flex">
                    <OrderPaymentPanel {...paymentPanelProps} />
                </div>
            )}

            {cartCount > 0 && !sheetOpen && (
                <button
                    aria-label={t('cashier.order.detail.continueAria')}
                    onClick={() => setSheetOpen(true)}
                    className="fixed right-4 bottom-4 z-40 flex items-center gap-2 rounded-full bg-[var(--sidebar)] px-4 py-3 text-white shadow-2xl sm:right-6 sm:bottom-6 sm:px-5 sm:py-3.5 lg:hidden"
                >
                    <ShoppingCart className="h-4 w-4" />
                    <span className="text-sm font-bold">
                        {cartCount} item · Rp. {subtotal.toLocaleString('id-ID')}
                    </span>
                </button>
            )}

            <Sheet
                open={sheetOpen}
                onOpenChange={(sheetIsOpen) => {
                    if (!sheetIsOpen) handleCancel();
                    else setSheetOpen(true);
                }}
            >
                <SheetContent
                    side="right"
                    className="flex w-[90vw] flex-col border-l-0 p-0 text-white sm:w-[85vw] sm:max-w-[400px]"
                    style={{ background: showPayment ? 'var(--primary-900)' : 'var(--sidebar)' }}
                >
                    <div className="flex flex-1 flex-col overflow-hidden">
                        {showPayment ? <OrderPaymentPanel {...paymentPanelProps} /> : <OrderCartPanel {...cartPanelProps} />}
                    </div>
                </SheetContent>
            </Sheet>

            {showConfirmModal && (
                <PaymentConfirmModal
                    cart={cart}
                    paymentMethod={paymentMethod}
                    total={totalTagihan}
                    customerMoney={customerMoney}
                    change={kembalian}
                    onClose={() => setShowConfirmModal(false)}
                    onSuccess={handlePaymentSuccess}
                />
            )}

            {successData && (
                <PaymentSuccessModal
                    invoice={successData.invoice}
                    total={successData.total}
                    onPrint={() => window.print()}
                    onClose={() => setSuccessData(null)}
                />
            )}

            {successData && (
                <PrintableReceipt
                    invoice={successData.invoice}
                    dateLabel={successData.date.toLocaleString(locale === 'en' ? 'en-US' : 'id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                    })}
                    items={successData.items}
                    subtotal={successData.subtotal}
                    discount={successData.discount}
                    total={successData.total}
                    paymentMethod={successData.paymentMethod}
                    customerMoney={successData.customerMoney}
                    change={successData.change}
                    companyProfile={company_profile}
                    receiptNotes={receipt_notes}
                />
            )}

            <PrintableOrderSlip items={cart} subtotal={subtotal} discount={discount} />
        </CashierLayout>
    );
}
