import {
    Button,
    CreateButton,
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
import { InventorySupplierCreateModal, InventorySupplierEditModal } from '@/features/advance/management/inventory/components';
import { useConfirmAction, useFilters, useLanguage } from '@/hooks';
import { DashboardSidebarLayout } from '@/layouts';
import { Head, router } from '@inertiajs/react';
import { Building2, Package } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Supplier {
    id: number;
    name: string;
    category_id: number | null;
    category: { id: number; name: string; color: string | null } | null;
    address: string | null;
    phone: string | null;
    email: string | null;
    logo: string | null;
    is_active: boolean;
}

interface CategoryOption {
    id: number;
    name: string;
}

interface InventorySupplierListProps {
    suppliers: {
        data: Supplier[];
        total: number;
        from: number;
        to: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    categories: CategoryOption[];
    is_branch_manager: boolean;
    filters: { search?: string; category_id?: string; per_page?: string; status?: string };
}

export default function InventorySupplierList({ suppliers, categories, is_branch_manager, filters }: InventorySupplierListProps) {
    const { t } = useLanguage();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editSupplier, setEditSupplier] = useState<Supplier | null>(null);
    const { search, setSearch, applyFilters, handleSearch } = useFilters('dashboard.inventory.suppliers.index', filters);
    const { confirmAndRun, confirmDialog } = useConfirmAction();
    const [supplierRows, setSupplierRows] = useState<Supplier[]>(suppliers.data);

    useEffect(() => {
        setSupplierRows(suppliers.data);
    }, [suppliers.data]);

    const canManageCatalog = !is_branch_manager;

    const handleDeactivate = (supplier: Supplier) => {
        confirmAndRun(
            `${t('dashboardAdvance.inventorySuppliers.list.deactivateConfirmPrefix')} "${supplier.name}"?`,
            () => router.patch(route('dashboard.inventory.suppliers.toggle-active', supplier.id), {}, { preserveScroll: true }),
            'danger',
        );
    };

    const handleActivate = (supplier: Supplier) => {
        router.patch(route('dashboard.inventory.suppliers.toggle-active', supplier.id), {}, { preserveScroll: true });
    };

    const statusOptions = [
        { value: 'active', label: t('dashboardAdvance.inventorySuppliers.list.statusActive') },
        { value: 'inactive', label: t('dashboardAdvance.inventorySuppliers.list.statusInactive') },
    ];

    return (
        <DashboardSidebarLayout
            title={t('dashboardAdvance.inventorySuppliers.list.layoutTitle')}
            description={t('dashboardAdvance.inventorySuppliers.list.layoutDescription')}
        >
            <Head title={t('dashboardAdvance.inventorySuppliers.list.headTitle')} />
            <div className="min-h-screen bg-[var(--page-bg)] p-4 sm:p-6">
                <div className="mb-5 flex flex-col flex-wrap justify-between gap-4">
                    <div className="flex justify-between">
                        <SearchInput
                            value={search}
                            onChange={setSearch}
                            onSubmit={handleSearch}
                            placeholder={t('dashboardAdvance.inventorySuppliers.list.searchPlaceholder')}
                        />

                        {canManageCatalog && (
                            <CreateButton
                                label={t('dashboardAdvance.inventorySuppliers.list.createButton')}
                                onClick={() => setShowCreateModal(true)}
                            />
                        )}
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex gap-3">
                            <FilterDropdown
                                value={filters.category_id}
                                options={categories.map((c) => ({ value: String(c.id), label: c.name }))}
                                allLabel={t('dashboardAdvance.inventorySuppliers.list.allCategories')}
                                onChange={(v) => applyFilters({ category_id: v })}
                            />
                            {canManageCatalog && (
                                <FilterDropdown
                                    value={filters.status}
                                    options={statusOptions}
                                    allLabel={t('dashboardAdvance.inventorySuppliers.list.allStatus')}
                                    onChange={(v) => applyFilters({ status: v })}
                                />
                            )}
                        </div>
                    </div>
                </div>

                <div className="overflow-hidden rounded-2xl border border-[var(--border-strong)] bg-[var(--card)] shadow-sm">
                    <div className="overflow-x-auto">
                        <Table className="min-w-[680px]">
                            <TableHeader className="bg-[var(--surface-header)]">
                                <TableRow className="border-none hover:bg-[var(--surface-header)]">
                                    <TableHead className="text-[var(--text-light)]">
                                        {t('dashboardAdvance.inventorySuppliers.list.columnName')}
                                    </TableHead>
                                    <TableHead className="text-[var(--text-light)]">
                                        {t('dashboardAdvance.inventorySuppliers.list.columnCategory')}
                                    </TableHead>
                                    <TableHead className="text-[var(--text-light)]">
                                        {t('dashboardAdvance.inventorySuppliers.list.columnContact')}
                                    </TableHead>
                                    <TableHead className="text-[var(--text-light)]">
                                        {t('dashboardAdvance.inventorySuppliers.list.columnStatus')}
                                    </TableHead>
                                    {canManageCatalog && (
                                        <TableHead className="text-[var(--text-light)]">
                                            {t('dashboardAdvance.inventorySuppliers.list.columnAction')}
                                        </TableHead>
                                    )}
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {supplierRows.length === 0 ? (
                                    <TableEmptyState
                                        colSpan={7}
                                        icon={Package}
                                        message={t('dashboardAdvance.inventorySuppliers.list.emptyTitle')}
                                        description={t('dashboardAdvance.inventorySuppliers.list.emptyDescription')}
                                        action={{
                                            label: t('dashboardAdvance.inventorySuppliers.list.emptyActionLabel'),
                                            onClick: () => setShowCreateModal(true),
                                        }}
                                    />
                                ) : (
                                    supplierRows.map((supplier) => (
                                        <TableRow key={supplier.id} className={!supplier.is_active ? 'opacity-60' : ''}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    {supplier.logo ? (
                                                        <img
                                                            src={`/storage/${supplier.logo}`}
                                                            alt={supplier.name}
                                                            className="h-10 w-10 shrink-0 rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--second-accent)]">
                                                            <Building2 className="h-5 w-5 text-[var(--grey-text)]" />
                                                        </div>
                                                    )}
                                                    <span className="truncate font-medium text-[var(--subheading)]">{supplier.name}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {supplier.category ? (
                                                    <span
                                                        className="rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap"
                                                        style={{
                                                            backgroundColor: `${supplier.category.color ?? '#94a3b8'}1a`,
                                                            color: supplier.category.color ?? '#94a3b8',
                                                        }}
                                                    >
                                                        {supplier.category.name}
                                                    </span>
                                                ) : (
                                                    <span className="text-xs text-[var(--grey-text)]">
                                                        {t('dashboardAdvance.inventorySuppliers.list.noCategoryFallback')}
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-[var(--grey-text)]">
                                                <div className="text-sm whitespace-nowrap">{supplier.phone ?? '-'}</div>
                                                <div className="text-xs whitespace-nowrap">{supplier.email ?? '-'}</div>
                                            </TableCell>
                                            <TableCell>
                                                <span
                                                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ${
                                                        supplier.is_active
                                                            ? 'bg-[var(--success-background)] text-[var(--success)]'
                                                            : 'bg-[var(--danger-background)] text-[var(--danger)]'
                                                    }`}
                                                >
                                                    {supplier.is_active
                                                        ? t('dashboardAdvance.inventorySuppliers.list.statusActive')
                                                        : t('dashboardAdvance.inventorySuppliers.list.statusInactive')}
                                                </span>
                                            </TableCell>
                                            {canManageCatalog && (
                                                <TableCell>
                                                    <div className="flex flex-wrap gap-2 whitespace-nowrap">
                                                        <Button
                                                            variant="outline"
                                                            aria-label={`${t('dashboardAdvance.inventorySuppliers.list.editAriaLabelPrefix')} ${supplier.name}`}
                                                            onClick={() => setEditSupplier(supplier)}
                                                            className="text-xs font-medium text-[var(--secondary-600)] hover:underline"
                                                        >
                                                            {t('dashboardAdvance.inventorySuppliers.list.editLabel')}
                                                        </Button>
                                                        {supplier.is_active ? (
                                                            <Button
                                                                variant="outline"
                                                                aria-label={`${t('dashboardAdvance.inventorySuppliers.list.deactivateAriaLabelPrefix')} ${supplier.name}`}
                                                                onClick={() => handleDeactivate(supplier)}
                                                                className="border-1 !border-[var(--danger)] text-xs font-medium !text-[var(--danger)] hover:underline"
                                                            >
                                                                {t('dashboardAdvance.inventorySuppliers.list.toggleDeactivateLabel')}
                                                            </Button>
                                                        ) : (
                                                            <Button
                                                                variant="outline"
                                                                aria-label={`${t('dashboardAdvance.inventorySuppliers.list.activateAriaLabelPrefix')} ${supplier.name}`}
                                                                onClick={() => handleActivate(supplier)}
                                                                className="text-xs font-medium text-[var(--success)] hover:underline"
                                                            >
                                                                {t('dashboardAdvance.inventorySuppliers.list.toggleActivateLabel')}
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
                    from={suppliers.from ?? 0}
                    to={suppliers.to ?? 0}
                    total={suppliers.total}
                    itemLabel={t('dashboardAdvance.inventorySuppliers.list.itemLabel')}
                    links={suppliers.links}
                    perPage={filters.per_page ?? '5'}
                    onPerPageChange={(v) => applyFilters({ per_page: v })}
                />
            </div>

            {canManageCatalog && showCreateModal && (
                <InventorySupplierCreateModal categories={categories} onClose={() => setShowCreateModal(false)} />
            )}

            {canManageCatalog && editSupplier && (
                <InventorySupplierEditModal supplier={editSupplier} categories={categories} onClose={() => setEditSupplier(null)} />
            )}

            {confirmDialog}
        </DashboardSidebarLayout>
    );
}
