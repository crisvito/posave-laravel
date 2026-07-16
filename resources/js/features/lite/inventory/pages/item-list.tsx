import { Button, CreateButton, Input } from '@/components';
import { InventoryItemFormModal } from '@/features/lite/inventory/components';
import { useConfirmAction } from '@/hooks';
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

const STATUS_CHIPS: { key: StockStatus; label: string }[] = [
    { key: 'all', label: 'Semua' },
    { key: 'safe', label: 'Aman' },
    { key: 'low', label: 'Mau Habis' },
    { key: 'out', label: 'Habis' },
];

function stockStatusOf(item: InventoryItem): StockStatus {
    if (item.current_stock === 0) return 'out';
    if (item.current_stock <= item.min_stock) return 'low';
    return 'safe';
}

const STATUS_META: Record<StockStatus, { label: string; bg: string; text: string }> = {
    all: { label: '', bg: '', text: '' },
    safe: { label: 'Aman', bg: 'var(--success-background)', text: 'var(--success)' },
    low: { label: 'Mau Habis', bg: 'var(--warning-background)', text: 'var(--warning)' },
    out: { label: 'Habis', bg: 'var(--danger-background)', text: 'var(--danger)' },
};

export default function ItemList({ items: initialItems, categories, summary, filters }: Props) {
    const [items, setItems] = useState<InventoryItem[]>(initialItems.data);
    const [nextPageUrl, setNextPageUrl] = useState(initialItems.next_page_url);
    const [loadingMore, setLoadingMore] = useState(false);
    const [search, setSearch] = useState(filters.search ?? '');
    const [activeCategory, setActiveCategory] = useState<number | 'all'>(filters.category_id ? Number(filters.category_id) : 'all');
    const [activeStatus, setActiveStatus] = useState<StockStatus>((filters.stock_status as StockStatus) ?? 'all');
    const [pendingStockId, setPendingStockId] = useState<number | null>(null);
    const [formItem, setFormItem] = useState<InventoryItem | 'new' | null>(null);
    const { confirmAndDelete } = useConfirmAction();

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
            alert('Gagal mengubah stok, coba lagi.');
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
        confirmAndDelete(`Hapus "${item.name}" dari daftar barang?`, route('lite.inventory.items.destroy', item.id), {
            onSuccess: () => setItems((prev) => prev.filter((i) => i.id !== item.id)),
        });
    };

    return (
        <DashboardSidebarLayout title="Barang Kamu" description="Kelola stok warung dengan mudah">
            <Head title="Daftar Barang" />
            <div className="min-h-screen bg-[var(--page-bg)] p-4 sm:p-6 dark:bg-[var(--background)]">
                <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <button
                        aria-label="Lihat barang yang habis"
                        onClick={() => handleStatusClick('out')}
                        className="flex items-center justify-between rounded-md border-2 border-[var(--danger)] bg-[var(--danger-background)] px-5 py-4 text-left transition hover:opacity-90"
                    >
                        <span className="text-base font-bold text-[var(--danger)]">Barang Habis</span>
                        <span className="text-2xl font-extrabold text-[var(--danger)]">{summary.out_of_stock}</span>
                    </button>
                    <button
                        aria-label="Lihat barang yang mau habis"
                        onClick={() => handleStatusClick('low')}
                        className="flex items-center justify-between rounded-md border-2 border-[var(--warning)] bg-[var(--warning-background)] px-5 py-4 text-left transition hover:opacity-90"
                    >
                        <span className="text-base font-bold text-[var(--warning)]">Stok Mau Habis</span>
                        <span className="text-2xl font-extrabold text-[var(--warning)]">{summary.low_stock}</span>
                    </button>
                </div>

                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <form onSubmit={handleSearchSubmit} className="relative flex-1">
                        <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-[var(--grey-text)] dark:text-[var(--neutral-white)]" />
                        <Input
                            aria-label="Cari nama barang"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari nama barang..."
                            className="h-12 rounded-md border-[var(--border-strong)] bg-[var(--neutral-white)] pl-12 text-base dark:border-[var(--border-strong)] dark:bg-[var(--primary-900)] dark:text-[var(--neutral-white)]"
                        />
                    </form>
                    <CreateButton label="Tambah Barang Baru" onClick={() => setFormItem('new')} className="h-12 rounded-md px-6" />
                </div>

                <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
                    {STATUS_CHIPS.map((chip) => (
                        <Button
                            aria-label={`Filter status ${chip.label}`}
                            key={chip.key}
                            onClick={() => handleStatusClick(chip.key)}
                            className={`shrink-0 border-2 px-4 py-2 text-sm font-semibold transition hover:border-[var(--surface-header)] hover:bg-[var(--surface-header)] hover:text-[var(--neutral-white)] dark:hover:bg-[var(--neutral-white)] dark:hover:text-[var(--primary-900)] ${
                                activeStatus === chip.key
                                    ? 'border-[var(--surface-header)] bg-[var(--surface-header)] text-white dark:border-[var(--neutral-white)] dark:bg-[var(--neutral-white)] dark:text-[var(--primary-900)]'
                                    : ''
                            }`}
                        >
                            {chip.label}
                        </Button>
                    ))}
                </div>

                <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
                    <Button
                        aria-label="Lihat semua kategori"
                        onClick={() => handleCategoryClick('all')}
                        className={`flex shrink-0 items-center gap-2 border-2 px-3 py-1.5 text-sm font-semibold hover:border-[var(--surface-header)] hover:bg-[var(--surface-header)] hover:text-[var(--neutral-white)] dark:hover:bg-[var(--neutral-white)] dark:hover:text-[var(--primary-900)] ${
                            activeCategory === 'all'
                                ? 'border-[var(--surface-header)] bg-[var(--surface-header)] text-white dark:border-[var(--neutral-white)] dark:bg-[var(--neutral-white)] dark:text-[var(--primary-900)]'
                                : ''
                        }`}
                    >
                        Semua Kategori
                    </Button>
                    {categories.map((cat) => (
                        <Button
                            aria-label={`Filter kategori ${cat.name}`}
                            key={cat.id}
                            onClick={() => handleCategoryClick(cat.id)}
                            className={`flex shrink-0 items-center gap-2 border-2 px-3 py-1.5 text-sm font-semibold hover:border-[var(--surface-header)] hover:bg-[var(--surface-header)] hover:text-[var(--neutral-white)] dark:hover:bg-[var(--neutral-white)] dark:hover:text-[var(--primary-900)] ${
                                activeCategory === cat.id
                                    ? 'border-[var(--surface-header)] bg-[var(--surface-header)] text-white dark:border-[var(--neutral-white)] dark:bg-[var(--neutral-white)] dark:text-[var(--primary-900)]'
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
                        <p className="text-lg font-semibold text-[var(--subheading)] dark:text-[var(--neutral-white)]">Belum ada barang</p>
                        <p className="mt-1 text-sm text-[var(--grey-text)] dark:text-[var(--neutral-white)]">
                            Tekan "Tambah Barang" untuk mulai mencatat stok.
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
                                                aria-label={`Kurangi stok ${item.name}`}
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
                                                aria-label={`Tambah stok ${item.name}`}
                                                disabled={isPending}
                                                onClick={() => handleStockAdjust(item, 1)}
                                                className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[var(--border-strong)] text-[var(--subheading)] transition hover:bg-[var(--second-accent)] disabled:opacity-30 dark:border-[var(--border-strong)] dark:text-[var(--neutral-white)] dark:hover:bg-white/10"
                                            >
                                                <Plus className="h-4 w-4" />
                                            </button>
                                        </div>

                                        <Button
                                            aria-label={`Ubah data ${item.name}`}
                                            onClick={() => setFormItem(item)}
                                            className="h-10 rounded-xl bg-[var(--surface-header)] px-4 text-sm font-bold hover:bg-[var(--surface-header-hover)] dark:bg-[var(--neutral-white)] dark:text-[var(--primary-900)] dark:hover:text-[var(--neutral-white)] dark:hover:opacity-90"
                                        >
                                            Ubah
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {nextPageUrl && (
                    <div className="mt-6 flex justify-center">
                        <Button
                            aria-label="Tampilkan barang lainnya"
                            variant="outline"
                            onClick={handleLoadMore}
                            disabled={loadingMore}
                            className="h-12 rounded-md border-[var(--border-strong)] bg-[var(--neutral-white)] px-8 text-base font-semibold dark:border-[var(--border-strong)] dark:bg-[var(--primary-900)] dark:text-[var(--neutral-white)] dark:hover:bg-white/10"
                        >
                            {loadingMore ? 'Memuat...' : 'Tampilkan Lebih Banyak'}
                        </Button>
                    </div>
                )}
            </div>

            {formItem && (
                <InventoryItemFormModal
                    item={formItem === 'new' ? null : formItem}
                    categories={categories}
                    onClose={() => setFormItem(null)}
                    onDelete={formItem !== 'new' ? () => handleDelete(formItem) : undefined}
                />
            )}
        </DashboardSidebarLayout>
    );
}
