import { Button, CreateButton, Input } from '@/components';
import { InventoryItemFormModal } from '@/features/lite/inventory/components';
import { useConfirmAction, useLanguage } from '@/hooks';
import { DashboardSidebarLayout } from '@/layouts';
import { Head, router } from '@inertiajs/react';
import axios from 'axios';
import { Minus, Plus, Search } from 'lucide-react';
import { useState } from 'react';

interface CategoryOption {
    id: number;
    name: string;
    color: string | null;
}

interface InventoryItem {
    id: number;
    name: string;
    sku: string;
    price: number;
    image: string | null;
    category_id: number;
    category: { id: number; name: string; color: string | null };
    current_stock: number;
    min_stock: number;
}

interface Props {
    items: {
        data: InventoryItem[];
        next_page_url: string | null;
    };
    categories: CategoryOption[];
    summary: { out_of_stock: number; low_stock: number };
    filters: { search?: string; category_id?: string; stock_status?: string };
}

type StockStatus = 'all' | 'safe' | 'low' | 'out';

function stockStatusOf(item: InventoryItem): StockStatus {
    if (item.current_stock === 0) return 'out';
    if (item.current_stock <= item.min_stock) return 'low';
    return 'safe';
}

export default function ItemList({ items: initialItems, categories, summary, filters }: Props) {
    const { t } = useLanguage();
    const [items, setItems] = useState<InventoryItem[]>(initialItems.data);
    const [nextPageUrl, setNextPageUrl] = useState(initialItems.next_page_url);
    const [loadingMore, setLoadingMore] = useState(false);
    const [search, setSearch] = useState(filters.search ?? '');
    const [activeCategory, setActiveCategory] = useState<number | 'all'>(filters.category_id ? Number(filters.category_id) : 'all');
    const [activeStatus, setActiveStatus] = useState<StockStatus>((filters.stock_status as StockStatus) ?? 'all');
    const [pendingStockId, setPendingStockId] = useState<number | null>(null);
    const [formItem, setFormItem] = useState<InventoryItem | 'new' | null>(null);
    const { confirmAndDelete } = useConfirmAction();

    const STATUS_CHIPS: { key: StockStatus; label: string }[] = [
        { key: 'all', label: t('dashboardLite.inventoryItems.statusChips.all') },
        { key: 'safe', label: t('dashboardLite.inventoryItems.statusChips.safe') },
        { key: 'low', label: t('dashboardLite.inventoryItems.statusChips.low') },
        { key: 'out', label: t('dashboardLite.inventoryItems.statusChips.out') },
    ];

    const STATUS_META: Record<StockStatus, { label: string; bg: string; text: string }> = {
        all: { label: '', bg: '', text: '' },
        safe: { label: t('dashboardLite.inventoryItems.statusChips.safe'), bg: 'var(--success-background)', text: 'var(--success)' },
        low: { label: t('dashboardLite.inventoryItems.statusChips.low'), bg: 'var(--warning-background)', text: 'var(--warning)' },
        out: { label: t('dashboardLite.inventoryItems.statusChips.out'), bg: 'var(--danger-background)', text: 'var(--danger)' },
    };

    const applyFilters = (next: { search?: string; category_id?: number | 'all'; stock_status?: StockStatus }) => {
        router.get(
            route('lite.inventory.items.index'),
            {
                search: next.search ?? search,
                category_id: (next.category_id ?? activeCategory) === 'all' ? undefined : (next.category_id ?? activeCategory),
                stock_status: (next.stock_status ?? activeStatus) === 'all' ? undefined : (next.stock_status ?? activeStatus),
            },
            { preserveState: true, preserveScroll: true, replace: true, only: ['items', 'summary'] },
        );
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilters({ search });
    };

    const handleCategoryClick = (id: number | 'all') => {
        setActiveCategory(id);
        applyFilters({ category_id: id });
    };

    const handleStatusClick = (status: StockStatus) => {
        setActiveStatus(status);
        applyFilters({ stock_status: status });
    };

    const handleStockAdjust = async (item: InventoryItem, delta: number) => {
        if (item.current_stock + delta < 0) return;
        setPendingStockId(item.id);
        try {
            const res = await axios.patch(route('lite.inventory.items.stock', item.id), { delta });
            setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, current_stock: res.data.current_stock } : i)));
        } catch {
            alert(t('dashboardLite.inventoryItems.stockAdjustError'));
        } finally {
            setPendingStockId(null);
        }
    };

    const handleLoadMore = async () => {
        if (!nextPageUrl) return;
        setLoadingMore(true);
        try {
            const res = await axios.get(nextPageUrl);
            setItems((prev) => [...prev, ...res.data.props.items.data]);
            setNextPageUrl(res.data.props.items.next_page_url);
        } finally {
            setLoadingMore(false);
        }
    };

    const handleDelete = (item: InventoryItem) => {
        confirmAndDelete(
            `${t('dashboardLite.inventoryItems.deleteConfirmPrefix')} "${item.name}" ${t('dashboardLite.inventoryItems.deleteConfirmSuffix')}`,
            route('lite.inventory.items.destroy', item.id),
            {
                onSuccess: () => setItems((prev) => prev.filter((i) => i.id !== item.id)),
            },
        );
    };

    return (
        <DashboardSidebarLayout title={t('dashboardLite.inventoryItems.pageTitle')} description={t('dashboardLite.inventoryItems.pageDescription')}>
            <Head title={t('dashboardLite.inventoryItems.headTitle')} />
            <div className="min-h-screen bg-[var(--page-bg)] p-4 sm:p-6 dark:bg-[var(--background)]">
                <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <button
                        aria-label={t('dashboardLite.inventoryItems.summary.outOfStockAria')}
                        onClick={() => handleStatusClick('out')}
                        className="flex items-center justify-between rounded-md border-2 border-[var(--danger)] bg-[var(--danger-background)] px-5 py-4 text-left transition hover:opacity-90"
                    >
                        <span className="text-base font-bold text-[var(--danger)]">{t('dashboardLite.inventoryItems.summary.outOfStockLabel')}</span>
                        <span className="text-2xl font-extrabold text-[var(--danger)]">{summary.out_of_stock}</span>
                    </button>
                    <button
                        aria-label={t('dashboardLite.inventoryItems.summary.lowStockAria')}
                        onClick={() => handleStatusClick('low')}
                        className="flex items-center justify-between rounded-md border-2 border-[var(--warning)] bg-[var(--warning-background)] px-5 py-4 text-left transition hover:opacity-90"
                    >
                        <span className="text-base font-bold text-[var(--warning)]">{t('dashboardLite.inventoryItems.summary.lowStockLabel')}</span>
                        <span className="text-2xl font-extrabold text-[var(--warning)]">{summary.low_stock}</span>
                    </button>
                </div>

                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <form onSubmit={handleSearchSubmit} className="relative flex-1">
                        <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-[var(--grey-text)] dark:text-[var(--neutral-white)]" />
                        <Input
                            aria-label={t('dashboardLite.inventoryItems.search.aria')}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder={t('dashboardLite.inventoryItems.search.placeholder')}
                            className="h-12 rounded-md border-[var(--border-strong)] bg-[var(--neutral-white)] pl-12 text-base dark:border-[var(--border-strong)] dark:bg-[var(--primary-900)] dark:text-[var(--neutral-white)]"
                        />
                    </form>
                    <CreateButton
                        label={t('dashboardLite.inventoryItems.createButton')}
                        onClick={() => setFormItem('new')}
                        className="h-12 rounded-md px-6"
                    />
                </div>

                <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
                    {STATUS_CHIPS.map((chip) => (
                        <Button
                            aria-label={`${t('dashboardLite.inventoryItems.statusFilterAriaPrefix')} ${chip.label}`}
                            key={chip.key}
                            variant="outline"
                            onClick={() => handleStatusClick(chip.key)}
                            className={`shrink-0 border-2 px-4 py-2 text-sm font-semibold transition hover:bg-[var(--surface-header)] hover:text-[var(--neutral-white)] dark:hover:bg-[var(--neutral-white)] dark:hover:text-[var(--primary-900)] ${
                                activeStatus === chip.key
                                    ? 'bg-[var(--surface-header)] text-white dark:bg-[var(--neutral-white)] dark:text-[var(--primary-900)]'
                                    : ''
                            }`}
                        >
                            {chip.label}
                        </Button>
                    ))}
                </div>

                <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
                    <Button
                        aria-label={t('dashboardLite.inventoryItems.category.allAria')}
                        variant="outline"
                        onClick={() => handleCategoryClick('all')}
                        className={`flex shrink-0 items-center gap-2 border-2 px-3 py-1.5 text-sm font-semibold hover:bg-[var(--surface-header)] hover:text-[var(--neutral-white)] dark:hover:bg-[var(--neutral-white)] dark:hover:text-[var(--primary-900)] ${
                            activeCategory === 'all'
                                ? 'bg-[var(--surface-header)] text-white dark:bg-[var(--neutral-white)] dark:text-[var(--primary-900)]'
                                : ''
                        }`}
                    >
                        {t('dashboardLite.inventoryItems.category.all')}
                    </Button>
                    {categories.map((cat) => (
                        <Button
                            aria-label={`${t('dashboardLite.inventoryItems.category.filterAriaPrefix')} ${cat.name}`}
                            key={cat.id}
                            variant="outline"
                            onClick={() => handleCategoryClick(cat.id)}
                            className={`flex shrink-0 items-center gap-2 border-2 px-3 py-1.5 text-sm font-semibold hover:bg-[var(--surface-header)] hover:text-[var(--neutral-white)] dark:hover:bg-[var(--neutral-white)] dark:hover:text-[var(--primary-900)] ${
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

                {items.length === 0 ? (
                    <div className="rounded-md border-2 border-dashed border-[var(--border-strong)] bg-[var(--neutral-white)] py-16 text-center dark:border-[var(--border-strong)] dark:bg-[var(--primary-900)]">
                        <p className="text-lg font-semibold text-[var(--subheading)] dark:text-[var(--neutral-white)]">
                            {t('dashboardLite.inventoryItems.empty.title')}
                        </p>
                        <p className="mt-1 text-sm text-[var(--grey-text)] dark:text-[var(--neutral-white)]">
                            {t('dashboardLite.inventoryItems.empty.hint')}
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {items.map((item) => {
                            const status = stockStatusOf(item);
                            const meta = STATUS_META[status];
                            const isPending = pendingStockId === item.id;

                            return (
                                <div
                                    key={item.id}
                                    className="flex flex-col gap-3 rounded-md border border-[var(--border-strong)] bg-[var(--neutral-white)] p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between dark:border-[var(--border-strong)] dark:bg-[var(--primary-900)]"
                                >
                                    <div className="flex items-center gap-3">
                                        {item.image ? (
                                            <img src={`/storage/${item.image}`} alt={item.name} className="h-14 w-14 rounded-xl object-cover" />
                                        ) : (
                                            <span
                                                className="flex h-14 w-14 items-center justify-center rounded-xl text-xl font-bold text-white"
                                                style={{ backgroundColor: item.category.color ?? '#94a3b8' }}
                                            >
                                                {item.name.charAt(0).toUpperCase()}
                                            </span>
                                        )}
                                        <div>
                                            <p className="text-base font-bold text-[var(--subheading)] dark:text-[var(--neutral-white)]">
                                                {item.name}
                                            </p>
                                            <p className="text-sm text-[var(--grey-text)] dark:text-[var(--neutral-white)]">{item.category.name}</p>
                                            <p className="text-sm font-semibold text-[var(--subheading)] dark:text-[var(--neutral-white)]">
                                                Rp {Number(item.price).toLocaleString('id-ID')}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between gap-4 sm:justify-end">
                                        <div className="flex items-center gap-3">
                                            <button
                                                aria-label={`${t('dashboardLite.inventoryItems.stock.decreaseAriaPrefix')} ${item.name}`}
                                                disabled={isPending || item.current_stock === 0}
                                                onClick={() => handleStockAdjust(item, -1)}
                                                className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[var(--border-strong)] text-[var(--subheading)] transition hover:bg-[var(--second-accent)] disabled:opacity-30 dark:border-[var(--border-strong)] dark:text-[var(--neutral-white)] dark:hover:bg-white/10"
                                            >
                                                <Minus className="h-4 w-4" />
                                            </button>
                                            <div className="w-14 text-center">
                                                <p className="text-xl font-extrabold text-[var(--subheading)] dark:text-[var(--neutral-white)]">
                                                    {item.current_stock}
                                                </p>
                                                <span
                                                    className="inline-block rounded-full px-2 py-0.5 text-[10px] font-bold"
                                                    style={{ backgroundColor: meta.bg, color: meta.text }}
                                                >
                                                    {meta.label}
                                                </span>
                                            </div>
                                            <button
                                                aria-label={`${t('dashboardLite.inventoryItems.stock.increaseAriaPrefix')} ${item.name}`}
                                                disabled={isPending}
                                                onClick={() => handleStockAdjust(item, 1)}
                                                className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[var(--border-strong)] text-[var(--subheading)] transition hover:bg-[var(--second-accent)] disabled:opacity-30 dark:border-[var(--border-strong)] dark:text-[var(--neutral-white)] dark:hover:bg-white/10"
                                            >
                                                <Plus className="h-4 w-4" />
                                            </button>
                                        </div>

                                        <div className="flex gap-2">
                                            <Button
                                                aria-label={`${t('dashboardLite.inventoryItems.editAriaPrefix')} ${item.name}`}
                                                onClick={() => setFormItem(item)}
                                                className="h-10 rounded-xl bg-[var(--surface-header)] px-4 text-sm font-bold hover:bg-[var(--surface-header-hover)] dark:bg-[var(--neutral-white)] dark:text-[var(--primary-900)] dark:hover:text-[var(--neutral-white)] dark:hover:opacity-90"
                                            >
                                                {t('dashboardLite.inventoryItems.editButton')}
                                            </Button>

                                            <Button
                                                aria-label={t('dashboardLite.inventoryItems.modal.deleteAria')}
                                                type="button"
                                                variant="outline"
                                                onClick={() => handleDelete(item)}
                                                className="h-10 rounded-xl border-[var(--danger)] text-sm font-bold text-[var(--danger)] hover:bg-[var(--danger-background)]"
                                            >
                                                {t('dashboardLite.inventoryItems.modal.deleteButton')}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {nextPageUrl && (
                    <div className="mt-6 flex justify-center">
                        <Button
                            aria-label={t('dashboardLite.inventoryItems.loadMoreAria')}
                            variant="outline"
                            onClick={handleLoadMore}
                            disabled={loadingMore}
                            className="h-12 rounded-md border-[var(--border-strong)] bg-[var(--neutral-white)] px-8 text-base font-semibold dark:border-[var(--border-strong)] dark:bg-[var(--primary-900)] dark:text-[var(--neutral-white)] dark:hover:bg-white/10"
                        >
                            {loadingMore ? t('dashboardLite.inventoryItems.loadingButton') : t('dashboardLite.inventoryItems.loadMoreButton')}
                        </Button>
                    </div>
                )}
            </div>

            {formItem && (
                <InventoryItemFormModal item={formItem === 'new' ? null : formItem} categories={categories} onClose={() => setFormItem(null)} />
            )}
        </DashboardSidebarLayout>
    );
}
