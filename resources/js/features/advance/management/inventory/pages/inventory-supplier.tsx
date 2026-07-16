import {
    CreateButton,
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
import { useConfirmAction, useFilters } from '@/hooks';
import { DashboardSidebarLayout } from '@/layouts';
import { Head } from '@inertiajs/react';
import { Building2, Package } from 'lucide-react';
import { useState } from 'react';

interface Supplier {
    id: number;
    name: string;
    category_id: number | null;
    category: { id: number; name: string; color: string | null } | null;
    address: string | null;
    phone: string | null;
    email: string | null;
    logo: string | null;
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
    filters: { search?: string; per_page?: string };
}

export default function InventorySupplierList({ suppliers, categories, is_branch_manager, filters }: InventorySupplierListProps) {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editSupplier, setEditSupplier] = useState<Supplier | null>(null);
    const { search, setSearch, applyFilters, handleSearch } = useFilters('dashboard.inventory.suppliers.index', filters);
    const { confirmAndDelete } = useConfirmAction();

    const canManageCatalog = !is_branch_manager;

    const handleDelete = (supplier: Supplier) => {
        confirmAndDelete(`Hapus pemasok "${supplier.name}"?`, route('dashboard.inventory.suppliers.destroy', supplier.id));
    };

    return (
        <DashboardSidebarLayout title="Pemasok" description="Kelola daftar pemasok barang anda">
            <Head title="Pemasok" />
            <div className="min-h-screen bg-[var(--page-bg)] p-4 sm:p-6">
                <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
                    <SearchInput value={search} onChange={setSearch} onSubmit={handleSearch} placeholder="Cari nama pemasok..." />

                    {canManageCatalog && <CreateButton label="Buat Pemasok" onClick={() => setShowCreateModal(true)} />}
                </div>

                <div className="overflow-hidden rounded-2xl border border-[var(--border-strong)] bg-[var(--card)] shadow-sm">
                    <div className="overflow-x-auto">
                        <Table className="min-w-[560px]">
                            <TableHeader className="bg-[var(--surface-header)]">
                                <TableRow className="border-none hover:bg-[var(--surface-header)]">
                                    <TableHead className="text-[var(--text-light)]">Nama Pemasok</TableHead>
                                    <TableHead className="text-[var(--text-light)]">Kategori</TableHead>
                                    <TableHead className="text-[var(--text-light)]">Kontak</TableHead>
                                    {canManageCatalog && <TableHead className="w-[80px] text-[var(--text-light)]">Aksi</TableHead>}
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {suppliers.data.length === 0 ? (
                                    <TableEmptyState
                                        colSpan={7}
                                        icon={Package}
                                        message="Belum ada Pemasok"
                                        description="Klik tombol Untuk Buat Pemasok"
                                        action={{ label: '+ Buat Pemasok', onClick: () => setShowCreateModal(true) }}
                                    />
                                ) : (
                                    suppliers.data.map((supplier) => (
                                        <TableRow key={supplier.id}>
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
                                                            color: supplier.category.color ?? '#64748b',
                                                        }}
                                                    >
                                                        {supplier.category.name}
                                                    </span>
                                                ) : (
                                                    <span className="text-xs text-[var(--grey-text)]">-</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-[var(--grey-text)]">
                                                <div className="text-sm whitespace-nowrap">{supplier.phone ?? '-'}</div>
                                                <div className="text-xs whitespace-nowrap">{supplier.email ?? '-'}</div>
                                            </TableCell>
                                            {canManageCatalog && (
                                                <TableCell>
                                                    <div className="flex gap-2 whitespace-nowrap">
                                                        <button
                                                            aria-label={`Ubah pemasok ${supplier.name}`}
                                                            onClick={() => setEditSupplier(supplier)}
                                                            className="text-xs font-medium text-[var(--secondary-600)] hover:underline"
                                                        >
                                                            Ubah
                                                        </button>
                                                        <button
                                                            aria-label={`Hapus pemasok ${supplier.name}`}
                                                            onClick={() => handleDelete(supplier)}
                                                            className="text-xs font-medium text-[var(--danger)] hover:underline"
                                                        >
                                                            Hapus
                                                        </button>
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
                    itemLabel="Pemasok"
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
        </DashboardSidebarLayout>
    );
}
