import type { ReactNode } from 'react';

interface ListToolbarProps {
    /** Selector konteks/scope (misal cabang) — baris 1. */
    branch?: ReactNode;
    /** Baris 2, sejajar sama tombol aksi. */
    search: ReactNode;
    /** Kumpulan FilterDropdown — baris 3, bisa lebih dari 1 (bungkus pakai fragment <>...</>). */
    filters?: ReactNode;
    /** Tombol aksi utama halaman (misal "Tambah Barang") — sejajar sama search di baris 2. */
    action?: ReactNode;
}

export function ListToolbar({ branch, search, filters, action }: ListToolbarProps) {
    return (
        <div className="mb-5 flex flex-col gap-3">
            {branch && <div className="flex gap-3">{branch}</div>}

            <div className="flex items-center justify-between gap-3">
                <div className="max-w-xs flex-1">{search}</div>
                {action && <div className="flex shrink-0 items-center gap-3">{action}</div>}
            </div>

            {filters && <div className="flex flex-wrap items-center gap-3">{filters}</div>}
        </div>
    );
}
