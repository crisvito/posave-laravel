import {
    Button,
    CountBadge,
    CreateButton,
    DeleteButton,
    EditButton,
    Input,
    Label,
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
import { useConfirmAction, useFilters } from '@/hooks';
import { DashboardSidebarLayout } from '@/layouts';
import { Head, useForm } from '@inertiajs/react';
import { MapPin, Phone } from 'lucide-react';
import { useState } from 'react';

interface Branch {
    id: number;
    name: string;
    address: string | null;
    phone: string | null;
    is_main: boolean;
    status: 'open' | 'closed';
}

interface Props {
    branches: {
        data: Branch[];
        total: number;
        from: number;
        to: number;
        per_page: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    filters: {
        search?: string;
        per_page?: string;
    };
}

type ModalMode = 'add' | 'edit' | null;

export default function BranchesPage({ branches, filters = {} }: Props) {
    const [modal, setModal] = useState<ModalMode>(null);
    const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
    const { search, setSearch, applyFilters, handleSearch } = useFilters('settings.branches', filters);
    const { confirmAndRun } = useConfirmAction();

    const {
        data,
        setData,
        post,
        put,
        delete: destroy,
        processing,
        errors,
        reset,
    } = useForm({
        name: '',
        address: '',
        phone: '',
    });

    const openAdd = () => {
        reset();
        setEditingBranch(null);
        setModal('add');
    };

    const openEdit = (branch: Branch) => {
        setData({ name: branch.name, address: branch.address ?? '', phone: branch.phone ?? '' });
        setEditingBranch(branch);
        setModal('edit');
    };

    const closeModal = () => {
        setModal(null);
        setEditingBranch(null);
        reset();
    };

    const submitAdd = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('settings.branches.store'), { onSuccess: closeModal });
    };

    const submitEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingBranch) return;
        put(route('settings.branches.update', editingBranch.id), { onSuccess: closeModal });
    };

    const handleDelete = (branch: Branch) => {
        confirmAndRun(`Hapus cabang "${branch.name}"? Tindakan ini tidak bisa dibatalkan.`, () =>
            destroy(route('settings.branches.destroy', branch.id)),
        );
    };

    return (
        <DashboardSidebarLayout title="Cabang" description="Kelola seluruh cabang anda">
            <Head title="Kelola Toko" />

            <div className="min-h-screen bg-[var(--page-bg)] p-6 dark:bg-[var(--background)]">
                <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-3">
                        <SearchInput value={search} onChange={setSearch} onSubmit={handleSearch} placeholder="Cari cabang..." />
                    </div>

                    <div className="flex items-center gap-3">
                        <CountBadge label="Cabang" count={branches.total} />
                        <CreateButton label="Buat Cabang" onClick={openAdd} />
                        <PrintButton label="Cetak" />
                    </div>
                </div>

                <div className="overflow-hidden rounded-2xl border border-[var(--border-strong)] bg-[var(--card)] shadow-sm dark:bg-[var(--card)]">
                    <div className="overflow-x-auto">
                        <Table className="min-w-[800px]">
                            <TableHeader className="bg-[var(--surface-header)]">
                                <TableRow className="border-none hover:bg-[var(--surface-header)]">
                                    <TableHead className="text-[var(--text-light)]">Nama Cabang</TableHead>
                                    <TableHead className="text-[var(--text-light)]">Alamat</TableHead>
                                    <TableHead className="text-[var(--text-light)]">Nomor Telepon</TableHead>
                                    <TableHead className="text-[var(--text-light)]">Status</TableHead>
                                    <TableHead className="w-32 text-[var(--text-light)]">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {branches.data.length === 0 ? (
                                    <TableEmptyState
                                        colSpan={5}
                                        message={
                                            filters?.search
                                                ? `Cabang "${filters.search}" tidak ditemukan`
                                                : 'Belum ada cabang, buat cabang terlebih dahulu'
                                        }
                                    />
                                ) : (
                                    branches.data.map((branch) => (
                                        <TableRow key={branch.id} className="dark:border-[var(--border-strong)]">
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-medium text-[var(--subheading)] dark:text-white">
                                                        {branch.name}
                                                    </span>
                                                    {branch.is_main && (
                                                        <span className="rounded-full bg-[var(--surface-header)] px-2 py-0.5 text-xs text-[var(--text-light)]">
                                                            Utama
                                                        </span>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-[var(--grey-text)] dark:text-[var(--muted-foreground)]">
                                                <div className="flex items-start gap-1.5">
                                                    <MapPin
                                                        className="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--grey-text-muted)] dark:text-[var(--muted-foreground)]"
                                                        aria-hidden="true"
                                                    />
                                                    <span>{branch.address || '-'}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-[var(--grey-text)] dark:text-[var(--muted-foreground)]">
                                                <div className="flex items-center gap-1.5">
                                                    <Phone
                                                        className="h-4 w-4 flex-shrink-0 text-[var(--grey-text-muted)] dark:text-[var(--muted-foreground)]"
                                                        aria-hidden="true"
                                                    />
                                                    <span>{branch.phone || '-'}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-medium ${branch.status === 'closed' ? 'bg-red-50 text-red-500 dark:bg-red-900/30 dark:text-red-400' : 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400'}`}
                                                >
                                                    {branch.status === 'closed' ? 'Close' : 'Open'}
                                                </span>
                                            </TableCell>
                                            <TableCell className="relative">
                                                <div className="flex items-center gap-2">
                                                    <EditButton label="edit" onClick={() => openEdit(branch)} />
                                                    {!branch.is_main && <DeleteButton label="hapus" onClick={() => handleDelete(branch)} />}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                <PaginationBar
                    from={branches.from ?? 0}
                    to={branches.to ?? 0}
                    total={branches.total}
                    itemLabel="Cabang"
                    links={branches.links}
                    perPage={filters?.per_page ?? '5'}
                    onPerPageChange={(v) => applyFilters({ per_page: v })}
                />
            </div>

            {modal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    style={{ background: 'rgba(0,0,0,0.5)' }}
                    onClick={(e) => {
                        if (e.target === e.currentTarget) closeModal();
                    }}
                >
                    <div className="w-full max-w-md rounded-2xl bg-[var(--neutral-white)] p-6 shadow-xl dark:border dark:border-[var(--border-strong)] dark:bg-[var(--card)]">
                        <div className="mb-5 flex items-center justify-between">
                            <h2 className="text-base font-medium text-[var(--grey-text)] dark:text-white">
                                {modal === 'add' ? 'Buat Cabang' : 'Edit Cabang'}
                            </h2>
                            <Button aria-label="Tutup modal" onClick={closeModal}>
                                ✕
                            </Button>
                        </div>

                        <form onSubmit={modal === 'add' ? submitAdd : submitEdit}>
                            <div className="mb-4">
                                <Label htmlFor="branch-name">Nama Cabang</Label>
                                <Input
                                    id="branch-name"
                                    type="text"
                                    aria-label="Nama cabang"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="cth. Cabang Selatan"
                                    autoFocus
                                />
                                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                            </div>

                            <div className="mb-4">
                                <Label htmlFor="branch-address">Alamat</Label>
                                <Input
                                    id="branch-address"
                                    type="text"
                                    aria-label="Alamat cabang"
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                    placeholder="Jl. Sudirman No. 10"
                                />
                            </div>

                            <div className="mb-6">
                                <Label htmlFor="branch-phone">Nomor Telepon</Label>
                                <Input
                                    id="branch-phone"
                                    type="text"
                                    aria-label="Nomor telepon cabang"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    placeholder="+62 812 3456 7890"
                                />
                            </div>

                            <div className="flex gap-3">
                                <DeleteButton type="button" label="Batal" onClick={closeModal} />
                                <Button
                                    type="submit"
                                    aria-label={modal === 'add' ? 'Buat cabang baru' : 'Simpan perubahan cabang'}
                                    disabled={processing}
                                >
                                    {processing ? 'Menyimpan...' : modal === 'add' ? 'Buat Cabang' : 'Simpan'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </DashboardSidebarLayout>
    );
}
