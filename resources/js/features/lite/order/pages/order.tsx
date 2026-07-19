import { Button, Input } from '@/components/ui';
import { PaymentModal } from '@/features/lite/order/components';
import { useLanguage } from '@/hooks';
import { DashboardSidebarLayout } from '@/layouts';
import { Head, router } from '@inertiajs/react';
import { Minus, Plus, Search, ShoppingCart, X } from 'lucide-react';
import { useMemo, useState } from 'react';

interface ItemOption {
    id: number;
    name: string;
    price: number;
    category_id: number;
    category: { id: number; name: string; color: string | null };
    image: string | null;
    available_stock: number;
}

interface CategoryOption {
    id: number;
    name: string;
    color: string | null;
}

interface Props {
    items: ItemOption[];
    categories: CategoryOption[];
}

type CartItem = { itemId: number; name: string; price: number; qty: number };

export default function OrderPage({ items, categories }: Props) {
    const { t } = useLanguage();
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState<number | 'all'>('all');
    const [cart, setCart] = useState<CartItem[]>([]);
    const [cartOpen, setCartOpen] = useState(false);
    const [showPayment, setShowPayment] = useState(false);
    const [successInfo, setSuccessInfo] = useState<{ invoice: string; total: number } | null>(null);

    const filteredItems = useMemo(() => {
        return items.filter((i) => {
            const matchCategory = activeCategory === 'all' || i.category_id === activeCategory;
            const matchSearch = !search || i.name.toLowerCase().includes(search.toLowerCase());
            return matchCategory && matchSearch;
        });
    }, [items, activeCategory, search]);

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const cartCount = cart.reduce((s, i) => s + i.qty, 0);

    const remainingStock = (item: ItemOption) => {
        const inCart = cart.find((c) => c.itemId === item.id);
        return item.available_stock - (inCart?.qty ?? 0);
    };

    const handleAddToCart = (item: ItemOption) => {
        if (remainingStock(item) <= 0) return;
        setCart((prev) => {
            const existing = prev.find((c) => c.itemId === item.id);
            if (existing) return prev.map((c) => (c.itemId === item.id ? { ...c, qty: c.qty + 1 } : c));
            return [...prev, { itemId: item.id, name: item.name, price: item.price, qty: 1 }];
        });
    };

    const handleDecrease = (itemId: number) => {
        setCart((prev) => prev.map((c) => (c.itemId === itemId ? { ...c, qty: c.qty - 1 } : c)).filter((c) => c.qty > 0));
    };

    const handleRemove = (itemId: number) => setCart((prev) => prev.filter((c) => c.itemId !== itemId));

    const handlePaymentSuccess = (invoice: string, total: number) => {
        setSuccessInfo({ invoice, total });
        setCart([]);
        setShowPayment(false);
        setCartOpen(false);
        router.reload({ only: ['items'] });
    };

    const cartPanel = (
        <div className="flex h-full flex-col">
            <div className="flex items-center justify-between p-4">
                <h3 className="text-lg font-bold text-[var(--subheading)] dark:text-[var(--neutral-white)]">{t('dashboardLite.order.cart.title')}</h3>
                <button aria-label={t('dashboardLite.order.cart.closeAria')} onClick={() => setCartOpen(false)} className="lg:hidden">
                    <X className="h-5 w-5 text-[var(--grey-text)] dark:text-[var(--neutral-white)]" />
                </button>
            </div>
            <div className="flex-1 overflow-y-auto px-4">
                {cart.length === 0 ? (
                    <p className="py-10 text-center text-sm text-[var(--grey-text)] dark:text-[var(--neutral-white)]">
                        {t('dashboardLite.order.cart.empty')}
                    </p>
                ) : (
                    <div className="flex flex-col gap-3">
                        {cart.map((item) => (
                            <div
                                key={item.itemId}
                                className="flex items-center justify-between gap-2 rounded-xl border border-[var(--border-strong)] p-3 dark:border-[var(--border-strong)]"
                            >
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-semibold text-[var(--subheading)] dark:text-[var(--neutral-white)]">
                                        {item.name}
                                    </p>
                                    <p className="text-xs text-[var(--grey-text)] dark:text-[var(--neutral-white)]">
                                        Rp {item.price.toLocaleString('id-ID')}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        aria-label={`${t('dashboardLite.order.cart.decreaseAriaPrefix')} ${item.name}`}
                                        onClick={() => handleDecrease(item.itemId)}
                                        className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border-strong)] dark:border-[var(--border-strong)] dark:text-[var(--neutral-white)] dark:hover:bg-white/10"
                                    >
                                        <Minus className="h-3.5 w-3.5" />
                                    </button>
                                    <span className="w-5 text-center text-sm font-bold dark:text-[var(--neutral-white)]">{item.qty}</span>
                                    <button
                                        aria-label={`${t('dashboardLite.order.cart.increaseAriaPrefix')} ${item.name}`}
                                        onClick={() => handleAddToCart({ id: item.itemId, price: item.price, name: item.name } as ItemOption)}
                                        className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border-strong)] dark:border-[var(--border-strong)] dark:text-[var(--neutral-white)] dark:hover:bg-white/10"
                                    >
                                        <Plus className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className="border-t border-[var(--border-strong)] p-4 dark:border-[var(--border-strong)]">
                <div className="mb-3 flex justify-between text-base font-bold text-[var(--subheading)] dark:text-[var(--neutral-white)]">
                    <span>{t('dashboardLite.order.cart.total')}</span>
                    <span>Rp {subtotal.toLocaleString('id-ID')}</span>
                </div>
                <Button
                    aria-label={t('dashboardLite.order.cart.payAria')}
                    disabled={cart.length === 0}
                    onClick={() => setShowPayment(true)}
                    className="h-12 w-full rounded-xl bg-[var(--surface-header)] text-base font-bold hover:bg-[var(--surface-header-hover)] disabled:opacity-50 dark:bg-[var(--neutral-white)] dark:text-[var(--primary-900)] dark:hover:opacity-90"
                >
                    {t('dashboardLite.order.cart.payButton')}
                </Button>
            </div>
        </div>
    );

    return (
        <DashboardSidebarLayout title={t('dashboardLite.order.pageTitle')} description={t('dashboardLite.order.pageDescription')}>
            <Head title={t('dashboardLite.order.pageTitle')} />
            <div className="flex min-h-screen bg-[var(--page-bg)] dark:bg-[var(--background)]">
                <div className="flex-1 p-4 sm:p-6">
                    {successInfo && (
                        <div className="mb-4 flex items-center justify-between rounded-2xl border-2 border-[var(--success)] bg-[var(--success-background)] px-4 py-3">
                            <span className="text-sm font-semibold text-[var(--success)]">
                                {t('dashboardLite.order.successPrefix')} {successInfo.invoice} · Rp {successInfo.total.toLocaleString('id-ID')}
                            </span>
                            <button aria-label={t('dashboardLite.order.successCloseAria')} onClick={() => setSuccessInfo(null)}>
                                <X className="h-4 w-4 text-[var(--success)]" />
                            </button>
                        </div>
                    )}

                    <div className="relative mb-4">
                        <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-[var(--grey-text)] dark:text-[var(--neutral-white)]" />
                        <Input
                            aria-label={t('dashboardLite.order.search.aria')}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder={t('dashboardLite.order.search.placeholder')}
                            className="h-12 rounded-md border-[var(--border-strong)] bg-[var(--neutral-white)] pl-12 text-base dark:border-[var(--border-strong)] dark:bg-[var(--primary-900)] dark:text-[var(--neutral-white)]"
                        />
                    </div>

                    <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
                        <Button
                            aria-label={t('dashboardLite.order.category.allAria')}
                            onClick={() => setActiveCategory('all')}
                            variant="outline"
                            className={`shrink-0 border-2 px-4 py-2 text-sm font-semibold transition hover:bg-[var(--surface-header)] hover:text-[var(--neutral-white)] dark:hover:bg-[var(--neutral-white)] dark:hover:text-[var(--primary-900)] ${
                                activeCategory === 'all'
                                    ? 'bg-[var(--surface-header)] text-white dark:bg-[var(--neutral-white)] dark:text-[var(--primary-900)]'
                                    : ''
                            }`}
                        >
                            {t('dashboardLite.order.category.all')}
                        </Button>
                        {categories.map((cat) => (
                            <Button
                                variant="outline"
                                aria-label={`${t('dashboardLite.order.category.filterAriaPrefix')} ${cat.name}`}
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`shrink-0 border-2 px-4 py-2 text-sm font-semibold transition hover:bg-[var(--surface-header)] hover:text-[var(--neutral-white)] dark:hover:bg-[var(--neutral-white)] dark:hover:text-[var(--primary-900)] ${
                                    activeCategory === cat.id
                                        ? 'bg-[var(--surface-header)] text-white dark:bg-[var(--neutral-white)] dark:text-[var(--primary-900)]'
                                        : ''
                                }`}
                            >
                                <span
                                    className="flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white"
                                    style={{ backgroundColor: cat.color ?? '#94a3b8' }}
                                >
                                    {cat.name.charAt(0).toUpperCase()}
                                </span>
                                {cat.name}
                            </Button>
                        ))}
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
                        {filteredItems.map((item) => {
                            const stockLeft = remainingStock(item);
                            const isOut = stockLeft <= 0;
                            return (
                                <div
                                    key={item.id}
                                    className="flex flex-col rounded-md border border-[var(--border-strong)] bg-[var(--neutral-white)] p-3 shadow-sm dark:border-[var(--border-strong)] dark:bg-[var(--primary-900)]"
                                >
                                    <div className="mb-2 flex h-20 w-full items-center justify-center overflow-hidden rounded-xl bg-[var(--second-accent)] dark:bg-[var(--border-strong)]">
                                        {item.image ? (
                                            <img src={`/storage/${item.image}`} alt={item.name} className="h-full w-full object-cover" />
                                        ) : (
                                            <span
                                                className="flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold text-white"
                                                style={{ backgroundColor: item.category.color ?? '#94a3b8' }}
                                            >
                                                {item.name.charAt(0).toUpperCase()}
                                            </span>
                                        )}
                                    </div>
                                    <p className="truncate text-sm font-bold text-[var(--subheading)] dark:text-[var(--neutral-white)]">
                                        {item.name}
                                    </p>
                                    <p className="mb-1 text-sm text-[var(--grey-text)] dark:text-[var(--neutral-white)]">
                                        Rp {item.price.toLocaleString('id-ID')}
                                    </p>
                                    <p
                                        className={`mb-2 text-xs ${isOut ? 'text-[var(--danger)]' : 'text-[var(--grey-text)] dark:text-[var(--neutral-white)]'}`}
                                    >
                                        {isOut
                                            ? t('dashboardLite.order.item.outOfStock')
                                            : `${t('dashboardLite.order.item.stockLeftPrefix')} ${stockLeft}`}
                                    </p>
                                    <Button
                                        aria-label={`${t('dashboardLite.order.item.addAriaPrefix')} ${item.name} ${t('dashboardLite.order.item.addAriaSuffix')}`}
                                        disabled={isOut}
                                        onClick={() => handleAddToCart(item)}
                                        className="h-9 w-full bg-[var(--surface-header)] text-sm font-bold hover:bg-[var(--surface-header-hover)] disabled:opacity-40 dark:bg-[var(--neutral-white)] dark:text-[var(--primary-900)] dark:hover:text-[var(--neutral-white)] dark:hover:opacity-90"
                                    >
                                        {t('dashboardLite.order.item.addButton')}
                                    </Button>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="hidden w-80 shrink-0 border-l border-[var(--border-strong)] bg-[var(--neutral-white)] lg:block dark:border-[var(--border-strong)] dark:bg-[var(--primary-900)]">
                    <div className="sticky top-0">{cartPanel}</div>
                </div>

                {cartCount > 0 && (
                    <button
                        aria-label={t('dashboardLite.order.cart.openAria')}
                        onClick={() => setCartOpen(true)}
                        className="fixed right-5 bottom-5 z-40 flex items-center gap-2 rounded-full bg-[var(--surface-header)] px-5 py-3.5 text-white shadow-2xl lg:hidden dark:bg-[var(--neutral-white)] dark:text-[var(--primary-900)]"
                    >
                        <ShoppingCart className="h-4 w-4" />
                        <span className="text-sm font-bold">
                            {cartCount} item · Rp {subtotal.toLocaleString('id-ID')}
                        </span>
                    </button>
                )}

                {cartOpen && (
                    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 lg:hidden">
                        <div className="h-full w-[85vw] max-w-sm bg-[var(--neutral-white)] dark:bg-[var(--primary-900)]">{cartPanel}</div>
                    </div>
                )}
            </div>

            {showPayment && <PaymentModal cart={cart} subtotal={subtotal} onClose={() => setShowPayment(false)} onSuccess={handlePaymentSuccess} />}
        </DashboardSidebarLayout>
    );
}
