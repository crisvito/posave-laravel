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
import { InventoryAdjustmentActionsMenu, InventoryAdjustmentCreateModal, type Adjustment } from '@/features/advance/management/inventory/components';
import { useConfirmAction, useDropdownMenu, useFilters, useLanguage } from '@/hooks';
import { DashboardSidebarLayout } from '@/layouts';
import { Head } from '@inertiajs/react';
import { ArrowUpDown, MoreVertical, Package, Store } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { resolveBranchId } from '../lib';

interface InventoryAdjustmentProps {
    adjustments: {
        data: Adjustment[];
        links: { url: string | null; label: string; active: boolean }[];
        from: number;
        to: number;
        total: number;
    };
    stats: {
        total_changes: number;
        items_changed: number;
        total_income: number;
        total_expense: number;
    };
    inventoryItems: { id: number; name: string; sku: string; price: number }[];
    branches: { id: number; name: string }[];
    is_branch_manager: boolean;
    filters: { date?: string; search?: string; branch_id?: string; status?: string; per_page?: string };
}

export default function InventoryAdjustment({ adjustments, stats, inventoryItems, branches, is_branch_manager, filters }: InventoryAdjustmentProps) {
    const { locale, t } = useLanguage();
    const { openId: openMenuId, position: menuPosition, buttonRefs, toggleMenu, closeMenu } = useDropdownMenu();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const { search, setSearch, applyFilters, handleSearch } = useFilters('dashboard.inventory.adjustments.index', filters);
    const currentDate = filters.date ?? new Date().toISOString().slice(0, 10);
    const { confirmAndDelete, confirmDialog } = useConfirmAction();
    const dateLocale = locale === 'en' ? 'en-US' : 'id-ID';
    const [adjustmentRows, setAdjustmentRows] = useState<Adjustment[]>(adjustments.data);

    useEffect(() => {
        setAdjustmentRows(adjustments.data);
    }, [adjustments.data]);

    const handleDelete = (id: number) => {
        confirmAndDelete(t('dashboardAdvance.inventoryAdjustments.list.deleteConfirm'), route('dashboard.inventory.adjustments.destroy', id), {
            onSuccess: () => setAdjustmentRows((prev) => prev.filter((a) => a.id !== id)),
        });
        closeMenu();
    };

    const groupedAdjustments = adjustmentRows.reduce<Record<string, Adjustment[]>>((acc, row) => {
        const dateKey = new Date(row.date).toLocaleDateString(dateLocale, {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push(row);
        return acc;
    }, {});

    const activeMenuAdj = adjustmentRows.find((a) => a.id === openMenuId);

    const statusOptions = [
        { value: 'in', label: t('dashboardAdvance.inventoryAdjustments.list.statusIn') },
        { value: 'out', label: t('dashboardAdvance.inventoryAdjustments.list.statusOut') },
    ];

    const defaultBranchId = resolveBranchId({ isBranchManager: is_branch_manager, branches, filterBranchId: filters.branch_id });

    return (
        <DashboardSidebarLayout
            title={t('dashboardAdvance.inventoryAdjustments.list.layoutTitle')}
            description={t('dashboardAdvance.inventoryAdjustments.list.layoutDescription')}
        >
            <Head title={t('dashboardAdvance.inventoryAdjustments.list.headTitle')} />

            <div className="flex min-h-screen flex-col gap-6 bg-[var(--page-bg)] p-4 sm:p-6">
                <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex flex-wrap items-center gap-3">
                            {!is_branch_manager ? (
                                <FilterDropdown
                                    value={filters.branch_id}
                                    options={branches.map((b) => ({ value: String(b.id), label: b.name }))}
                                    allLabel={t('dashboardAdvance.inventoryAdjustments.list.allBranches')}
                                    onChange={(v) => applyFilters({ branch_id: v })}
                                    icon={<Store className="h-4 w-4" />}
                                />
                            ) : (
                                <div className="flex shrink-0 items-center gap-2 rounded-lg bg-[var(--second-accent)] px-3 py-2 text-sm font-medium text-[var(--subheading)]">
                                    <Store className="h-4 w-4" />
                                    {branches[0]?.name ?? t('dashboardAdvance.inventoryAdjustments.list.yourBranchFallback')}
                                </div>
                            )}

                            <DateNavigator date={currentDate} onChange={(date) => applyFilters({ date })} variant="default" size="sm" />
                        </div>

                        <div className="flex items-center gap-3">
                            <FilterDropdown
                                value={filters.status}
                                options={statusOptions}
                                allLabel={t('dashboardAdvance.inventoryAdjustments.list.statusAll')}
                                onChange={(v) => applyFilters({ status: v })}
                                className="shrink-0"
                            />
                            <CreateButton
                                label={t('dashboardAdvance.inventoryAdjustments.list.createButton')}
                                onClick={() => setShowCreateModal(true)}
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <SearchInput
                            value={search}
                            onChange={setSearch}
                            onSubmit={handleSearch}
                            placeholder={t('dashboardAdvance.inventoryAdjustments.list.searchPlaceholder')}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-4">
                    <div className="flex items-center gap-2 rounded-xl border border-[var(--border-strong)] bg-[var(--card)] p-3 shadow-sm sm:gap-4 sm:p-5">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--second-accent)] sm:h-12 sm:w-12">
                            <ArrowUpDown className="h-5 w-5 text-[var(--grey-text)] sm:h-6 sm:w-6" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-lg font-bold text-[var(--subheading)] sm:text-2xl">{stats.total_changes}</p>
                            <p className="text-xs leading-tight font-medium text-[var(--subheading)] sm:text-sm">
                                {t('dashboardAdvance.inventoryAdjustments.list.statTotalChangesLabel')}
                            </p>
                            <p className="hidden text-[10px] leading-tight text-[var(--grey-text)] sm:block sm:text-xs">
                                {t('dashboardAdvance.inventoryAdjustments.list.statTotalChangesDescription')}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 rounded-xl border border-[var(--border-strong)] bg-[var(--card)] p-3 shadow-sm sm:gap-4 sm:p-5">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--success-background)] sm:h-12 sm:w-12">
                            <Package className="h-5 w-5 text-[var(--success)] sm:h-6 sm:w-6" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-lg font-bold text-[var(--subheading)] sm:text-2xl">{stats.items_changed}</p>
                            <p className="text-xs leading-tight font-medium text-[var(--subheading)] sm:text-sm">
                                {t('dashboardAdvance.inventoryAdjustments.list.statItemsChangedLabel')}
                            </p>
                            <p className="hidden text-[10px] leading-tight text-[var(--grey-text)] sm:block sm:text-xs">
                                {t('dashboardAdvance.inventoryAdjustments.list.statItemsChangedDescription')}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 rounded-xl border border-[var(--border-strong)] bg-[var(--card)] p-3 shadow-sm sm:gap-4 sm:p-5">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--income-icon-bg)] text-xs font-bold text-[var(--income-icon-text)] sm:h-12 sm:w-12 sm:text-sm">
                            Rp
                        </div>
                        <div className="min-w-0">
                            <p className="text-lg font-bold text-[var(--subheading)] sm:text-2xl">
                                {Number(stats.total_income).toLocaleString('id-ID')}
                            </p>
                            <p className="text-xs leading-tight font-medium text-[var(--subheading)] sm:text-sm">
                                {t('dashboardAdvance.inventoryAdjustments.list.statIncomeLabel')}
                            </p>
                            <p className="hidden text-[10px] leading-tight text-[var(--grey-text)] sm:block sm:text-xs">
                                {t('dashboardAdvance.inventoryAdjustments.list.statSourceDescription')}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 rounded-xl border border-[var(--border-strong)] bg-[var(--card)] p-3 shadow-sm sm:gap-4 sm:p-5">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--danger-background)] text-xs font-bold text-[var(--danger)] sm:h-12 sm:w-12 sm:text-sm">
                            Rp
                        </div>
                        <div className="min-w-0">
                            <p className="text-lg font-bold text-[var(--subheading)] sm:text-2xl">
                                {Math.abs(Number(stats.total_expense)).toLocaleString('id-ID')}
                            </p>
                            <p className="text-xs leading-tight font-medium text-[var(--subheading)] sm:text-sm">
                                {t('dashboardAdvance.inventoryAdjustments.list.statExpenseLabel')}
                            </p>
                            <p className="hidden text-[10px] leading-tight text-[var(--grey-text)] sm:block sm:text-xs">
                                {t('dashboardAdvance.inventoryAdjustments.list.statSourceDescription')}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="overflow-hidden rounded-xl border border-[var(--border-strong)] bg-[var(--card)] shadow-sm">
                    <div className="overflow-x-auto">
                        <Table className="min-w-[820px]">
                            <TableHeader className="bg-[var(--surface-header)]">
                                <TableRow className="border-none hover:bg-[var(--surface-header)]">
                                    <TableHead className="whitespace-nowrap text-[var(--text-light)]">
                                        {t('dashboardAdvance.inventoryAdjustments.list.columnDate')}
                                    </TableHead>
                                    <TableHead className="text-[var(--text-light)]">
                                        {t('dashboardAdvance.inventoryAdjustments.list.columnNote')}
                                    </TableHead>
                                    <TableHead className="text-[var(--text-light)]">
                                        {t('dashboardAdvance.inventoryAdjustments.list.columnItem')}
                                    </TableHead>
                                    <TableHead className="whitespace-nowrap text-[var(--text-light)]">
                                        {t('dashboardAdvance.inventoryAdjustments.list.columnChange')}
                                    </TableHead>
                                    <TableHead className="whitespace-nowrap text-[var(--text-light)]">
                                        {t('dashboardAdvance.inventoryAdjustments.list.columnFinancial')}
                                    </TableHead>
                                    <TableHead className="w-[60px] text-center text-[var(--text-light)]">
                                        {t('dashboardAdvance.inventoryAdjustments.list.columnAction')}
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {adjustmentRows.length === 0 ? (
                                    <TableEmptyState
                                        colSpan={6}
                                        icon={Package}
                                        message={t('dashboardAdvance.inventoryAdjustments.list.emptyTitle')}
                                        description={t('dashboardAdvance.inventoryAdjustments.list.emptyDescription')}
                                        action={{
                                            label: t('dashboardAdvance.inventoryAdjustments.list.emptyActionLabel'),
                                            onClick: () => setShowCreateModal(true),
                                        }}
                                    />
                                ) : (
                                    Object.entries(groupedAdjustments).map(([dateLabel, rows]) => (
                                        <React.Fragment key={dateLabel}>
                                            <TableRow className="bg-[var(--second-accent)] hover:bg-[var(--second-accent)]">
                                                <TableCell colSpan={5}>
                                                    <div className="flex items-center gap-2 text-sm font-medium whitespace-nowrap text-[var(--subheading)]">
                                                        {dateLabel}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right text-sm font-medium whitespace-nowrap text-[var(--subheading)]">
                                                    {rows.length} {t('dashboardAdvance.inventoryAdjustments.list.groupCountSuffix')}
                                                </TableCell>
                                            </TableRow>

                                            {rows.map((row) => (
                                                <TableRow key={row.id}>
                                                    <TableCell className="whitespace-nowrap">
                                                        <p className="font-bold text-[var(--subheading)]">
                                                            {new Date(row.date).toLocaleTimeString(dateLocale, {
                                                                hour: '2-digit',
                                                                minute: '2-digit',
                                                            })}
                                                        </p>
                                                        <p className="text-xs text-[var(--grey-text)]">
                                                            {new Date(row.date).toLocaleDateString(dateLocale, {
                                                                day: 'numeric',
                                                                month: 'long',
                                                                year: 'numeric',
                                                            })}
                                                        </p>
                                                    </TableCell>
                                                    <TableCell className="max-w-[180px] truncate text-[var(--subheading)]">
                                                        {row.note || '-'}
                                                    </TableCell>
                                                    <TableCell className="whitespace-nowrap">
                                                        <p className="font-bold text-[var(--subheading)]">{row.item.name}</p>
                                                        <p className="text-xs text-[var(--grey-text)]">{row.item.sku}</p>
                                                    </TableCell>
                                                    <TableCell
                                                        className={`font-bold whitespace-nowrap ${row.qty_change > 0 ? 'text-[var(--success)]' : 'text-[var(--danger)]'}`}
                                                    >
                                                        {row.qty_change > 0 ? `+${row.qty_change}` : row.qty_change}
                                                    </TableCell>
                                                    <TableCell
                                                        className={`font-bold whitespace-nowrap ${row.financial_change > 0 ? 'text-[var(--success)]' : 'text-[var(--danger)]'}`}
                                                    >
                                                        {row.financial_change > 0 ? '+' : '-'} Rp.{' '}
                                                        {Math.abs(Number(row.financial_change)).toLocaleString('id-ID')}
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <Button
                                                            ref={(el) => {
                                                                buttonRefs.current[row.id] = el;
                                                            }}
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => toggleMenu(row.id)}
                                                        >
                                                            <MoreVertical className="h-4 w-4 text-[var(--grey-text)]" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </React.Fragment>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                <PaginationBar
                    from={adjustments.from ?? 0}
                    to={adjustments.to ?? 0}
                    total={adjustments.total}
                    itemLabel={t('dashboardAdvance.inventoryAdjustments.list.itemLabel')}
                    links={adjustments.links}
                    perPage={filters.per_page ?? '6'}
                    onPerPageChange={(v) => applyFilters({ per_page: v })}
                />
            </div>

            {activeMenuAdj && (
                <InventoryAdjustmentActionsMenu adjustment={activeMenuAdj} position={menuPosition} onClose={closeMenu} onDelete={handleDelete} />
            )}

            {showCreateModal && (
                <InventoryAdjustmentCreateModal
                    inventoryItems={inventoryItems}
                    branches={branches}
                    defaultBranchId={defaultBranchId}
                    lockBranch={is_branch_manager}
                    onClose={() => setShowCreateModal(false)}
                />
            )}
            {confirmDialog}
        </DashboardSidebarLayout>
    );
}
