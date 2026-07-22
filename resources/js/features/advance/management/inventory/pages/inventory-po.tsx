import {
    Button,
    CreateButton,
    DateNavigator,
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
import { InventoryPurchaseOrderActionsMenu, InventoryPurchaseOrderCreateModal } from '@/features/advance/management/inventory/components';
import { useConfirmAction, useDropdownMenu, useFilters, useLanguage } from '@/hooks';
import { DashboardSidebarLayout } from '@/layouts';
import { Head, router } from '@inertiajs/react';
import { MoreVertical, Package, Store } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Supplier {
    id: number;
    name: string;
}
interface BranchOption {
    id: number;
    name: string;
}
interface InventoryItemOption {
    id: number;
    name: string;
    sku: string;
    price: number;
}

interface PurchaseOrder {
    id: number;
    po_number: string;
    date: string;
    total_price: number;
    status: 'waiting_fulfilment' | 'success' | 'cancelled';
    items_count: number;
    branch: BranchOption;
    supplier: Supplier;
}

interface InventoryPurchaseOrderListProps {
    purchaseOrders: {
        data: PurchaseOrder[];
        links: { url: string | null; label: string; active: boolean }[];
        from: number;
        to: number;
        total: number;
    };
    suppliers: Supplier[];
    inventoryItems: InventoryItemOption[];
    lastPurchasePrices: Record<number, number>;
    branches: BranchOption[];
    my_branch_id: number | null;
    is_branch_manager: boolean;
    filters: { branch_id?: string; date?: string; status?: string; search?: string; per_page?: string };
}

export default function InventoryPurchaseOrderList({
    purchaseOrders,
    suppliers,
    inventoryItems,
    lastPurchasePrices,
    branches,
    my_branch_id,
    is_branch_manager,
    filters,
}: InventoryPurchaseOrderListProps) {
    const { locale, t } = useLanguage();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const { search, setSearch, applyFilters, handleSearch } = useFilters('dashboard.inventory.purchase-orders.index', filters);
    const { openId: openMenuId, position: menuPosition, buttonRefs, toggleMenu, closeMenu } = useDropdownMenu();
    const currentDate = filters.date ?? new Date().toISOString().slice(0, 10);
    const { confirmAndDelete, confirmDialog } = useConfirmAction();
    const [poRows, setPoRows] = useState<PurchaseOrder[]>(purchaseOrders.data);

    useEffect(() => {
        setPoRows(purchaseOrders.data);
    }, [purchaseOrders.data]);

    const dateLocale = locale === 'en' ? 'en-US' : 'id-ID';

    const statusLabel: Record<string, { text: string; className: string }> = {
        waiting_fulfilment: {
            text: t('dashboardAdvance.inventoryPurchaseOrders.list.statusWaiting'),
            className: 'bg-[var(--warning-background)] text-[var(--warning)]',
        },
        success: {
            text: t('dashboardAdvance.inventoryPurchaseOrders.list.statusSuccess'),
            className: 'bg-[var(--success-background)] text-[var(--success)]',
        },
        cancelled: {
            text: t('dashboardAdvance.inventoryPurchaseOrders.list.statusCancelled'),
            className: 'bg-[var(--danger-background)] text-[var(--danger)]',
        },
    };

    const STATUS_OPTIONS = [
        { value: 'waiting_fulfilment', label: t('dashboardAdvance.inventoryPurchaseOrders.list.statusWaiting') },
        { value: 'success', label: t('dashboardAdvance.inventoryPurchaseOrders.list.statusSuccess') },
        { value: 'cancelled', label: t('dashboardAdvance.inventoryPurchaseOrders.list.statusCancelled') },
    ];

    const handleUpdateStatus = (id: number, status: 'success' | 'cancelled') => {
        router.put(route('dashboard.inventory.purchase-orders.update', id), { status });
        closeMenu();
    };

    const handleDelete = (id: number) => {
        confirmAndDelete(t('dashboardAdvance.inventoryPurchaseOrders.list.deleteConfirm'), route('dashboard.inventory.purchase-orders.destroy', id), {
            onSuccess: () => setPoRows((prev) => prev.filter((po) => po.id !== id)),
        });
        closeMenu();
    };
    const activeMenuPO = poRows.find((po) => po.id === openMenuId);

    return (
        <DashboardSidebarLayout
            title={t('dashboardAdvance.inventoryPurchaseOrders.list.layoutTitle')}
            description={t('dashboardAdvance.inventoryPurchaseOrders.list.layoutDescription')}
        >
            <Head title={t('dashboardAdvance.inventoryPurchaseOrders.list.headTitle')} />
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[var(--page-bg)] p-4 sm:p-6">
                <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-3">
                        {!is_branch_manager ? (
                            <FilterDropdown
                                value={filters.branch_id}
                                options={branches.map((b) => ({ value: String(b.id), label: b.name }))}
                                allLabel={t('dashboardAdvance.inventoryPurchaseOrders.list.allBranches')}
                                onChange={(v) => applyFilters({ branch_id: v })}
                                icon={<Store className="h-4 w-4" />}
                            />
                        ) : (
                            <div className="flex shrink-0 items-center gap-2 rounded-lg bg-[var(--second-accent)] px-3 py-2 text-sm font-medium text-[var(--subheading)]">
                                <Store className="h-4 w-4" />
                                {branches[0]?.name ?? t('dashboardAdvance.inventoryPurchaseOrders.list.yourBranchFallback')}
                            </div>
                        )}

                        <DateNavigator date={currentDate} onChange={(date) => applyFilters({ date })} variant="default" size="sm" />
                    </div>

                    <div className="flex items-center gap-3">
                        <FilterDropdown
                            value={filters.status}
                            options={STATUS_OPTIONS}
                            allLabel={t('dashboardAdvance.inventoryPurchaseOrders.list.allStatus')}
                            onChange={(v) => applyFilters({ status: v })}
                        />
                        <CreateButton
                            label={t('dashboardAdvance.inventoryPurchaseOrders.list.createButton')}
                            onClick={() => setShowCreateModal(true)}
                        />
                    </div>
                </div>

                <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
                    <SearchInput
                        value={search}
                        onChange={setSearch}
                        onSubmit={handleSearch}
                        placeholder={t('dashboardAdvance.inventoryPurchaseOrders.list.searchPlaceholder')}
                    />
                </div>

                <div className="overflow-hidden rounded-2xl border border-[var(--border-strong)] bg-[var(--card)] shadow-sm">
                    <div className="overflow-x-auto">
                        <Table className="min-w-[760px]">
                            <TableHeader className="bg-[var(--surface-header)]">
                                <TableRow className="border-none hover:bg-[var(--surface-header)]">
                                    <TableHead className="text-[var(--text-light)]">
                                        {t('dashboardAdvance.inventoryPurchaseOrders.list.columnDate')}
                                    </TableHead>
                                    <TableHead className="text-[var(--text-light)]">
                                        {t('dashboardAdvance.inventoryPurchaseOrders.list.columnBranch')}
                                    </TableHead>
                                    <TableHead className="text-[var(--text-light)]">
                                        {t('dashboardAdvance.inventoryPurchaseOrders.list.columnSupplier')}
                                    </TableHead>
                                    <TableHead className="text-[var(--text-light)]">
                                        {t('dashboardAdvance.inventoryPurchaseOrders.list.columnPoNumber')}
                                    </TableHead>
                                    <TableHead className="text-[var(--text-light)]">
                                        {t('dashboardAdvance.inventoryPurchaseOrders.list.columnTotalPrice')}
                                    </TableHead>
                                    <TableHead className="text-[var(--text-light)]">
                                        {t('dashboardAdvance.inventoryPurchaseOrders.list.columnStatus')}
                                    </TableHead>
                                    <TableHead className="w-[60px] text-[var(--text-light)]">
                                        {t('dashboardAdvance.inventoryPurchaseOrders.list.columnAction')}
                                    </TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {poRows.length === 0 ? (
                                    <TableEmptyState
                                        colSpan={7}
                                        icon={Package}
                                        message={t('dashboardAdvance.inventoryPurchaseOrders.list.emptyTitle')}
                                        description={t('dashboardAdvance.inventoryPurchaseOrders.list.emptyDescription')}
                                        action={{
                                            label: t('dashboardAdvance.inventoryPurchaseOrders.list.emptyActionLabel'),
                                            onClick: () => setShowCreateModal(true),
                                        }}
                                    />
                                ) : (
                                    poRows.map((po) => (
                                        <TableRow key={po.id}>
                                            <TableCell>
                                                <div className="font-medium whitespace-nowrap">
                                                    {new Date(po.date).toLocaleTimeString(dateLocale, { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                                <div className="text-xs whitespace-nowrap text-[var(--grey-text)]">
                                                    {new Date(po.date).toLocaleDateString(dateLocale, {
                                                        day: 'numeric',
                                                        month: 'long',
                                                        year: 'numeric',
                                                    })}
                                                </div>
                                            </TableCell>
                                            <TableCell className="whitespace-nowrap">{po.branch.name}</TableCell>
                                            <TableCell className="whitespace-nowrap">{po.supplier.name}</TableCell>
                                            <TableCell className="whitespace-nowrap">#{po.po_number}</TableCell>
                                            <TableCell className="whitespace-nowrap">Rp. {Number(po.total_price).toLocaleString('id-ID')}</TableCell>
                                            <TableCell>
                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap ${statusLabel[po.status].className}`}
                                                >
                                                    {statusLabel[po.status].text}
                                                </span>
                                            </TableCell>
                                            <TableCell className="relative">
                                                {po.status !== 'success' ? (
                                                    <Button
                                                        ref={(el) => {
                                                            buttonRefs.current[po.id] = el;
                                                        }}
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => toggleMenu(po.id)}
                                                    >
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                ) : (
                                                    <span className="text-xs text-[var(--grey-text)]">—</span>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                <PaginationBar
                    from={purchaseOrders.from ?? 0}
                    to={purchaseOrders.to ?? 0}
                    total={purchaseOrders.total}
                    itemLabel={t('dashboardAdvance.inventoryPurchaseOrders.list.itemLabel')}
                    links={purchaseOrders.links}
                    perPage={filters.per_page ?? '6'}
                    onPerPageChange={(v) => applyFilters({ per_page: v })}
                />
            </div>

            {activeMenuPO && (
                <InventoryPurchaseOrderActionsMenu
                    purchaseOrder={activeMenuPO}
                    position={menuPosition}
                    onClose={closeMenu}
                    onUpdateStatus={handleUpdateStatus}
                    onDelete={handleDelete}
                />
            )}

            {showCreateModal && (
                <InventoryPurchaseOrderCreateModal
                    suppliers={suppliers}
                    inventoryItems={inventoryItems}
                    lastPurchasePrices={lastPurchasePrices}
                    branches={branches}
                    myBranchId={my_branch_id}
                    isBranchManager={is_branch_manager}
                    onClose={() => setShowCreateModal(false)}
                />
            )}

            {confirmDialog}
        </DashboardSidebarLayout>
    );
}
