import {
    Button,
    FilterDropdown,
    PaginationBar,
    SearchInput,
    Table,
    TableBody,
    TableCell,
    TableEmptyState,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components';
import { InventoryCategoryCreateModal, InventoryCategoryEditModal, type InventoryCategory } from '@/features/advance/management/inventory/components';
import { useConfirmAction, useFilters, useLanguage } from '@/hooks';
import { DashboardSidebarLayout } from '@/layouts';
import { Head, router } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';

interface InventoryCategoryListProps {
    categories: {
        data: InventoryCategory[];
        total: number;
        from: number;
        to: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    filters: { search?: string; per_page?: string; status?: string };
    can_manage_catalog: boolean;
}

export default function InventoryCategoryList({ categories, filters, can_manage_catalog }: InventoryCategoryListProps) {
    const { t } = useLanguage();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editCategory, setEditCategory] = useState<InventoryCategory | null>(null);
    const { search, setSearch, applyFilters, handleSearch } = useFilters('dashboard.inventory.categories.index', filters);
    const { confirmAndRun, confirmDialog } = useConfirmAction();
    const [categoryRows, setCategoryRows] = useState<InventoryCategory[]>(categories.data);

    useEffect(() => {
        setCategoryRows(categories.data);
    }, [categories.data]);

    const handleDeactivate = (category: InventoryCategory) => {
        confirmAndRun(
            `${t('dashboardAdvance.inventoryCategories.list.deactivateConfirmPrefix')} "${category.name}"?`,
            () => router.patch(route('dashboard.inventory.categories.toggle-active', category.id), {}, { preserveScroll: true }),
            'danger',
        );
    };

    const handleActivate = (category: InventoryCategory) => {
        router.patch(route('dashboard.inventory.categories.toggle-active', category.id), {}, { preserveScroll: true });
    };

    const statusOptions = [
        { value: 'active', label: t('dashboardAdvance.inventoryCategories.list.statusActive') },
        { value: 'inactive', label: t('dashboardAdvance.inventoryCategories.list.statusInactive') },
    ];

    return (
        <DashboardSidebarLayout
            title={t('dashboardAdvance.inventoryCategories.list.layoutTitle')}
            description={t('dashboardAdvance.inventoryCategories.list.layoutDescription')}
        >
            <Head title={t('dashboardAdvance.inventoryCategories.list.headTitle')} />
            <div className="min-h-screen bg-[var(--page-bg)] p-4 sm:p-6">
                <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-3">
                        <SearchInput
                            value={search}
                            onChange={setSearch}
                            onSubmit={handleSearch}
                            placeholder={t('dashboardAdvance.inventoryCategories.list.searchPlaceholder')}
                        />
                        {can_manage_catalog && (
                            <FilterDropdown
                                value={filters.status}
                                options={statusOptions}
                                allLabel={t('dashboardAdvance.inventoryCategories.list.filterAllStatus')}
                                onChange={(v) => applyFilters({ status: v })}
                            />
                        )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        {can_manage_catalog && (
                            <Button
                                onClick={() => setShowCreateModal(true)}
                                className="bg-[var(--surface-header)] hover:bg-[var(--surface-header-hover)]"
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                {t('dashboardAdvance.inventoryCategories.list.createButton')}
                            </Button>
                        )}
                    </div>
                </div>

                <div className="overflow-hidden rounded-2xl border border-[var(--border-strong)] bg-[var(--card)] shadow-sm">
                    <div className="overflow-x-auto">
                        <Table className="min-w-[560px]">
                            <TableHeader className="bg-[var(--surface-header)]">
                                <TableRow className="border-none hover:bg-[var(--surface-header)]">
                                    <TableHead className="text-[var(--text-light)]">
                                        {t('dashboardAdvance.inventoryCategories.list.columnName')}
                                    </TableHead>
                                    <TableHead className="text-[var(--text-light)]">
                                        {t('dashboardAdvance.inventoryCategories.list.columnItemsCount')}
                                    </TableHead>
                                    <TableHead className="text-[var(--text-light)]">
                                        {t('dashboardAdvance.inventoryCategories.list.columnStatus')}
                                    </TableHead>
                                    {can_manage_catalog && (
                                        <TableHead className="text-[var(--text-light)]">
                                            {t('dashboardAdvance.inventoryCategories.list.columnAction')}
                                        </TableHead>
                                    )}
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {categoryRows.length === 0 ? (
                                    <TableEmptyState
                                        colSpan={can_manage_catalog ? 4 : 3}
                                        message={
                                            filters.search
                                                ? `${t('dashboardAdvance.inventoryCategories.list.notFoundPrefix')} "${filters.search}" ${t('dashboardAdvance.inventoryCategories.list.notFoundSuffix')}`
                                                : t('dashboardAdvance.inventoryCategories.list.emptyState')
                                        }
                                    />
                                ) : (
                                    categoryRows.map((category) => (
                                        <TableRow key={category.id} className={!category.is_active ? 'opacity-60' : ''}>
                                            <TableCell>
                                                <span
                                                    className="rounded-full px-3 py-1 text-xs font-medium"
                                                    style={{
                                                        backgroundColor: `${category.color ?? '#94a3b8'}1a`,
                                                        color: category.color ?? '#94a3b8',
                                                    }}
                                                >
                                                    {category.name}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-[var(--grey-text)]">
                                                {category.items_count} {t('dashboardAdvance.inventoryCategories.list.itemsCountSuffix')}
                                            </TableCell>
                                            <TableCell>
                                                <span
                                                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ${
                                                        category.is_active
                                                            ? 'bg-[var(--success-background)] text-[var(--success)]'
                                                            : 'bg-[var(--danger-background)] text-[var(--danger)]'
                                                    }`}
                                                >
                                                    {category.is_active
                                                        ? t('dashboardAdvance.inventoryCategories.list.statusActive')
                                                        : t('dashboardAdvance.inventoryCategories.list.statusInactive')}
                                                </span>
                                            </TableCell>
                                            {can_manage_catalog && (
                                                <TableCell>
                                                    <div className="flex flex-wrap gap-2 whitespace-nowrap">
                                                        <Button
                                                            aria-label={`${t('dashboardAdvance.inventoryCategories.list.editAriaLabelPrefix')} ${category.name}`}
                                                            onClick={() => setEditCategory(category)}
                                                            className="text-xs font-medium text-[var(--secondary-600)] hover:underline"
                                                        >
                                                            {t('dashboardAdvance.inventoryCategories.list.editLabel')}
                                                        </Button>
                                                        {category.is_active ? (
                                                            <Button
                                                                variant="outline"
                                                                aria-label={`${t('dashboardAdvance.inventoryCategories.list.toggleAriaLabelPrefix')} ${category.name}`}
                                                                onClick={() => handleDeactivate(category)}
                                                                className="border-1 !border-[var(--danger)] text-xs font-medium !text-[var(--danger)] hover:underline"
                                                            >
                                                                {t('dashboardAdvance.inventoryCategories.list.toggleDeactivateLabel')}
                                                            </Button>
                                                        ) : (
                                                            <Button
                                                                aria-label={`${t('dashboardAdvance.inventoryCategories.list.toggleAriaLabelPrefix')} ${category.name}`}
                                                                onClick={() => handleActivate(category)}
                                                                className="text-xs font-medium text-[var(--success)] hover:underline"
                                                            >
                                                                {t('dashboardAdvance.inventoryCategories.list.toggleActivateLabel')}
                                                            </Button>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            )}
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                <PaginationBar
                    from={categories.from ?? 0}
                    to={categories.to ?? 0}
                    total={categories.total}
                    itemLabel={t('dashboardAdvance.inventoryCategories.list.itemLabel')}
                    links={categories.links}
                    perPage={filters.per_page ?? '5'}
                    onPerPageChange={(v) => applyFilters({ per_page: v })}
                />
            </div>

            {can_manage_catalog && showCreateModal && <InventoryCategoryCreateModal onClose={() => setShowCreateModal(false)} />}

            {can_manage_catalog && editCategory && <InventoryCategoryEditModal category={editCategory} onClose={() => setEditCategory(null)} />}

            {confirmDialog}
        </DashboardSidebarLayout>
    );
}
