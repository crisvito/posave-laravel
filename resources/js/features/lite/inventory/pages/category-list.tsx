import { CreateButton, PaginationBar } from '@/components';
import { Button, Input } from '@/components/ui';
import { InventoryCategoryFormModal } from '@/features/lite/inventory/components';
import { useConfirmAction, useFilters, useLanguage } from '@/hooks';
import { DashboardSidebarLayout } from '@/layouts';
import { Head } from '@inertiajs/react';
import { Search, Tag } from 'lucide-react';
import { useEffect, useState } from 'react';

interface CategoryItem {
    id: number;
    name: string;
    color: string | null;
    items_count: number;
}

interface Props {
    categories: {
        data: CategoryItem[];
        total: number;
        from: number;
        to: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    filters: { search?: string; per_page?: string };
}

export default function CategoryList({ categories, filters }: Props) {
    const { t } = useLanguage();
    const [categoryRows, setCategoryRows] = useState<CategoryItem[]>(categories.data);
    const [formCategory, setFormCategory] = useState<CategoryItem | 'new' | null>(null);
    const { confirmAndDelete, confirmDialog } = useConfirmAction();
    const { search, setSearch, applyFilters, handleSearch } = useFilters('lite.inventory.categories.index', filters);

    useEffect(() => {
        setCategoryRows(categories.data);
    }, [categories.data]);

    const handleDelete = (category: CategoryItem) => {
        const warning =
            category.items_count > 0
                ? `${t('dashboardLite.inventoryCategories.deleteWarningWithItems.prefix')} "${category.name}" ${t('dashboardLite.inventoryCategories.deleteWarningWithItems.middle')} ${category.items_count} ${t('dashboardLite.inventoryCategories.deleteWarningWithItems.suffix')}`
                : `${t('dashboardLite.inventoryCategories.deleteWarningEmptyPrefix')} "${category.name}"?`;

        confirmAndDelete(warning, route('lite.inventory.categories.destroy', category.id), {
            onSuccess: () => setCategoryRows((prev) => prev.filter((c) => c.id !== category.id)),
        });
    };

    return (
        <DashboardSidebarLayout
            title={t('dashboardLite.inventoryCategories.pageTitle')}
            description={t('dashboardLite.inventoryCategories.pageDescription')}
        >
            <Head title={t('dashboardLite.inventoryCategories.headTitle')} />
            <div className="min-h-screen bg-[var(--page-bg)] p-4 sm:p-6 dark:bg-[var(--background)]">
                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <form onSubmit={handleSearch} className="relative flex-1">
                        <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-[var(--grey-text)] dark:text-[var(--neutral-white)]" />
                        <Input
                            aria-label={t('dashboardLite.inventoryCategories.search.aria')}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder={t('dashboardLite.inventoryCategories.search.placeholder')}
                            className="h-12 rounded-md border-[var(--border-strong)] bg-[var(--neutral-white)] pl-12 text-base dark:border-[var(--border-strong)] dark:bg-[var(--primary-900)] dark:text-[var(--neutral-white)]"
                        />
                    </form>
                    <CreateButton
                        label={t('dashboardLite.inventoryCategories.createButton')}
                        onClick={() => setFormCategory('new')}
                        className="h-12"
                    />
                </div>

                {categoryRows.length === 0 ? (
                    <div className="rounded-2xl border-2 border-dashed border-[var(--border-strong)] bg-[var(--neutral-white)] py-16 text-center dark:border-[var(--border-strong)] dark:bg-[var(--primary-900)]">
                        <Tag className="mx-auto mb-3 h-10 w-10 text-[var(--grey-text)] dark:text-[var(--neutral-white)]" />
                        <p className="text-lg font-semibold text-[var(--subheading)] dark:text-[var(--neutral-white)]">
                            {t('dashboardLite.inventoryCategories.empty.title')}
                        </p>
                        <p className="mt-1 text-sm text-[var(--grey-text)] dark:text-[var(--neutral-white)]">
                            {t('dashboardLite.inventoryCategories.empty.hint')}
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {categoryRows.map((category) => (
                            <div
                                key={category.id}
                                className="flex items-center justify-between gap-3 rounded-md border border-[var(--border-strong)] bg-[var(--neutral-white)] p-4 shadow-sm dark:border-[var(--border-strong)] dark:bg-[var(--primary-900)]"
                            >
                                <div className="flex items-center gap-3">
                                    <span
                                        className="flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold text-white"
                                        style={{ backgroundColor: category.color ?? '#94a3b8' }}
                                    >
                                        {category.name.charAt(0).toUpperCase()}
                                    </span>
                                    <div>
                                        <p className="text-base font-bold text-[var(--subheading)] dark:text-[var(--neutral-white)]">
                                            {category.name}
                                        </p>
                                        <p className="text-sm text-[var(--grey-text)] dark:text-[var(--neutral-white)]">
                                            {category.items_count} {t('dashboardLite.inventoryCategories.itemsCountSuffix')}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <Button
                                        aria-label={`${t('dashboardLite.inventoryCategories.editAriaPrefix')} ${category.name}`}
                                        onClick={() => setFormCategory(category)}
                                        className="h-10 rounded-xl bg-[var(--surface-header)] px-4 text-sm font-bold hover:bg-[var(--surface-header-hover)] dark:bg-[var(--neutral-white)] dark:text-[var(--primary-900)] dark:hover:text-[var(--neutral-white)] dark:hover:opacity-90"
                                    >
                                        {t('dashboardLite.inventoryCategories.editButton')}
                                    </Button>
                                    <Button
                                        aria-label={t('dashboardLite.inventoryCategories.modal.deleteAria')}
                                        type="button"
                                        variant="outline"
                                        onClick={() => handleDelete(category)}
                                        className="!hover:bg-[var(--danger-background)] h-10 rounded-xl !border-[var(--danger)] text-sm font-bold !text-[var(--danger)]"
                                    >
                                        {t('dashboardLite.inventoryCategories.modal.deleteButton')}
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <PaginationBar
                    from={categories.from ?? 0}
                    to={categories.to ?? 0}
                    total={categories.total}
                    itemLabel={t('dashboardLite.inventoryCategories.itemsCountSuffix')}
                    links={categories.links}
                    perPage={filters.per_page ?? '10'}
                    onPerPageChange={(v) => applyFilters({ per_page: v })}
                />
            </div>

            {formCategory && (
                <InventoryCategoryFormModal category={formCategory === 'new' ? null : formCategory} onClose={() => setFormCategory(null)} />
            )}
            {confirmDialog}
        </DashboardSidebarLayout>
    );
}
