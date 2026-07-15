import { Button, FilterDropdown, PaginationBar, Table, TableBody, TableCell, TableEmptyState, TableHead, TableHeader, TableRow } from '@/components';
import { EmployeeActionsMenu, EmployeeDetailModal, EmployeeEditModal, type Employee } from '@/features/advance/management/employee/components';
import { useConfirmAction, useDropdownMenu } from '@/hooks';
import { DashboardSidebarLayout } from '@/layouts';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { MoreVertical, Plus, Printer, Store } from 'lucide-react';
import React, { useState } from 'react';

interface Branch {
    id: number;
    name: string;
}

interface EmployeeListProps {
    employees: {
        data: Employee[];
        total: number;
        from: number;
        to: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    branches: Branch[];
    filters: {
        branch?: string;
        per_page?: string;
    };
    is_branch_manager: boolean;
}

export default function EmployeeList({ employees, branches, filters, is_branch_manager }: EmployeeListProps) {
    const [detailEmployee, setDetailEmployee] = useState<Employee | null>(null);
    const [editEmployee, setEditEmployee] = useState<Employee | null>(null);
    const { openId: openMenuId, position: menuPosition, buttonRefs, toggleMenu, closeMenu } = useDropdownMenu();
    const editForm = useForm({
        name: '',
        role: '',
        branch_id: '' as string | number,
        active_date: '',
        slot_status: '',
    });
    const { confirmAndDelete, confirmDialog } = useConfirmAction();

    const applyFilters = (overrides: Record<string, string | undefined>) => {
        router.get(route('dashboard.employees.index'), { ...filters, ...overrides }, { preserveState: true, preserveScroll: true, replace: true });
    };

    const handleShowDetail = (employee: Employee) => {
        setDetailEmployee(employee);
        closeMenu();
    };

    const handleShowEdit = (employee: Employee) => {
        setEditEmployee(employee);
        editForm.setData({
            name: employee.name,
            role: employee.role,
            branch_id: employee.branch_id ?? '',
            active_date: employee.active_date,
            slot_status: employee.slot_status,
        });
        closeMenu();
    };

    const handleCloseEdit = () => {
        setEditEmployee(null);
        editForm.reset();
    };

    const handleSubmitEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editEmployee) return;
        editForm.put(route('dashboard.employees.update', editEmployee.id), { onSuccess: handleCloseEdit });
    };

    const handleDelete = (id: number) => {
        confirmAndDelete('Yakin ingin menghapus karyawan ini? Akun login karyawan juga akan terhapus.', route('dashboard.employees.destroy', id));
        closeMenu();
    };

    const activeMenuEmployee = employees.data.find((e) => e.id === openMenuId);
    const canManage = (employee: Employee) => !is_branch_manager || employee.role === 'cashier';

    return (
        <DashboardSidebarLayout title="Daftar Karyawan" description="Kelola semua daftar karyawan anda">
            <Head title="Daftar Karyawan" />
            <div className="min-h-screen bg-[var(--page-bg)] p-4 sm:p-6 dark:bg-[var(--background)]">
                <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
                    {!is_branch_manager ? (
                        <FilterDropdown
                            value={filters.branch}
                            options={branches.map((b) => ({ value: String(b.id), label: b.name }))}
                            allLabel="Semua Cabang"
                            onChange={(v) => applyFilters({ branch: v })}
                        />
                    ) : (
                        <div className="flex shrink-0 items-center gap-2 rounded-lg bg-[var(--second-accent)] px-3 py-2 text-sm font-medium text-[var(--subheading)] dark:bg-[var(--card)] dark:text-white">
                            <Store className="h-4 w-4" />
                            {branches[0]?.name ?? 'Cabang Anda'}
                        </div>
                    )}

                    <div className="flex flex-wrap items-center gap-3">
                        <span className="rounded-lg bg-[var(--surface-badge)] px-4 py-2 text-sm font-medium text-[var(--subheading)] dark:bg-[var(--card)] dark:text-white">
                            Karyawan : {employees.total}
                        </span>
                        {!is_branch_manager && (
                            <Link href={route('dashboard.employees.create')}>
                                {/* Warna Tombol Gelap */}
                                <Button className="bg-[var(--surface-header)] hover:bg-[var(--surface-header-hover)]">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Tambah Karyawan
                                </Button>
                            </Link>
                        )}
                        <Button
                            variant="outline"
                            className="bg-[var(--neutral-white)] dark:border-[var(--border-strong)] dark:bg-[var(--card)] dark:text-white dark:hover:bg-[var(--border-strong)]"
                        >
                            <Printer className="mr-2 h-4 w-4" />
                            Cetak
                        </Button>
                    </div>
                </div>

                <div className="overflow-hidden rounded-2xl border border-[var(--border-strong)] bg-[var(--neutral-white)] shadow-sm dark:border-[var(--border-strong)] dark:bg-[var(--card)]">
                    <div className="overflow-x-auto">
                        <Table className="min-w-[900px]">
                            <TableHeader className="bg-[var(--surface-header)]">
                                <TableRow className="border-none hover:bg-[var(--surface-header)]">
                                    <TableHead className="text-white">Nama Karyawan</TableHead>
                                    <TableHead className="text-white">Email</TableHead>
                                    <TableHead className="text-white">Role</TableHead>
                                    <TableHead className="text-white">Cabang</TableHead>
                                    <TableHead className="text-white">Tanggal Aktif</TableHead>
                                    <TableHead className="text-white">Slot Status</TableHead>
                                    <TableHead className="w-[60px] text-white">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {employees.data.length === 0 ? (
                                    <TableEmptyState colSpan={7} message="Belum ada karyawan, tambah karyawan terlebih dahulu" />
                                ) : (
                                    employees.data.map((employee) => (
                                        <TableRow
                                            key={employee.id}
                                            className={`${employee.role === 'branch_manager' ? 'bg-blue-50 dark:bg-blue-950/20' : ''} dark:border-[var(--border-strong)]`}
                                        >
                                            {/* Teks Putih untuk semua cell */}
                                            <TableCell className="font-medium text-[var(--subheading)] dark:text-white">{employee.name}</TableCell>
                                            <TableCell className="text-[var(--subheading)] dark:text-white">{employee.user?.email ?? '-'}</TableCell>
                                            <TableCell>
                                                <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
                                                    {employee.role}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-[var(--subheading)] dark:text-white">{employee.branch?.name ?? '-'}</TableCell>
                                            <TableCell className="text-[var(--subheading)] dark:text-white">{employee.active_date}</TableCell>
                                            <TableCell>
                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                                                        employee.slot_status === 'on_shift'
                                                            ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                                                            : employee.slot_status === 'off'
                                                              ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400'
                                                              : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
                                                    }`}
                                                >
                                                    {employee.slot_status === 'on_shift'
                                                        ? 'Bertugas'
                                                        : employee.slot_status === 'off'
                                                          ? 'Libur'
                                                          : 'Tersedia'}
                                                </span>
                                            </TableCell>
                                            <TableCell className="relative">
                                                {canManage(employee) ? (
                                                    <Button
                                                        ref={(el) => {
                                                            buttonRefs.current[employee.id] = el;
                                                        }}
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => toggleMenu(employee.id)}
                                                        className="dark:text-white dark:hover:bg-[var(--border-strong)]"
                                                    >
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleShowDetail(employee)}
                                                        className="text-xs font-medium text-[var(--surface-header)] hover:underline dark:text-white"
                                                    >
                                                        Lihat
                                                    </button>
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
                    from={employees.from ?? 0}
                    to={employees.to ?? 0}
                    total={employees.total}
                    itemLabel="Karyawan"
                    links={employees.links}
                    perPage={filters.per_page ?? '5'}
                    onPerPageChange={(v) => applyFilters({ per_page: v })}
                />
            </div>
            {/* ...sisanya tetap sama */}
            {activeMenuEmployee && (
                <EmployeeActionsMenu
                    employee={activeMenuEmployee}
                    position={menuPosition}
                    onClose={closeMenu}
                    onView={handleShowDetail}
                    onEdit={handleShowEdit}
                    onDelete={handleDelete}
                />
            )}
            {detailEmployee && <EmployeeDetailModal employee={detailEmployee} onClose={() => setDetailEmployee(null)} />}
            {editEmployee && (
                <EmployeeEditModal
                    form={editForm}
                    branches={branches}
                    is_branch_manager={is_branch_manager}
                    onSubmit={handleSubmitEdit}
                    onClose={handleCloseEdit}
                />
            )}
            {confirmDialog}
        </DashboardSidebarLayout>
    );
}
