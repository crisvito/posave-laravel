import { Button, CATEGORY_COLOR_SWATCHES, CategoryColorPicker } from '@/components';
import { useForm } from '@inertiajs/react';
import { X } from 'lucide-react';
import React from 'react';
import type { InventoryCategory } from '.';

interface InventoryCategoryEditModalProps {
    category: InventoryCategory;
    onClose: () => void;
}

export function InventoryCategoryEditModal({ category, onClose }: InventoryCategoryEditModalProps) {
    const { data, setData, put, processing, errors, reset } = useForm({
        name: category.name,
        color: category.color ?? CATEGORY_COLOR_SWATCHES[0],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('dashboard.inventory.categories.update', category.id), {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-md rounded-2xl bg-[var(--neutral-white)] p-6 shadow-xl dark:border dark:border-[var(--border-strong)] dark:bg-[var(--card)]">
                <div className="mb-5 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-[var(--subheading)]">Ubah Kategori</h3>
                    <button aria-label="Tutup modal ubah kategori" onClick={handleClose}>
                        <X className="h-5 w-5 text-[var(--grey-text)] hover:text-[var(--subheading)] dark:hover:text-white" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-[var(--subheading)]">Nama Kategori</label>
                        <input
                            aria-label="Nama kategori"
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="border-input focus-visible:ring-ring w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:ring-1 focus-visible:outline-none dark:border-[var(--border-strong)] dark:text-white dark:focus-visible:ring-[var(--ring)]"
                        />
                        {errors.name && <span className="text-sm text-red-500">{errors.name}</span>}
                    </div>

                    <CategoryColorPicker value={data.color} onChange={(color) => setData('color', color ?? CATEGORY_COLOR_SWATCHES[0])} />
                    {errors.color && <span className="text-sm text-red-500">{errors.color}</span>}

                    <div className="mt-2 flex justify-end gap-2">
                        <Button
                            aria-label="Batal ubah kategori"
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            className="bg-transparent dark:text-white"
                        >
                            Batal
                        </Button>
                        <Button
                            aria-label="Simpan perubahan kategori"
                            type="submit"
                            disabled={processing}
                            className="bg-[var(--surface-header)] text-[var(--text-light)] hover:bg-[var(--surface-header-hover)] dark:bg-white dark:text-black dark:hover:bg-gray-200"
                        >
                            {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
