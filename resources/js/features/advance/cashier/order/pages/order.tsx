import { AskChatbotButton, Badge, Button, SearchInput } from '@/components';
import { Card, CardContent, Input, Separator, Sheet, SheetContent } from '@/components/ui';
import { CartItem, CategoryOption, ItemOption } from '@/features/advance/cashier/order/type';
import { useChatbot } from '@/features/chatbot';
import { useLanguage } from '@/hooks';
import { CashierLayout } from '@/layouts';
import { Head, router } from '@inertiajs/react';
import axios from 'axios';
import { Banknote, ChevronLeft, ChevronRight, QrCode, ShoppingCart } from 'lucide-react';
import { useMemo, useState } from 'react';

interface Props {
    items: ItemOption[];
    categories: CategoryOption[];
}

const QUICK_AMOUNTS = [20000, 50000, 100000, 150000];

export default function OrderPage({ items, categories }: Props) {
    const { open } = useChatbot();
    const { t, locale } = useLanguage();
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState<number | 'all'>('all');
    const [cart, setCart] = useState<CartItem[]>([]);
    const [showPayment, setShowPayment] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'cash' | 'qris'>('cash');
    const [customerMoney, setCustomerMoney] = useState(0);
    const [showQris, setShowQris] = useState(false);
    const [sheetOpen, setSheetOpen] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [successInfo, setSuccessInfo] = useState<{ invoice: string; total: number } | null>(null);

    const dateLocale = locale === 'en' ? 'en-US' : 'id-ID';
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

    const handleConfirmPayment = async () => {
        setProcessing(true);
        try {
            const res = await axios.post(route('cashier.order.store'), {
                items: cart.map((c) => ({ item_id: c.itemId, qty: c.qty, note: c.note || null })),
                payment_method: paymentMethod,
            });

            setSuccessInfo({ invoice: res.data.invoice_no, total: res.data.total });
            setCart([]);
            handleCancel();

            router.reload({ only: ['items'] });
        } catch (err: any) {
            alert(err?.response?.data?.message ?? t('cashier.order.paymentFailedError'));
        } finally {
            setProcessing(false);
        }
    };

    const orderDetailInner = (
        <>
            <div className="p-5">
                <h2 className="text-base font-bold tracking-widest uppercase">{t('cashier.order.detail.title')}</h2>
                <div className="mt-1 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">
                        {new Date().toLocaleDateString(dateLocale, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                </div>
            </div>
            <Separator className="bg-white/10" />

            <div className="flex justify-between px-5 pt-3 pb-2 text-[11px] text-slate-400">
                <span>{t('cashier.order.detail.itemHeader')}</span>
                <div className="flex gap-8">
                    <span>{t('cashier.order.detail.qtyHeader')}</span>
                    <span>{t('cashier.order.detail.priceHeader')}</span>
                </div>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto px-5 pb-2">
                {cart.length === 0 && <p className="pt-4 text-center text-xs text-slate-400">{t('cashier.order.detail.emptyCart')}</p>}
                {cart.map((item, index) => (
                    <div key={item.itemId} className="space-y-1.5">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-blue-500/20 text-lg">🛒</div>
                                <div>
                                    <p className="text-xs leading-tight font-semibold text-slate-200">{item.name}</p>
                                    <p className="text-[10px] text-slate-400">Rp. {item.price.toLocaleString('id-ID')}</p>
                                </div>
                            </div>
                            <div className="flex flex-shrink-0 items-center gap-3">
                                <Badge className="rounded border border-white/20 bg-white/10 px-2 py-0.5 text-xs font-bold text-white">
                                    {item.qty}
                                </Badge>
                                <span className="text-[11px] font-medium text-slate-300">Rp. {(item.price * item.qty).toLocaleString('id-ID')}</span>
                            </div>
                        </div>
                        <Input
                            aria-label={`${t('cashier.order.detail.noteAriaPrefix')} ${item.name}`}
                            value={item.note}
                            onChange={(e) => updateNote(index, e.target.value)}
                            placeholder={t('cashier.order.detail.notePlaceholder')}
                            className="h-8 rounded-lg border-white/20 bg-white text-xs text-slate-900 placeholder:text-slate-400"
                        />
                    </div>
                ))}
            </div>

            <Separator className="bg-white/10" />
            <div className="space-y-1.5 p-5">
                <div className="flex justify-between text-xs text-slate-400">
                    <span>{t('cashier.order.detail.discountLabel')}</span>
                    <span>Rp. {discount}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-white">
                    <span>{t('cashier.order.detail.subtotalLabel')}</span>
                    <span>Rp. {subtotal.toLocaleString('id-ID')}</span>
                </div>
            </div>
            <Separator className="bg-white/10" />

            <div className="space-y-2 p-5">
                <Button
                    aria-label={t('cashier.order.detail.printAria')}
                    variant="outline"
                    className="h-10 w-full border-white/20 bg-transparent text-xs font-semibold text-white hover:bg-white/10 hover:text-white"
                >
                    {t('cashier.order.detail.printButton')}
                </Button>
                {!showPayment && (
                    <Button
                        aria-label={t('cashier.order.detail.continueAria')}
                        onClick={handleLanjutPembayaran}
                        disabled={cart.length === 0}
                        className="h-11 w-full bg-white text-xs font-bold text-slate-900 hover:bg-slate-100 disabled:opacity-50"
                    >
                        {t('cashier.order.detail.continueButton')}
                    </Button>
                )}
            </div>
        </>
    );

    const paymentInner = (
        <>
            <div className="p-5">
                <h2 className="text-base font-bold">{t('cashier.order.payment.title')}</h2>
                <p className="text-[11px] text-sky-300">{t('cashier.order.payment.methodsCount')}</p>
            </div>
            <Separator className="bg-sky-800" />

            <div className="flex-1 space-y-5 overflow-y-auto p-5">
                <div>
                    <p className="mb-3 text-xs font-bold text-sky-200">{t('cashier.order.payment.methodsLabel')}</p>
                    <div className="grid grid-cols-2 gap-3">
                        {(
                            [
                                { id: 'cash', label: t('cashier.order.payment.cash'), icon: <Banknote className="h-6 w-6" /> },
                                { id: 'qris', label: t('cashier.order.payment.qris'), icon: <QrCode className="h-6 w-6" /> },
                            ] as const
                        ).map((method) => (
                            <button
                                aria-label={`${t('cashier.order.payment.selectMethodAriaPrefix')} ${method.label}`}
                                key={method.id}
                                onClick={() => {
                                    setPaymentMethod(method.id);
                                    setShowQris(false);
                                }}
                                className={`flex flex-col items-center justify-center gap-1.5 rounded-xl border p-4 transition ${
                                    paymentMethod === method.id
                                        ? 'border-white bg-sky-800 text-white'
                                        : 'border-sky-700 bg-sky-950/50 text-sky-300 hover:bg-sky-800'
                                }`}
                            >
                                {method.icon}
                                <span className="text-[11px] font-bold">{method.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <Separator className="bg-sky-800" />

                <div className="flex items-center justify-between">
                    <span className="text-xs text-sky-200">{t('cashier.order.payment.totalBill')}</span>
                    <span className="text-sm font-bold text-white">Rp. {totalTagihan.toLocaleString('id-ID')}</span>
                </div>

                {paymentMethod === 'cash' && (
                    <div className="space-y-3">
                        <p className="text-xs font-bold text-sky-200">{t('cashier.order.payment.customerAmountLabel')}</p>
                        <div className="grid grid-cols-2 gap-2">
                            {QUICK_AMOUNTS.map((amount, i) => (
                                <Button
                                    aria-label={`${t('cashier.order.payment.quickAmountAriaPrefix')} ${amount}`}
                                    key={i}
                                    onClick={() => setCustomerMoney(amount)}
                                    className={`h-9 text-xs font-medium ${
                                        customerMoney === amount
                                            ? 'bg-white text-slate-900 hover:bg-slate-100'
                                            : 'border border-sky-700 bg-sky-950/60 text-sky-100 hover:bg-sky-800'
                                    }`}
                                >
                                    Rp. {amount.toLocaleString('id-ID')}
                                </Button>
                            ))}
                        </div>
                        <Input
                            aria-label={t('cashier.order.payment.customerAmountAria')}
                            type="number"
                            value={customerMoney || ''}
                            onChange={(e) => setCustomerMoney(Number(e.target.value))}
                            placeholder={t('cashier.order.payment.customerAmountPlaceholder')}
                            className="h-10 border-sky-700 bg-white text-slate-900 placeholder:text-slate-400"
                        />
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-sky-200">{t('cashier.order.payment.change')}</span>
                            <span className="font-bold text-white">Rp. {kembalian.toLocaleString('id-ID')}</span>
                        </div>
                    </div>
                )}

                {paymentMethod === 'qris' && (
                    <div className="flex items-center justify-center rounded-xl bg-sky-950/50 py-8">
                        {showQris ? (
                            <div className="flex flex-col items-center gap-2 rounded-lg bg-white p-4 text-black">
                                <div className="flex h-36 w-36 items-center justify-center rounded border-2 border-slate-200 bg-slate-100 text-[10px] font-bold text-slate-400">
                                    {t('cashier.order.payment.qrisCode')}
                                </div>
                                <span className="text-[10px] text-slate-500">{t('cashier.order.payment.qrisScanHint')}</span>
                            </div>
                        ) : (
                            <Button
                                aria-label={t('cashier.order.payment.showQrisAria')}
                                onClick={() => setShowQris(true)}
                                className="bg-white px-8 text-xs font-bold text-slate-900 hover:bg-slate-100"
                            >
                                {t('cashier.order.payment.showQrisButton')}
                            </Button>
                        )}
                    </div>
                )}
            </div>

            <Separator className="bg-sky-800" />
            <div className="space-y-2 p-5">
                <Button
                    aria-label={t('cashier.order.payment.cancelAria')}
                    onClick={handleCancel}
                    variant="outline"
                    className="h-10 w-full border-sky-700 bg-transparent text-xs text-white hover:bg-sky-800 hover:text-white"
                >
                    {t('cashier.order.payment.cancelButton')}
                </Button>
                <Button
                    aria-label={t('cashier.order.payment.confirmAria')}
                    onClick={handleConfirmPayment}
                    disabled={processing || (paymentMethod === 'cash' && customerMoney < totalTagihan)}
                    className="h-11 w-full bg-white text-xs font-bold text-slate-900 hover:bg-slate-100 disabled:opacity-50"
                >
                    {processing ? t('cashier.order.payment.processingButton') : t('cashier.order.payment.confirmButton')}
                </Button>
            </div>
        </>
    );

    return (
        <CashierLayout>
            <Head title={t('cashier.order.pageTitle')} />

            <div className="bg-background flex flex-1 flex-col overflow-y-auto p-4 sm:p-6">
                <div className="mb-6 flex items-center gap-3 sm:gap-4">
                    <SearchInput
                        value={search}
                        onChange={setSearch}
                        onSubmit={(e) => e.preventDefault()}
                        placeholder={t('cashier.order.searchPlaceholder')}
                        variant="kiosk"
                    />
                    <AskChatbotButton className="ml-auto" />
                </div>

                {successInfo && (
                    <div className="mb-4 rounded-lg border border-[var(--success)] bg-[var(--success-background)] px-4 py-3 text-sm text-[var(--success)]">
                        {t('cashier.order.successPrefix')} <strong>{successInfo.invoice}</strong> · {t('cashier.order.successTotalLabel')} Rp.{' '}
                        {successInfo.total.toLocaleString('id-ID')}
                    </div>
                )}

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

            <div className="hidden w-[340px] flex-col border-l border-white/10 bg-[var(--sidebar)] text-white lg:flex">{orderDetailInner}</div>

            {showPayment && <div className="hidden w-[320px] flex-col border-l border-sky-950 bg-sky-900 text-white xl:flex">{paymentInner}</div>}

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
                onOpenChange={(open) => {
                    if (!open) handleCancel();
                    else setSheetOpen(true);
                }}
            >
                <SheetContent
                    side="right"
                    className="flex w-[90vw] flex-col border-l-0 p-0 text-white sm:w-[85vw] sm:max-w-[400px]"
                    style={{ background: showPayment ? 'rgb(12 74 110)' : 'var(--sidebar)' }}
                >
                    <div className="flex flex-1 flex-col overflow-hidden">{showPayment ? paymentInner : orderDetailInner}</div>
                </SheetContent>
            </Sheet>
        </CashierLayout>
    );
}
