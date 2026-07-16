import { Button, CategoryColorPicker, Input, Label } from '@/components';
import { useForm } from '@inertiajs/react';
import { X } from 'lucide-react';
import React from 'react';

interface InventoryCategoryCreateModalProps {
    onClose: () => void;
}

export function InventoryCategoryCreateModal({ onClose }: InventoryCategoryCreateModalProps) {
    const { data, setData, post, processing, errors, reset } = useForm<{ name: string; color: string | null }>({
        name: '',
        color: null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('dashboard.inventory.categories.store'), {
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
                    <h3 className="text-lg font-bold text-[var(--subheading)]">Buat Kategori Baru</h3>
                    <button aria-label="Tutup modal buat kategori" onClick={handleClose}>
                        <X className="h-5 w-5 text-[var(--grey-text)] hover:text-[var(--subheading)] dark:hover:text-white" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <Label className="mb-1.5 block text-sm font-medium text-[var(--subheading)]">Nama Kategori</Label>
                        <Input
                            aria-label="Nama kategori"
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Contoh: Sembako, Minuman..."
                        />
                        {errors.name && <span className="text-sm text-red-500">{errors.name}</span>}
                    </div>

                    <CategoryColorPicker value={data.color} onChange={(color) => setData('color', color)} allowAuto />
                    {errors.color && <span className="text-sm text-red-500">{errors.color}</span>}

                    <div className="mt-2 flex justify-end gap-2">
                        <Button
                            aria-label="Batal buat kategori"
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            className="bg-transparent dark:text-white"
                        >
                            Batal
                        </Button>
                        <Button
                            aria-label="Simpan kategori baru"
                            type="submit"
                            disabled={processing}
                            className="bg-[var(--surface-header)] text-[var(--text-light)] hover:bg-[var(--surface-header-hover)] dark:bg-white dark:text-black dark:hover:bg-gray-200"
                        >
                            {processing ? 'Menyimpan...' : 'Buat Kategori'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
