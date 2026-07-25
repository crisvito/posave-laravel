import {
    Button,
    CreateButton,
    FilterDropdown,
    ListToolbar,
    PaginationBar,
    ResponsiveTableCard,
    SearchInput,
    Table,
    TableBody,
    TableCell,
    TableEmptyState,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components';
import {
    InventoryItemActionsMenu,
    InventoryItemCreateModal,
    InventoryItemDetailModal,
    InventoryItemEditModal,
    type InventoryCategory,
    type InventoryItem,
} from '@/features/advance/management/inventory/components';
import { useConfirmAction, useDropdownMenu, useFilters, useLanguage } from '@/hooks';
import { DashboardSidebarLayout } from '@/layouts';
import { Head, router } from '@inertiajs/react';
import { MoreVertical, Package, Store } from 'lucide-react';
import { useEffect, useState } from 'react';
import { resolveBranchId } from '../lib';

interface InventoryItemListProps {
    items: {
        data: InventoryItem[];
        total: number;
        from: number;
        to: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    categories: InventoryCategory[];
    branches: { id: number; name: string }[];
    filters: { search?: string; category_id?: string; branch_id?: string; per_page?: string; status?: string; stock_status?: string };
    is_branch_manager: boolean;
    can_manage_catalog: boolean;
}

export default function InventoryItemList({ items, categories, branches, filters, is_branch_manager, can_manage_catalog }: InventoryItemListProps) {
    const { t } = useLanguage();
    const { openId: openMenuId, position: menuPosition, buttonRefs, toggleMenu, closeMenu } = useDropdownMenu();
    const [detailItem, setDetailItem] = useState<InventoryItem | null>(null);
    const [editItem, setEditItem] = useState<InventoryItem | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const { search, setSearch, applyFilters, handleSearch } = useFilters('dashboard.inventory.items.index', filters);
    const [itemRows, setItemRows] = useState<InventoryItem[]>(items.data);
    const { confirmAndRun, confirmDialog } = useConfirmAction();

    useEffect(() => {
        setItemRows(items.data);
    }, [items.data]);

    const handleShowDetail = (item: InventoryItem) => {
        setDetailItem(item);
        closeMenu();
    };
    const handleShowEdit = (item: InventoryItem) => {
        setEditItem(item);
        closeMenu();
    };
    const handleToggleActive = (item: InventoryItem) => {
        const doToggle = () => router.patch(route('dashboard.inventory.items.toggle-active', item.id), {}, { preserveScroll: true });

        if (item.is_active) {
            confirmAndRun(`${t('dashboardAdvance.inventoryItems.list.deactivateConfirmPrefix')} "${item.name}"?`, doToggle, 'danger');
        } else {
            doToggle();
        }
        closeMenu();
    };

    const activeMenuitem = itemRows.find((i) => i.id === openMenuId);
    const activeBranchName = branches.find((b) => String(b.id) === filters.branch_id)?.name;
    const selectedBranchId = resolveBranchId({ isBranchManager: is_branch_manager, branches, filterBranchId: filters.branch_id });
    const hasSelectedBranch = !!selectedBranchId;
    const getStockStatus = (item: InventoryItem) => {
        if (item.current_stock === 0)
            return { label: t('dashboardAdvance.inventoryItems.list.statusOutOfStock'), color: 'bg-[var(--danger-background)] text-[var(--danger)]' };
        if (item.current_stock <= item.min_stock)
            return { label: t('dashboardAdvance.inventoryItems.list.statusLowStock'), color: 'bg-[var(--warning-background)] text-[var(--warning)]' };
        return { label: t('dashboardAdvance.inventoryItems.list.statusSafe'), color: 'bg-[var(--success-background)] text-[var(--success)]' };
    };

    const activeStatusOptions = [
        { value: 'active', label: t('dashboardAdvance.inventoryItems.list.activeStatusActive') },
        { value: 'inactive', label: t('dashboardAdvance.inventoryItems.list.activeStatusInactive') },
    ];
    const stockStatusOptions = [
        { value: 'safe', label: t('dashboardAdvance.inventoryItems.list.statusSafe') },
        { value: 'low', label: t('dashboardAdvance.inventoryItems.list.statusLowStock') },
        { value: 'out', label: t('dashboardAdvance.inventoryItems.list.statusOutOfStock') },
    ];

    return (
        <DashboardSidebarLayout
            title={t('dashboardAdvance.inventoryItems.list.layoutTitle')}
            description={t('dashboardAdvance.inventoryItems.list.layoutDescription')}
        >
            <Head title={t('dashboardAdvance.inventoryItems.list.headTitle')} />
            <div className="min-h-screen bg-[var(--page-bg)] p-4 sm:p-6">
                <ListToolbar
                    branch={
                        !is_branch_manager ? (
                            <FilterDropdown
                                value={filters.branch_id}
                                options={branches.map((b) => ({ value: String(b.id), label: b.name }))}
                                allLabel={t('dashboardAdvance.inventoryItems.list.allBranches')}
                                onChange={(v) => applyFilters({ branch_id: v })}
                                icon={<Store className="h-4 w-4" />}
                            />
                        ) : (
                            <div className="flex shrink-0 items-center gap-2 rounded-lg bg-[var(--second-accent)] px-3 py-2 text-sm font-medium text-[var(--subheading)]">
                                <Store className="h-4 w-4" />
                                {branches[0]?.name ?? t('dashboardAdvance.inventoryItems.list.yourBranchFallback')}
                            </div>
                        )
                    }
                    search={
                        <SearchInput
                            value={search}
                            onChange={setSearch}
                            onSubmit={handleSearch}
                            placeholder={t('dashboardAdvance.inventoryItems.list.searchPlaceholder')}
                        />
                    }
                    filters={
                        <>
                            {can_manage_catalog && (
                                <FilterDropdown
                                    value={filters.status}
                                    options={activeStatusOptions}
                                    allLabel={t('dashboardAdvance.inventoryItems.list.allActiveStatus')}
                                    onChange={(v) => applyFilters({ status: v })}
                                />
                            )}
                            <FilterDropdown
                                value={filters.stock_status}
                                options={stockStatusOptions}
                                allLabel={t('dashboardAdvance.inventoryItems.list.allStockStatus')}
                                onChange={(v) => applyFilters({ stock_status: v })}
                            />
                            <FilterDropdown
                                value={filters.category_id}
                                options={categories.map((c) => ({ value: String(c.id), label: c.name }))}
                                allLabel={t('dashboardAdvance.inventoryItems.list.allCategories')}
                                onChange={(v) => applyFilters({ category_id: v })}
                            />
                        </>
                    }
                    action={
                        can_manage_catalog && (
                            <CreateButton label={t('dashboardAdvance.inventoryItems.list.createButton')} onClick={() => setShowCreateModal(true)} />
                        )
                    }
                />

                <ResponsiveTableCard>
                    <Table className="min-w-[900px]">
                        <TableHeader className="bg-[var(--surface-header)]">
                            <TableRow className="border-none hover:bg-[var(--surface-header)]">
                                <TableHead className="text-[var(--text-light)]">{t('dashboardAdvance.inventoryItems.list.columnName')}</TableHead>
                                <TableHead className="text-[var(--text-light)]">{t('dashboardAdvance.inventoryItems.list.columnCategory')}</TableHead>
                                <TableHead className="text-[var(--text-light)]">
                                    {t('dashboardAdvance.inventoryItems.list.columnStock')}{' '}
                                    {activeBranchName
                                        ? `(${activeBranchName})`
                                        : is_branch_manager
                                          ? ''
                                          : t('dashboardAdvance.inventoryItems.list.allBranchesSuffix')}
                                </TableHead>
                                <TableHead className="text-[var(--text-light)]">{t('dashboardAdvance.inventoryItems.list.columnPrice')}</TableHead>
                                <TableHead className="text-[var(--text-light)]">{t('dashboardAdvance.inventoryItems.list.columnStatus')}</TableHead>
                                <TableHead className="text-[var(--text-light)]">
                                    {t('dashboardAdvance.inventoryItems.list.columnActiveStatus')}
                                </TableHead>
                                <TableHead className="w-[60px] text-[var(--text-light)]">
                                    {t('dashboardAdvance.inventoryItems.list.columnAction')}
                                </TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {itemRows.length === 0 ? (
                                <TableEmptyState
                                    colSpan={7}
                                    icon={Package}
                                    message={t('dashboardAdvance.inventoryItems.list.emptyTitle')}
                                    description={t('dashboardAdvance.inventoryItems.list.emptyDescription')}
                                    action={{
                                        label: t('dashboardAdvance.inventoryItems.list.emptyActionLabel'),
                                        onClick: () => setShowCreateModal(true),
                                    }}
                                />
                            ) : (
                                itemRows.map((item) => {
                                    const status = getStockStatus(item);

                                    return (
                                        <TableRow key={item.id} className={!item.is_active ? 'opacity-60' : ''}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    {item.image ? (
                                                        <img
                                                            src={`/storage/${item.image}`}
                                                            alt={item.name}
                                                            className="h-10 w-10 shrink-0 rounded-lg object-cover"
                                                        />
                                                    ) : (
                                                        <div className="h-10 w-10 shrink-0 rounded-lg bg-[var(--second-accent)]" />
                                                    )}
                                                    <div className="min-w-0">
                                                        <div className="truncate font-medium text-[var(--subheading)]">{item.name}</div>
                                                        <div className="text-xs text-[var(--grey-text)]">SKU: {item.sku}</div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span
                                                    className="rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap"
                                                    style={{
                                                        backgroundColor: `${item.category.color ?? '#94a3b8'}1a`,
                                                        color: item.category.color ?? '#94a3b8',
                                                    }}
                                                >
                                                    {item.category.name}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-[var(--grey-text)]">
                                                {hasSelectedBranch ? (
                                                    <span className="font-semibold text-[var(--subheading)]">{item.current_stock}</span>
                                                ) : (
                                                    <span title={t('dashboardAdvance.inventoryItems.list.selectBranchTitle')}>
                                                        {item.current_stock}
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell className="whitespace-nowrap text-[var(--grey-text)]">
                                                Rp {Number(item.price).toLocaleString('id-ID')}
                                            </TableCell>
                                            <TableCell>
                                                <div>
                                                    <div className="text-xs text-[var(--grey-text)]">
                                                        {t('dashboardAdvance.inventoryItems.list.minStockPrefix')} {item.min_stock}
                                                    </div>
                                                    <span
                                                        className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap ${status.color}`}
                                                    >
                                                        {status.label}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span
                                                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ${
                                                        item.is_active
                                                            ? 'bg-[var(--success-background)] text-[var(--success)]'
                                                            : 'bg-[var(--danger-background)] text-[var(--danger)]'
                                                    }`}
                                                >
                                                    {item.is_active
                                                        ? t('dashboardAdvance.inventoryItems.list.activeStatusActive')
                                                        : t('dashboardAdvance.inventoryItems.list.activeStatusInactive')}
                                                </span>
                                            </TableCell>
                                            <TableCell className="relative">
                                                {can_manage_catalog ? (
                                                    <Button
                                                        ref={(el) => {
                                                            buttonRefs.current[item.id] = el;
                                                        }}
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => toggleMenu(item.id)}
                                                    >
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        aria-label={`${t('dashboardAdvance.inventoryItems.list.viewDetailAriaLabelPrefix')} ${item.name}`}
                                                        onClick={() => handleShowDetail(item)}
                                                        className="text-xs font-medium whitespace-nowrap text-[var(--secondary-600)] hover:underline"
                                                    >
                                                        {t('dashboardAdvance.inventoryItems.list.viewLabel')}
                                                    </Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </ResponsiveTableCard>

                <PaginationBar
                    from={items.from ?? 0}
                    to={items.to ?? 0}
                    total={items.total}
                    itemLabel={t('dashboardAdvance.inventoryItems.list.itemLabel')}
                    links={items.links}
                    perPage={filters.per_page ?? '5'}
                    onPerPageChange={(v) => applyFilters({ per_page: v })}
                />
            </div>

            {can_manage_catalog && activeMenuitem && (
                <InventoryItemActionsMenu
                    item={activeMenuitem}
                    position={menuPosition}
                    onClose={closeMenu}
                    onView={handleShowDetail}
                    onEdit={handleShowEdit}
                    onToggleActive={handleToggleActive}
                />
            )}

            {detailItem && <InventoryItemDetailModal item={detailItem} onClose={() => setDetailItem(null)} />}

            {can_manage_catalog && showCreateModal && (
                <InventoryItemCreateModal categories={categories} branches={branches} onClose={() => setShowCreateModal(false)} />
            )}

            {can_manage_catalog && editItem && <InventoryItemEditModal item={editItem} categories={categories} onClose={() => setEditItem(null)} />}

            {confirmDialog}
        </DashboardSidebarLayout>
    );
}
