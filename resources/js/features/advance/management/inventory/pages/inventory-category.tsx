import { Button, PaginationBar, SearchInput, Table, TableBody, TableCell, TableEmptyState, TableHead, TableHeader, TableRow } from '@/components';
import {
    InventoryCategoryActionsMenu,
    InventoryCategoryCreateModal,
    InventoryCategoryEditModal,
    type InventoryCategory,
} from '@/features/advance/management/inventory/components';
import { useConfirmAction, useDropdownMenu, useFilters, useLanguage } from '@/hooks';
import { DashboardSidebarLayout } from '@/layouts';
import { Head } from '@inertiajs/react';
import { MoreVertical, Plus } from 'lucide-react';
import { useState } from 'react';

interface InventoryCategoryListProps {
    categories: {
        data: InventoryCategory[];
        total: number;
        from: number;
        to: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    filters: { search?: string; per_page?: string };
    can_manage_catalog: boolean;
}

export default function InventoryCategoryList({ categories, filters, can_manage_catalog }: InventoryCategoryListProps) {
    const { t } = useLanguage();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editCategory, setEditCategory] = useState<InventoryCategory | null>(null);
    const { search, setSearch, applyFilters, handleSearch } = useFilters('dashboard.inventory.categories.index', filters);
    const { openId: openMenuId, position: menuPosition, buttonRefs, toggleMenu, closeMenu } = useDropdownMenu();
    const { confirmAndDelete } = useConfirmAction();

    const handleEdit = (category: InventoryCategory) => {
        setEditCategory(category);
        closeMenu();
    };

    const handleDelete = (id: number) => {
        confirmAndDelete(t('dashboardAdvance.inventoryCategories.list.deleteConfirm'), route('dashboard.inventory.categories.destroy', id));
        closeMenu();
    };
    const activeMenuCategory = categories.data.find((c) => c.id === openMenuId);

    return (
        <DashboardSidebarLayout
            title={t('dashboardAdvance.inventoryCategories.list.layoutTitle')}
            description={t('dashboardAdvance.inventoryCategories.list.layoutDescription')}
        >
            <Head title={t('dashboardAdvance.inventoryCategories.list.headTitle')} />
            <div className="min-h-screen bg-[var(--page-bg)] p-4 sm:p-6">
                <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
                    <SearchInput
                        value={search}
                        onChange={setSearch}
                        onSubmit={handleSearch}
                        placeholder={t('dashboardAdvance.inventoryCategories.list.searchPlaceholder')}
                    />

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
                        <Table className="min-w-[420px]">
                            <TableHeader className="bg-[var(--surface-header)]">
                                <TableRow className="border-none hover:bg-[var(--surface-header)]">
                                    <TableHead className="text-[var(--text-light)]">
                                        {t('dashboardAdvance.inventoryCategories.list.columnName')}
                                    </TableHead>
                                    <TableHead className="text-[var(--text-light)]">
                                        {t('dashboardAdvance.inventoryCategories.list.columnItemsCount')}
                                    </TableHead>
                                    {can_manage_catalog && (
                                        <TableHead className="w-[60px] text-[var(--text-light)]">
                                            {t('dashboardAdvance.inventoryCategories.list.columnAction')}
                                        </TableHead>
                                    )}
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {categories.data.length === 0 ? (
                                    <TableEmptyState
                                        colSpan={can_manage_catalog ? 3 : 2}
                                        message={
                                            filters.search
                                                ? `${t('dashboardAdvance.inventoryCategories.list.notFoundPrefix')} "${filters.search}" ${t('dashboardAdvance.inventoryCategories.list.notFoundSuffix')}`
                                                : t('dashboardAdvance.inventoryCategories.list.emptyState')
                                        }
                                    />
                                ) : (
                                    categories.data.map((category) => (
                                        <TableRow key={category.id}>
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
                                            {can_manage_catalog && (
                                                <TableCell className="relative">
                                                    <Button
                                                        ref={(el) => {
                                                            buttonRefs.current[category.id] = el;
                                                        }}
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => toggleMenu(category.id)}
                                                    >
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
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

            {can_manage_catalog && activeMenuCategory && (
                <InventoryCategoryActionsMenu
                    category={activeMenuCategory}
                    position={menuPosition}
                    onClose={closeMenu}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            )}

            {can_manage_catalog && showCreateModal && <InventoryCategoryCreateModal onClose={() => setShowCreateModal(false)} />}

            {can_manage_catalog && editCategory && <InventoryCategoryEditModal category={editCategory} onClose={() => setEditCategory(null)} />}
        </DashboardSidebarLayout>
    );
}
