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
import { InventoryTransferCreateModal, TransferRejectModal } from '@/features/advance/management/inventory/components';
import { useConfirmAction, useFilters, useLanguage } from '@/hooks';
import { DashboardSidebarLayout } from '@/layouts';
import { Head, router } from '@inertiajs/react';
import { AlertCircle, Check, Package, X as XIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

interface BranchOption {
    id: number;
    name: string;
}
interface InventoryItemOption {
    id: number;
    name: string;
    sku: string;
}

interface Transfer {
    id: number;
    transfer_number: string;
    date: string;
    status: 'waiting' | 'success' | 'rejected';
    rejection_note: string | null;
    items_count: number;
    sender_branch: BranchOption;
    receiver_branch: BranchOption;
    approver_branch_id: number;
    requested_by_branch_id: number | null;
}

interface InventoryTransferListProps {
    transfers: {
        data: Transfer[];
        links: { url: string | null; label: string; active: boolean }[];
        from: number;
        to: number;
        total: number;
    };
    inventoryItems: InventoryItemOption[];
    branchStocks: Record<number, Record<number, number>>;
    branches: BranchOption[];
    my_branch_id: number | null;
    incoming_pending_count: number;
    is_branch_manager: boolean;
    filters: { date?: string; status?: string; search?: string; per_page?: string; view?: string };
}

export default function InventoryTransferList({
    transfers,
    inventoryItems,
    branchStocks,
    branches,
    my_branch_id,
    incoming_pending_count,
    is_branch_manager,
    filters,
}: InventoryTransferListProps) {
    const { locale, t } = useLanguage();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [rejectTarget, setRejectTarget] = useState<Transfer | null>(null);

    const { search, setSearch, applyFilters, handleSearch } = useFilters('dashboard.inventory.transfers.index', filters);
    const { confirmAndDelete, confirmAndRun, confirmDialog } = useConfirmAction();
    const [transferRows, setTransferRows] = useState<Transfer[]>(transfers.data);

    useEffect(() => {
        setTransferRows(transfers.data);
    }, [transfers.data]);

    const currentDate = filters.date ?? new Date().toISOString().slice(0, 10);
    const showingIncomingTab = filters.view === 'incoming';
    const dateLocale = locale === 'en' ? 'en-US' : 'id-ID';

    const statusLabel: Record<string, { text: string; className: string }> = {
        waiting: {
            text: t('dashboardAdvance.inventoryTransfers.list.statusWaiting'),
            className: 'bg-[var(--warning-background)] text-[var(--warning)]',
        },
        success: {
            text: t('dashboardAdvance.inventoryTransfers.list.statusSuccess'),
            className: 'bg-[var(--success-background)] text-[var(--success)]',
        },
        rejected: {
            text: t('dashboardAdvance.inventoryTransfers.list.statusRejected'),
            className: 'bg-[var(--danger-background)] text-[var(--danger)]',
        },
    };

    const STATUS_OPTIONS = [
        { value: 'waiting', label: t('dashboardAdvance.inventoryTransfers.list.statusWaiting') },
        { value: 'success', label: t('dashboardAdvance.inventoryTransfers.list.statusSuccess') },
        { value: 'rejected', label: t('dashboardAdvance.inventoryTransfers.list.statusRejected') },
    ];

    const handleAccept = (transfer: Transfer) => {
        confirmAndRun(
            `${t('dashboardAdvance.inventoryTransfers.list.acceptConfirmPrefix')} ${transfer.transfer_number}${t('dashboardAdvance.inventoryTransfers.list.acceptConfirmSuffix')}`,
            () => router.patch(route('dashboard.inventory.transfers.accept', transfer.id)),
            'default',
        );
    };

    const handleCancel = (transfer: Transfer) => {
        confirmAndDelete(
            `${t('dashboardAdvance.inventoryTransfers.list.cancelConfirmPrefix')} ${transfer.transfer_number}?`,
            route('dashboard.inventory.transfers.destroy', transfer.id),
            {
                onSuccess: () => setTransferRows((prev) => prev.filter((t) => t.id !== transfer.id)),
            },
        );
    };

    const paginationProps = {
        from: transfers.from ?? 0,
        to: transfers.to ?? 0,
        total: transfers.total,
        itemLabel: t('dashboardAdvance.inventoryTransfers.list.itemLabel'),
        links: transfers.links,
        perPage: filters.per_page ?? '6',
        onPerPageChange: (v: string) => applyFilters({ per_page: v }),
    };

    return (
        <DashboardSidebarLayout
            title={t('dashboardAdvance.inventoryTransfers.list.layoutTitle')}
            description={t('dashboardAdvance.inventoryTransfers.list.layoutDescription')}
        >
            <Head title={t('dashboardAdvance.inventoryTransfers.list.headTitle')} />
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[var(--page-bg)] p-4 sm:p-6">
                {incoming_pending_count > 0 && !showingIncomingTab && (
                    <Button
                        onClick={() => applyFilters({ view: 'incoming', status: undefined })}
                        className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-xl border-2 border-[var(--warning)] bg-[var(--warning-background)] px-4 py-3 text-left transition hover:opacity-90"
                    >
                        <span className="flex items-center gap-2 text-sm font-semibold text-[var(--warning)]">
                            <AlertCircle className="h-5 w-5 shrink-0" />
                            {incoming_pending_count} {t('dashboardAdvance.inventoryTransfers.list.pendingBannerSuffix')}
                        </span>
                        <span className="text-xs font-medium whitespace-nowrap text-[var(--warning)] underline">
                            {t('dashboardAdvance.inventoryTransfers.list.viewLabel')}
                        </span>
                    </Button>
                )}

                {showingIncomingTab && (
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-[var(--second-accent)] px-4 py-2.5">
                        <span className="text-sm font-medium text-[var(--subheading)]">
                            {t('dashboardAdvance.inventoryTransfers.list.showingIncomingLabel')}
                        </span>
                        <Button
                            onClick={() => applyFilters({ view: undefined })}
                            className="text-xs font-medium whitespace-nowrap text-[var(--secondary-700)] hover:underline"
                        >
                            {t('dashboardAdvance.inventoryTransfers.list.viewAllLabel')}
                        </Button>
                    </div>
                )}

                <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex gap-3">
                        <DateNavigator date={currentDate} onChange={(date) => applyFilters({ date })} variant="default" size="sm" />
                        <FilterDropdown
                            value={filters.status}
                            options={STATUS_OPTIONS}
                            allLabel={t('dashboardAdvance.inventoryTransfers.list.allStatus')}
                            onChange={(v) => applyFilters({ status: v })}
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <CreateButton label={t('dashboardAdvance.inventoryTransfers.list.createButton')} onClick={() => setShowCreateModal(true)} />
                    </div>
                </div>

                <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
                    <SearchInput
                        value={search}
                        onChange={setSearch}
                        onSubmit={handleSearch}
                        placeholder={t('dashboardAdvance.inventoryTransfers.list.searchPlaceholder')}
                    />
                </div>

                <div className="overflow-hidden rounded-2xl border border-[var(--border-strong)] bg-[var(--card)] shadow-sm">
                    <div className="overflow-x-auto">
                        <Table className="min-w-[860px]">
                            <TableHeader className="bg-[var(--surface-header)]">
                                <TableRow className="border-none hover:bg-[var(--surface-header)]">
                                    <TableHead className="text-[var(--text-light)]">
                                        {t('dashboardAdvance.inventoryTransfers.list.columnDate')}
                                    </TableHead>
                                    <TableHead className="text-[var(--text-light)]">
                                        {t('dashboardAdvance.inventoryTransfers.list.columnSender')}
                                    </TableHead>
                                    <TableHead className="text-[var(--text-light)]">
                                        {t('dashboardAdvance.inventoryTransfers.list.columnReceiver')}
                                    </TableHead>
                                    <TableHead className="text-[var(--text-light)]">
                                        {t('dashboardAdvance.inventoryTransfers.list.columnTransferNumber')}
                                    </TableHead>
                                    <TableHead className="text-[var(--text-light)]">
                                        {t('dashboardAdvance.inventoryTransfers.list.columnItems')}
                                    </TableHead>
                                    <TableHead className="text-[var(--text-light)]">
                                        {t('dashboardAdvance.inventoryTransfers.list.columnStatus')}
                                    </TableHead>
                                    <TableHead className="text-[var(--text-light)]">
                                        {t('dashboardAdvance.inventoryTransfers.list.columnAction')}
                                    </TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {transferRows.length === 0 ? (
                                    <TableEmptyState
                                        colSpan={7}
                                        icon={Package}
                                        message={t('dashboardAdvance.inventoryTransfers.list.emptyTitle')}
                                        description={t('dashboardAdvance.inventoryTransfers.list.emptyDescription')}
                                        action={{
                                            label: t('dashboardAdvance.inventoryTransfers.list.emptyActionLabel'),
                                            onClick: () => setShowCreateModal(true),
                                        }}
                                    />
                                ) : (
                                    transferRows.map((transfer) => {
                                        const iAmApproverWaiting = transfer.approver_branch_id === my_branch_id && transfer.status === 'waiting';
                                        const iAmInvolvedWaiting =
                                            (transfer.sender_branch.id === my_branch_id || transfer.receiver_branch.id === my_branch_id) &&
                                            transfer.status === 'waiting';

                                        return (
                                            <TableRow key={transfer.id} className={iAmApproverWaiting ? 'bg-[var(--warning-background)]/50' : ''}>
                                                <TableCell>
                                                    <div className="text-xs whitespace-nowrap text-[var(--grey-text)]">
                                                        {new Date(transfer.date).toLocaleDateString(dateLocale, {
                                                            day: 'numeric',
                                                            month: 'long',
                                                            year: 'numeric',
                                                        })}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="whitespace-nowrap">{transfer.sender_branch.name}</TableCell>
                                                <TableCell className="whitespace-nowrap">{transfer.receiver_branch.name}</TableCell>
                                                <TableCell className="whitespace-nowrap">#{transfer.transfer_number}</TableCell>
                                                <TableCell className="whitespace-nowrap">
                                                    {transfer.items_count} {t('dashboardAdvance.inventoryTransfers.list.itemsCountSuffix')}
                                                </TableCell>
                                                <TableCell>
                                                    <span
                                                        className={`rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap ${statusLabel[transfer.status].className}`}
                                                    >
                                                        {statusLabel[transfer.status].text}
                                                    </span>
                                                    {transfer.status === 'rejected' && transfer.rejection_note && (
                                                        <p
                                                            className="mt-1 max-w-[180px] truncate text-xs text-[var(--grey-text)]"
                                                            title={transfer.rejection_note}
                                                        >
                                                            "{transfer.rejection_note}"
                                                        </p>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {iAmApproverWaiting && (
                                                            <>
                                                                <Button
                                                                    variant="outline"
                                                                    aria-label={`${t('dashboardAdvance.inventoryTransfers.list.acceptAriaLabelPrefix')} ${transfer.transfer_number}`}
                                                                    onClick={() => handleAccept(transfer)}
                                                                    className="flex shrink-0 items-center gap-1 rounded-lg bg-[var(--success)] px-2.5 py-1.5 text-xs font-semibold whitespace-nowrap text-white hover:opacity-90"
                                                                >
                                                                    <Check className="h-3.5 w-3.5" />{' '}
                                                                    {t('dashboardAdvance.inventoryTransfers.list.acceptLabel')}
                                                                </Button>
                                                                <Button
                                                                    variant="outline"
                                                                    aria-label={`${t('dashboardAdvance.inventoryTransfers.list.rejectAriaLabelPrefix')} ${transfer.transfer_number}`}
                                                                    onClick={() => setRejectTarget(transfer)}
                                                                    className="flex shrink-0 items-center gap-1 rounded-lg bg-[var(--danger-background)] px-2.5 py-1.5 text-xs font-semibold whitespace-nowrap text-[var(--danger)] hover:opacity-90"
                                                                >
                                                                    <XIcon className="h-3.5 w-3.5" />{' '}
                                                                    {t('dashboardAdvance.inventoryTransfers.list.rejectLabel')}
                                                                </Button>
                                                            </>
                                                        )}
                                                        {iAmInvolvedWaiting && (
                                                            <Button
                                                                variant="outline"
                                                                aria-label={`${t('dashboardAdvance.inventoryTransfers.list.cancelAriaLabelPrefix')} ${transfer.transfer_number}`}
                                                                onClick={() => handleCancel(transfer)}
                                                                className="rounded-lg border border-[var(--border-strong)] px-2.5 py-1.5 text-xs font-medium whitespace-nowrap text-[var(--grey-text)] hover:bg-[var(--second-accent)]"
                                                            >
                                                                {t('dashboardAdvance.inventoryTransfers.list.cancelLabel')}
                                                            </Button>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                <PaginationBar {...paginationProps} />
            </div>

            {showCreateModal && (
                <InventoryTransferCreateModal
                    inventoryItems={inventoryItems}
                    branchStocks={branchStocks}
                    branches={branches}
                    myBranchId={my_branch_id}
                    isBranchManager={is_branch_manager}
                    onClose={() => setShowCreateModal(false)}
                />
            )}

            {rejectTarget && (
                <TransferRejectModal
                    transferId={rejectTarget.id}
                    transferNumber={rejectTarget.transfer_number}
                    onClose={() => setRejectTarget(null)}
                />
            )}

            {confirmDialog}
        </DashboardSidebarLayout>
    );
}
