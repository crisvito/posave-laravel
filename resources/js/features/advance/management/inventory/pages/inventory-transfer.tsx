import {
    Button,
    CreateButton,
    DateNavigator,
    FilterDropdown,
    PaginationBar,
    PrintButton,
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
import { useConfirmAction, useFilters } from '@/hooks';
import { DashboardSidebarLayout } from '@/layouts';
import { Head, router } from '@inertiajs/react';
import { AlertCircle, Check, Package, X as XIcon } from 'lucide-react';
import { useState } from 'react';

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
    branches: BranchOption[];
    my_branch_id: number | null;
    incoming_pending_count: number;
    is_branch_manager: boolean;
    filters: { date?: string; status?: string; search?: string; per_page?: string; view?: string };
}

const statusLabel: Record<string, { text: string; className: string }> = {
    waiting: { text: 'Menunggu', className: 'bg-[var(--warning-background)] text-[var(--warning)]' },
    success: { text: 'Diterima', className: 'bg-[var(--success-background)] text-[var(--success)]' },
    rejected: { text: 'Ditolak', className: 'bg-[var(--danger-background)] text-[var(--danger)]' },
};

const STATUS_OPTIONS = [
    { value: 'waiting', label: 'Menunggu' },
    { value: 'success', label: 'Diterima' },
    { value: 'rejected', label: 'Ditolak' },
];

export default function InventoryTransferList({
    transfers,
    inventoryItems,
    branches,
    my_branch_id,
    incoming_pending_count,
    is_branch_manager,
    filters,
}: InventoryTransferListProps) {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [rejectTarget, setRejectTarget] = useState<Transfer | null>(null);

    const { search, setSearch, applyFilters, handleSearch } = useFilters('dashboard.inventory.transfers.index', filters);
    const { confirmAndDelete, confirmAndRun, confirmDialog } = useConfirmAction();

    const currentDate = filters.date ?? new Date().toISOString().slice(0, 10);
    const showingIncomingTab = filters.view === 'incoming';

    const handleAccept = (transfer: Transfer) => {
        confirmAndRun(
            `Terima kiriman ${transfer.transfer_number}? Stok akan langsung dipindahkan.`,
            () => router.patch(route('dashboard.inventory.transfers.accept', transfer.id)),
            'default',
        );
    };

    const handleCancel = (transfer: Transfer) => {
        confirmAndDelete(`Batalkan permintaan kiriman ${transfer.transfer_number}?`, route('dashboard.inventory.transfers.destroy', transfer.id));
    };

    const paginationProps = {
        from: transfers.from ?? 0,
        to: transfers.to ?? 0,
        total: transfers.total,
        itemLabel: 'Kiriman',
        links: transfers.links,
        perPage: filters.per_page ?? '6',
        onPerPageChange: (v: string) => applyFilters({ per_page: v }),
    };

    return (
        <DashboardSidebarLayout title="Kiriman" description="Kelola pengiriman barang antar cabang anda">
            <Head title="Kiriman" />
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[var(--page-bg)] p-4 sm:p-6">
                {incoming_pending_count > 0 && !showingIncomingTab && (
                    <Button
                        onClick={() => applyFilters({ view: 'incoming', status: undefined })}
                        className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-xl border-2 border-amber-400 bg-amber-50 px-4 py-3 text-left transition hover:bg-amber-100 dark:border-amber-700 dark:bg-amber-900/30 dark:hover:bg-amber-900/50"
                    >
                        <span className="flex items-center gap-2 text-sm font-semibold text-amber-800 dark:text-amber-400">
                            <AlertCircle className="h-5 w-5 shrink-0" />
                            {incoming_pending_count} kiriman menunggu konfirmasi kamu
                        </span>
                        <span className="text-xs font-medium whitespace-nowrap text-amber-700 underline dark:text-amber-300">Lihat</span>
                    </Button>
                )}

                {showingIncomingTab && (
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-[var(--second-accent)] px-4 py-2.5">
                        <span className="text-sm font-medium text-[var(--subheading)]">Menampilkan: Perlu Konfirmasi Saya</span>
                        <Button
                            onClick={() => applyFilters({ view: undefined })}
                            className="text-xs font-medium whitespace-nowrap text-[var(--secondary-700)] hover:underline"
                        >
                            Lihat Semua
                        </Button>
                    </div>
                )}

                <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
                    <DateNavigator date={currentDate} onChange={(date) => applyFilters({ date })} variant="default" size="sm" />

                    <div className="flex items-center gap-3">
                        <CreateButton label="Buat Kiriman" onClick={() => setShowCreateModal(true)} />
                        <PrintButton />
                    </div>
                </div>

                <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
                    <SearchInput value={search} onChange={setSearch} onSubmit={handleSearch} placeholder="Cari nomor kiriman..." />

                    <FilterDropdown
                        value={filters.status}
                        options={STATUS_OPTIONS}
                        allLabel="Semua Status"
                        onChange={(v) => applyFilters({ status: v })}
                    />
                </div>

                <div className="overflow-hidden rounded-2xl border border-[var(--border-strong)] bg-[var(--card)] shadow-sm">
                    <div className="overflow-x-auto">
                        <Table className="min-w-[860px]">
                            <TableHeader className="bg-[var(--surface-header)]">
                                <TableRow className="border-none hover:bg-[var(--surface-header)]">
                                    <TableHead className="text-[var(--text-light)]">Tanggal</TableHead>
                                    <TableHead className="text-[var(--text-light)]">Pengirim</TableHead>
                                    <TableHead className="text-[var(--text-light)]">Penerima</TableHead>
                                    <TableHead className="text-[var(--text-light)]">Nomor Kiriman</TableHead>
                                    <TableHead className="text-[var(--text-light)]">Barang</TableHead>
                                    <TableHead className="text-[var(--text-light)]">Status</TableHead>
                                    <TableHead className="text-[var(--text-light)]">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {transfers.data.length === 0 ? (
                                    <TableEmptyState
                                        colSpan={7}
                                        icon={Package}
                                        message="Belum ada kiriman"
                                        description="Klik tombol Untuk Buat Kiriman"
                                        action={{ label: '+ Buat Kiriman', onClick: () => setShowCreateModal(true) }}
                                    />
                                ) : (
                                    transfers.data.map((transfer) => {
                                        const iAmApproverWaiting = transfer.approver_branch_id === my_branch_id && transfer.status === 'waiting';
                                        const iAmInvolvedWaiting =
                                            (transfer.sender_branch.id === my_branch_id || transfer.receiver_branch.id === my_branch_id) &&
                                            transfer.status === 'waiting';

                                        return (
                                            <TableRow key={transfer.id} className={iAmApproverWaiting ? 'bg-amber-50/50 dark:bg-amber-900/20' : ''}>
                                                <TableCell>
                                                    <div className="text-xs whitespace-nowrap text-[var(--grey-text)]">
                                                        {new Date(transfer.date).toLocaleDateString('id-ID', {
                                                            day: 'numeric',
                                                            month: 'long',
                                                            year: 'numeric',
                                                        })}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="whitespace-nowrap">{transfer.sender_branch.name}</TableCell>
                                                <TableCell className="whitespace-nowrap">{transfer.receiver_branch.name}</TableCell>
                                                <TableCell className="whitespace-nowrap">#{transfer.transfer_number}</TableCell>
                                                <TableCell className="whitespace-nowrap">{transfer.items_count} barang</TableCell>
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
                                                                <button
                                                                    aria-label={`Terima kiriman ${transfer.transfer_number}`}
                                                                    onClick={() => handleAccept(transfer)}
                                                                    className="flex shrink-0 items-center gap-1 rounded-lg bg-green-600 px-2.5 py-1.5 text-xs font-semibold whitespace-nowrap text-white hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
                                                                >
                                                                    <Check className="h-3.5 w-3.5" /> Terima
                                                                </button>
                                                                <button
                                                                    aria-label={`Tolak kiriman ${transfer.transfer_number}`}
                                                                    onClick={() => setRejectTarget(transfer)}
                                                                    className="flex shrink-0 items-center gap-1 rounded-lg bg-red-100 px-2.5 py-1.5 text-xs font-semibold whitespace-nowrap text-red-600 hover:bg-red-200 dark:bg-red-900/40 dark:text-red-400 dark:hover:bg-red-900/60"
                                                                >
                                                                    <XIcon className="h-3.5 w-3.5" /> Tolak
                                                                </button>
                                                            </>
                                                        )}
                                                        {iAmInvolvedWaiting && (
                                                            <button
                                                                aria-label={`Batalkan kiriman ${transfer.transfer_number}`}
                                                                onClick={() => handleCancel(transfer)}
                                                                className="rounded-lg border border-[var(--border-strong)] px-2.5 py-1.5 text-xs font-medium whitespace-nowrap text-[var(--grey-text)] hover:bg-[var(--second-accent)]"
                                                            >
                                                                Batalkan
                                                            </button>
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
