import { PaginationBar } from '@/components';
import { Button, Input } from '@/components/ui';
import { AdjustmentFormModal } from '@/features/lite/inventory/components';
import { useConfirmAction, useFilters, useLanguage } from '@/hooks';
import { DashboardSidebarLayout } from '@/layouts';
import { Head } from '@inertiajs/react';
import { ClipboardEdit, Plus, Search } from 'lucide-react';
import { useEffect, useState } from 'react';

interface AdjustmentRow {
    id: number;
    inventory_item_id: number;
    item_name: string;
    category_name: string | null;
    note: string;
    qty_change: number;
    date: string;
}

interface ItemOption {
    id: number;
    name: string;
}

interface CategoryOption {
    id: number;
    name: string;
}

interface Props {
    adjustments: {
        data: AdjustmentRow[];
        total: number;
        from: number;
        to: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    items: ItemOption[];
    categories: CategoryOption[];
    filters: { search?: string; category_id?: string; status?: string; per_page?: string };
}

export default function AdjustmentList({ adjustments, items, categories, filters }: Props) {
    const { t, locale } = useLanguage();
    const [adjustmentRows, setAdjustmentRows] = useState<AdjustmentRow[]>(adjustments.data);
    const [formAdjustment, setFormAdjustment] = useState<AdjustmentRow | 'new' | null>(null);
    const { search, setSearch, applyFilters, handleSearch } = useFilters('lite.inventory.adjustments.index', filters);
    const { confirmAndDelete, confirmDialog } = useConfirmAction();

    const dateLocale = locale === 'en' ? 'en-US' : 'id-ID';
    const activeCategory: number | 'all' = filters.category_id ? Number(filters.category_id) : 'all';
    const activeStatus: 'all' | 'in' | 'out' = (filters.status as 'in' | 'out') ?? 'all';

    useEffect(() => {
        setAdjustmentRows(adjustments.data);
    }, [adjustments.data]);

    const STATUS_CHIPS: { key: 'all' | 'in' | 'out'; label: string }[] = [
        { key: 'all', label: t('dashboardLite.inventoryAdjustments.allStatus') },
        { key: 'in', label: t('dashboardLite.inventoryAdjustments.statusIn') },
        { key: 'out', label: t('dashboardLite.inventoryAdjustments.statusOut') },
    ];

    const handleStatusClick = (status: 'all' | 'in' | 'out') => {
        applyFilters({ status: status === 'all' ? undefined : status });
    };

    const handleCategoryClick = (id: number | 'all') => {
        applyFilters({ category_id: id === 'all' ? undefined : String(id) });
    };

    const handleDelete = (adjustment: AdjustmentRow) => {
        confirmAndDelete(
            `${t('dashboardLite.inventoryAdjustments.deleteConfirmPrefix')} "${adjustment.item_name}" ${t('dashboardLite.inventoryAdjustments.deleteConfirmSuffix')}`,
            route('lite.inventory.adjustments.destroy', adjustment.id),
            {
                onSuccess: () => setAdjustmentRows((prev) => prev.filter((a) => a.id !== adjustment.id)),
            },
        );
    };

    return (
        <DashboardSidebarLayout
            title={t('dashboardLite.inventoryAdjustments.pageTitle')}
            description={t('dashboardLite.inventoryAdjustments.pageDescription')}
        >
            <Head title={t('dashboardLite.inventoryAdjustments.pageTitle')} />
            <div className="min-h-screen bg-[var(--page-bg)] p-4 sm:p-6 dark:bg-[var(--background)]">
                <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <form onSubmit={handleSearch} className="relative flex-1">
                        <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-[var(--grey-text)] dark:text-[var(--neutral-white)]" />
                        <Input
                            aria-label={t('dashboardLite.inventoryAdjustments.search.aria')}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder={t('dashboardLite.inventoryAdjustments.search.placeholder')}
                            className="h-12 rounded-md border-[var(--border-strong)] bg-[var(--neutral-white)] pl-12 text-base dark:border-[var(--border-strong)] dark:bg-[var(--primary-900)] dark:text-[var(--neutral-white)]"
                        />
                    </form>
                    <Button aria-label={t('dashboardLite.inventoryAdjustments.createAria')} onClick={() => setFormAdjustment('new')} className="h-12">
                        <Plus className="mr-1 h-5 w-5" />
                        {t('dashboardLite.inventoryAdjustments.createButton')}
                    </Button>
                </div>

                <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
                    {STATUS_CHIPS.map((chip) => (
                        <Button
                            aria-label={`${t('dashboardLite.inventoryAdjustments.statusFilterAriaPrefix')} ${chip.label}`}
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
                        aria-label={t('dashboardLite.inventoryAdjustments.categoryFilterAllAria')}
                        variant="outline"
                        onClick={() => handleCategoryClick('all')}
                        className={`shrink-0 border-2 px-4 py-2 text-sm font-semibold transition hover:bg-[var(--surface-header)] hover:text-[var(--neutral-white)] dark:hover:bg-[var(--neutral-white)] dark:hover:text-[var(--primary-900)] ${
                            activeCategory === 'all'
                                ? 'bg-[var(--surface-header)] text-white dark:bg-[var(--neutral-white)] dark:text-[var(--primary-900)]'
                                : ''
                        }`}
                    >
                        {t('dashboardLite.inventoryAdjustments.allCategories')}
                    </Button>
                    {categories.map((cat) => (
                        <Button
                            aria-label={`${t('dashboardLite.inventoryAdjustments.categoryFilterAriaPrefix')} ${cat.name}`}
                            key={cat.id}
                            variant="outline"
                            onClick={() => handleCategoryClick(cat.id)}
                            className={`shrink-0 border-2 px-4 py-2 text-sm font-semibold transition hover:bg-[var(--surface-header)] hover:text-[var(--neutral-white)] dark:hover:bg-[var(--neutral-white)] dark:hover:text-[var(--primary-900)] ${
                                activeCategory === cat.id
                                    ? 'bg-[var(--surface-header)] text-white dark:bg-[var(--neutral-white)] dark:text-[var(--primary-900)]'
                                    : ''
                            }`}
                        >
                            {cat.name}
                        </Button>
                    ))}
                </div>

                {adjustmentRows.length === 0 ? (
                    <div className="rounded-2xl border-2 border-dashed border-[var(--border-strong)] bg-[var(--neutral-white)] py-16 text-center dark:border-[var(--border-strong)] dark:bg-[var(--primary-900)]">
                        <ClipboardEdit className="mx-auto mb-3 h-10 w-10 text-[var(--grey-text)] dark:text-[var(--neutral-white)]" />
                        <p className="text-lg font-semibold text-[var(--subheading)] dark:text-[var(--neutral-white)]">
                            {t('dashboardLite.inventoryAdjustments.empty.title')}
                        </p>
                        <p className="mt-1 text-sm text-[var(--grey-text)] dark:text-[var(--neutral-white)]">
                            {t('dashboardLite.inventoryAdjustments.empty.hint')}
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {adjustmentRows.map((a) => {
                            const isReduction = a.qty_change < 0;
                            return (
                                <div
                                    key={a.id}
                                    className="flex items-center justify-between gap-3 rounded-2xl border border-[var(--border-strong)] bg-[var(--neutral-white)] p-4 shadow-sm dark:border-[var(--border-strong)] dark:bg-[var(--primary-900)]"
                                >
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-base font-bold text-[var(--subheading)] dark:text-[var(--neutral-white)]">
                                            {a.item_name}
                                        </p>
                                        {a.category_name && (
                                            <p className="text-xs text-[var(--grey-text)] dark:text-[var(--neutral-white)]">{a.category_name}</p>
                                        )}
                                        <p className="text-sm text-[var(--grey-text)] dark:text-[var(--neutral-white)]">{a.note}</p>
                                        <p className="mt-0.5 text-xs text-[var(--grey-text)] dark:text-[var(--neutral-white)]">
                                            {new Date(a.date).toLocaleDateString(dateLocale, { day: 'numeric', month: 'long', year: 'numeric' })}
                                        </p>
                                    </div>
                                    <div className="flex shrink-0 items-center gap-3">
                                        <span
                                            className="rounded-full px-3 py-1.5 text-base font-extrabold"
                                            style={{
                                                backgroundColor: isReduction ? 'var(--danger-background)' : 'var(--success-background)',
                                                color: isReduction ? 'var(--danger)' : 'var(--success)',
                                            }}
                                        >
                                            {isReduction ? a.qty_change : `+${a.qty_change}`}
                                        </span>
                                        <div className="flex gap-2">
                                            <Button
                                                aria-label={`${t('dashboardLite.inventoryAdjustments.editAriaPrefix')} ${a.item_name}`}
                                                onClick={() => setFormAdjustment(a)}
                                                className="h-9 rounded-xl bg-[var(--surface-header)] px-3 text-xs font-bold hover:bg-[var(--surface-header-hover)] dark:bg-[var(--neutral-white)] dark:text-[var(--primary-900)] dark:hover:opacity-90"
                                            >
                                                {t('dashboardLite.inventoryAdjustments.editButton')}
                                            </Button>
                                            <Button
                                                aria-label={`${t('dashboardLite.inventoryAdjustments.deleteAriaPrefix')} ${a.item_name}`}
                                                type="button"
                                                variant="outline"
                                                onClick={() => handleDelete(a)}
                                                className="!hover:bg-[var(--danger-background)] h-9 rounded-xl !border-[var(--danger)] px-3 text-xs font-bold !text-[var(--danger)]"
                                            >
                                                {t('dashboardLite.inventoryAdjustments.deleteButton')}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                <PaginationBar
                    from={adjustments.from ?? 0}
                    to={adjustments.to ?? 0}
                    total={adjustments.total}
                    itemLabel={t('dashboardLite.inventoryAdjustments.itemLabel')}
                    links={adjustments.links}
                    perPage={filters.per_page ?? '8'}
                    onPerPageChange={(v) => applyFilters({ per_page: v })}
                />
            </div>

            {formAdjustment && (
                <AdjustmentFormModal
                    items={items}
                    adjustment={formAdjustment === 'new' ? null : formAdjustment}
                    onClose={() => setFormAdjustment(null)}
                />
            )}
            {confirmDialog}
        </DashboardSidebarLayout>
    );
}
