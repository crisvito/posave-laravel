import { Button, Input, Label } from '@/components';
import { DashboardSidebarLayout } from '@/layouts';
import { Head, Link, useForm } from '@inertiajs/react';
import { ChevronLeft } from 'lucide-react';
import React from 'react';

interface Branch {
    id: number;
    name: string;
}

interface EmployeeCreateProps {
    roles: string[];
    branches: Branch[];
}

export default function EmployeeCreate({ roles, branches }: EmployeeCreateProps) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        role: '',
        branch_id: '',
        active_date: '',
        slot_status: 'available',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('dashboard.employees.store'));
    };

    const selectClass =
        'border-input focus-visible:ring-ring w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:ring-1 focus-visible:outline-none';

    return (
        <DashboardSidebarLayout title="Tambah Karyawan" description="Masukkan data karyawan baru ke dalam sistem">
            <Head title="Tambah Karyawan" />

            <div className="min-h-screen bg-[var(--page-bg)] p-4 sm:p-6">
                <div className="mb-5 flex items-center gap-4">
                    <Link href={route('dashboard.employees.index')}>
                        <Button variant="outline" size="icon" className="h-10 w-10 shrink-0 bg-[var(--neutral-white)]">
                            <ChevronLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <h2 className="text-xl font-bold text-[var(--subheading)]">Form Karyawan Baru</h2>
                </div>

                <div className="max-w-2xl rounded-2xl border border-[var(--border-strong)] bg-[var(--neutral-white)] p-4 shadow-sm sm:p-6">
                    <form onSubmit={submit} className="flex flex-col gap-5">
                        <div>
                            <Label htmlFor="emp-name">Nama Karyawan</Label>
                            <Input
                                id="emp-name"
                                type="text"
                                aria-label="Nama karyawan"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="Masukkan nama lengkap"
                            />
                            {errors.name && <span className="text-sm text-red-500">{errors.name}</span>}
                        </div>

                        <div>
                            <Label htmlFor="emp-email">Email</Label>
                            <Input
                                id="emp-email"
                                type="email"
                                aria-label="Email karyawan"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="email@perusahaan.com"
                            />
                            {errors.email && <span className="text-sm text-red-500">{errors.email}</span>}
                        </div>

                        <div>
                            <Label htmlFor="emp-role">Role</Label>
                            <select
                                id="emp-role"
                                aria-label="Role karyawan"
                                className={selectClass}
                                value={data.role}
                                onChange={(e) => setData('role', e.target.value)}
                            >
                                <option value="" disabled>
                                    Pilih Role
                                </option>
                                {roles.map((role) => (
                                    <option key={role} value={role}>
                                        {role}
                                    </option>
                                ))}
                            </select>
                            {errors.role && <span className="text-sm text-red-500">{errors.role}</span>}
                        </div>

                        <div>
                            <label htmlFor="emp-branch" className="mb-1.5 block text-sm font-medium text-[var(--subheading)]">
                                Cabang
                            </label>
                            <select
                                id="emp-branch"
                                aria-label="Cabang karyawan"
                                className={selectClass}
                                value={data.branch_id}
                                onChange={(e) => setData('branch_id', e.target.value)}
                            >
                                <option value="" disabled>
                                    Pilih Cabang
                                </option>
                                {branches.map((branch) => (
                                    <option key={branch.id} value={branch.id}>
                                        {branch.name}
                                    </option>
                                ))}
                            </select>
                            {errors.branch_id && <span className="text-sm text-red-500">{errors.branch_id}</span>}
                        </div>

                        <div>
                            <label htmlFor="emp-date" className="mb-1.5 block text-sm font-medium text-[var(--subheading)]">
                                Tanggal Aktif
                            </label>
                            <Input
                                id="emp-date"
                                type="date"
                                aria-label="Tanggal aktif karyawan"
                                value={data.active_date}
                                onChange={(e) => setData('active_date', e.target.value)}
                            />
                            {errors.active_date && <span className="text-sm text-red-500">{errors.active_date}</span>}
                        </div>

                        <div>
                            <label htmlFor="emp-slot" className="mb-1.5 block text-sm font-medium text-[var(--subheading)]">
                                Slot Status
                            </label>
                            <select
                                id="emp-slot"
                                aria-label="Slot status karyawan"
                                className={selectClass}
                                value={data.slot_status}
                                onChange={(e) => setData('slot_status', e.target.value)}
                            >
                                <option value="available">Tersedia</option>
                                <option value="on_shift">Bertugas</option>
                                <option value="off">Libur</option>
                            </select>
                        </div>

                        <div className="mt-4 flex justify-end">
                            <Button type="submit" aria-label="Simpan karyawan" disabled={processing} className="w-full sm:w-auto">
                                {processing ? 'Menyimpan...' : 'Simpan Karyawan'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </DashboardSidebarLayout>
    );
}
