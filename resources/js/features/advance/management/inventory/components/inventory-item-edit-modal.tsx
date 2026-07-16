import { Button, Input, Label } from '@/components';
import { useForm } from '@inertiajs/react';
import { X } from 'lucide-react';
import React, { useState } from 'react';
import type { InventoryCategory } from './inventory-category-actions-menu';
import type { InventoryItem } from './inventory-item-actions-menu';

interface InventoryItemEditModalProps {
    item: InventoryItem;
    categories: InventoryCategory[];
    branches: { id: number; name: string }[];
    selectedBranchId: number | null;
    onClose: () => void;
}

export function InventoryItemEditModal({ item, categories, branches, selectedBranchId, onClose }: InventoryItemEditModalProps) {
    const [preview, setPreview] = useState<string | null>(item.image ? `/storage/${item.image}` : null);

    const { data, setData, post, processing, errors, reset } = useForm<{
        _method: string;
        name: string;
        sku: string;
        category_id: string;
        branch_id: string;
        image: File | null;
        min_stock: string;
        current_stock: string;
        price: string;
    }>({
        _method: 'PUT',
        name: item.name,
        sku: item.sku,
        category_id: String(item.category_id),
        branch_id: selectedBranchId ? String(selectedBranchId) : '',
        image: null,
        min_stock: String(item.min_stock),
        current_stock: String(item.current_stock),
        price: String(item.price),
    });

    const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setData('image', file);
        if (file) setPreview(URL.createObjectURL(file));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('dashboard.inventory.items.update', item.id), {
            forceFormData: true,
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

    const selectedBranchName = branches.find((b) => b.id === selectedBranchId)?.name;

    const inputClass =
        'w-full rounded-lg border border-[var(--border-strong)] bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--ring)] dark:text-white';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-md rounded-2xl bg-[var(--neutral-white)] p-6 shadow-xl dark:border dark:border-[var(--border-strong)] dark:bg-[var(--card)]">
                <div className="mb-5 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-[var(--subheading)] dark:text-white">Ubah Barang</h3>
                    <button aria-label="Tutup modal ubah barang" onClick={handleClose}>
                        <X className="h-5 w-5 text-[var(--grey-text)] hover:text-[var(--subheading)] dark:hover:text-white" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <Label>
                            Gambar <span className="text-[var(--grey-text)]">(opsional)</span>
                        </Label>
                        {preview && <img src={preview} alt="Pratinjau gambar barang" className="mb-2 h-16 w-16 rounded-lg object-cover" />}
                        <input aria-label="Unggah gambar barang" type="file" accept="image/*" onChange={handleImage} className={inputClass} />
                        {errors.image && <span className="text-sm text-red-500">{errors.image}</span>}
                    </div>

                    <div>
                        <Label>Nama Barang</Label>
                        <Input aria-label="Nama barang" type="text" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                        {errors.name && <span className="text-sm text-red-500">{errors.name}</span>}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <Label>SKU</Label>
                            <Input aria-label="SKU barang" type="text" value={data.sku} onChange={(e) => setData('sku', e.target.value)} />
                            {errors.sku && <span className="text-xs text-red-500">{errors.sku}</span>}
                        </div>
                        <div>
                            <Label>Kategori</Label>
                            <select
                                aria-label="Pilih kategori barang"
                                value={data.category_id}
                                onChange={(e) => setData('category_id', e.target.value)}
                                className={`${inputClass} appearance-none`}
                            >
                                <option value="" disabled className="dark:bg-[var(--card)]">
                                    Pilih Kategori
                                </option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id} className="dark:bg-[var(--card)]">
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                            {errors.category_id && <span className="text-xs text-red-500">{errors.category_id}</span>}
                        </div>
                    </div>

                    {selectedBranchId ? (
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <Label>Stok Saat Ini — {selectedBranchName}</Label>
                                <Input
                                    aria-label={`Stok saat ini di cabang ${selectedBranchName ?? ''}`}
                                    type="number"
                                    min="0"
                                    value={data.current_stock}
                                    onChange={(e) => setData('current_stock', e.target.value)}
                                    className={inputClass}
                                />
                            </div>
                            <div>
                                <Label>Stok Minimum</Label>
                                <Input
                                    aria-label="Stok minimum barang"
                                    type="number"
                                    min="0"
                                    value={data.min_stock}
                                    onChange={(e) => setData('min_stock', e.target.value)}
                                />
                            </div>
                        </div>
                    ) : (
                        <p className="rounded-lg bg-[var(--second-accent)] px-3 py-2 text-xs text-[var(--grey-text)] dark:text-[var(--muted-foreground)]">
                            Pilih salah satu cabang di filter (bukan &quot;Semua Cabang&quot;) untuk bisa mengatur stok barang ini.
                        </p>
                    )}

                    <div>
                        <Label className="mb-1 block text-sm font-medium text-[var(--subheading)] dark:text-white">Harga</Label>
                        <Input
                            aria-label="Harga barang"
                            type="number"
                            min="0"
                            value={data.price}
                            onChange={(e) => setData('price', e.target.value)}
                        />
                    </div>

                    <div className="mt-3 flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={handleClose} className="dark:text-white">
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="bg-[var(--surface-header)] text-white hover:bg-[var(--surface-header-hover)] dark:bg-white dark:text-black dark:hover:bg-gray-200"
                        >
                            {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
