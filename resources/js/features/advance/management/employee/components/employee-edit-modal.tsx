import { Button } from '@/components/ui';
import type { InertiaFormProps } from '@inertiajs/react';
import { X } from 'lucide-react';

interface Branch {
    id: number;
    name: string;
}

type EditFormData = {
    name: string;
    role: string;
    branch_id: string | number;
    active_date: string;
    slot_status: string;
    [key: string]: string | number;
};
interface EmployeeEditModalProps {
    form: InertiaFormProps<EditFormData>;
    branches: Branch[];
    is_branch_manager: boolean;
    onSubmit: (e: React.FormEvent) => void;
    onClose: () => void;
}

export function EmployeeEditModal({ form, branches, is_branch_manager, onSubmit, onClose }: EmployeeEditModalProps) {
    const { data, setData, errors, processing } = form;

    const selectClass =
        'w-full rounded-lg border border-[var(--border-strong)] bg-transparent px-3.5 py-2.5 text-sm text-[var(--subheading)] outline-none focus:ring-1 focus:ring-ring';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-md rounded-2xl bg-[var(--neutral-white)] p-6 shadow-xl">
                <div className="mb-5 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-[var(--subheading)]">Ubah Data Karyawan</h3>
                    <button onClick={onClose} aria-label="Tutup">
                        <X className="h-5 w-5 text-[var(--grey-text)] hover:text-[var(--subheading)]" />
                    </button>
                </div>

                <form onSubmit={onSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-[var(--subheading)]">Nama Karyawan</label>
                        <input
                            aria-label="Nama karyawan"
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className={selectClass}
                        />
                        {errors.name && <span className="text-sm text-red-500">{errors.name}</span>}
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-[var(--subheading)]">Role</label>
                        {is_branch_manager ? (
                            // Branch manager cuma boleh edit cashier — role gak bisa diubah, biar gak "naikin" jadi role lain.
                            <div className={`${selectClass} flex items-center bg-[var(--second-accent)] capitalize`}>{data.role}</div>
                        ) : (
                            <select
                                aria-label="Pilih role"
                                value={data.role}
                                onChange={(e) => setData('role', e.target.value)}
                                className={selectClass}
                            >
                                <option value="cashier">Cashier</option>
                                <option value="branch_manager">Branch Manager</option>
                            </select>
                        )}
                        {errors.role && <span className="text-sm text-red-500">{errors.role}</span>}
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-[var(--subheading)]">Cabang</label>
                        {is_branch_manager ? (
                            // Branch manager: cabang terkunci, otomatis cabangnya sendiri.
                            <div className={`${selectClass} flex items-center bg-[var(--second-accent)]`}>
                                {branches.find((b) => b.id === Number(data.branch_id))?.name ?? branches[0]?.name ?? '-'}
                            </div>
                        ) : (
                            <select
                                aria-label="Pilih cabang"
                                value={data.branch_id}
                                onChange={(e) => setData('branch_id', e.target.value)}
                                className={selectClass}
                            >
                                <option value="" disabled>
                                    Pilih cabang
                                </option>
                                {branches.map((b) => (
                                    <option key={b.id} value={b.id}>
                                        {b.name}
                                    </option>
                                ))}
                            </select>
                        )}
                        {errors.branch_id && <span className="text-sm text-red-500">{errors.branch_id}</span>}
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-[var(--subheading)]">Tanggal Aktif</label>
                        <input
                            aria-label="Tanggal aktif"
                            type="date"
                            value={data.active_date}
                            onChange={(e) => setData('active_date', e.target.value)}
                            className={selectClass}
                        />
                        {errors.active_date && <span className="text-sm text-red-500">{errors.active_date}</span>}
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-[var(--subheading)]">Slot Status</label>
                        <select
                            aria-label="Pilih slot status"
                            value={data.slot_status}
                            onChange={(e) => setData('slot_status', e.target.value)}
                            className={selectClass}
                        >
                            <option value="available">Tersedia</option>
                            <option value="on_shift">Bertugas</option>
                            <option value="off">Libur</option>
                        </select>
                    </div>

                    <div className="mt-2 flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Batal
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
