import { Button, Input, Label } from '@/components';
import { useForm } from '@inertiajs/react';
import { ChevronDown, Package, UploadCloud, X } from 'lucide-react';
import React, { useRef, useState } from 'react';
import { InventoryCategory } from './inventory-category-actions-menu';

interface InventoryItemCreateModalProps {
    categories: InventoryCategory[];
    branches: { id: number; name: string }[];
    onClose: () => void;
}

export function InventoryItemCreateModal({ categories, branches, onClose }: InventoryItemCreateModalProps) {
    const [preview, setPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, errors, reset } = useForm<{
        name: string;
        category_id: string;
        branch_id: string;
        image: File | null;
        min_stock: string;
        current_stock: string;
        price: string;
    }>({
        name: '',
        category_id: '',
        branch_id: '',
        image: null,
        min_stock: '0',
        current_stock: '0',
        price: '0',
    });

    const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setData('image', file);
        if (file) setPreview(URL.createObjectURL(file));
        else setPreview(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('dashboard.inventory.items.store'), {
            forceFormData: true,
            onSuccess: () => {
                reset();
                setPreview(null);
                onClose();
            },
        });
    };

    const handleClose = () => {
        reset();
        setPreview(null);
        onClose();
    };

    const inputClass =
        'w-full rounded-lg border border-[var(--border-strong)] bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--ring)] dark:text-white';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-lg rounded-2xl bg-[var(--neutral-white)] shadow-xl dark:border dark:border-[var(--border-strong)] dark:bg-[var(--card)]">
                <div className="flex items-start justify-between p-6 pb-4">
                    <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 dark:bg-[var(--second-accent)]">
                            <Package className="h-7 w-7 text-gray-500 dark:text-[var(--muted-foreground)]" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-[var(--subheading)] dark:text-white">Buat Barang</h3>
                            <p className="text-sm text-[var(--grey-text)] dark:text-[var(--muted-foreground)]">
                                Tambah barang baru ke inventori anda
                            </p>
                        </div>
                    </div>
                    <button aria-label="Tutup modal buat barang" onClick={handleClose} className="mt-1">
                        <X className="h-5 w-5 text-[var(--grey-text)] hover:text-[var(--subheading)] dark:hover:text-white" />
                    </button>
                </div>

                <div className="border-t border-[var(--border-strong)]" />

                <form onSubmit={handleSubmit}>
                    <div className="flex max-h-[60vh] flex-col gap-4 overflow-y-auto p-6">
                        <div>
                            <Label>Nama Barang</Label>
                            <Input
                                aria-label="Nama barang"
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="Masukkan nama barang"
                            />
                            {errors.name && <span className="text-xs text-red-500">{errors.name}</span>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Kategori</Label>
                                <div className="relative">
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
                                    <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                </div>
                                {errors.category_id && <span className="text-xs text-red-500">{errors.category_id}</span>}
                            </div>
                            <div>
                                <Label>Cabang</Label>
                                <div className="relative">
                                    <select
                                        aria-label="Pilih cabang untuk stok awal"
                                        value={data.branch_id}
                                        onChange={(e) => setData('branch_id', e.target.value)}
                                        className={`${inputClass} appearance-none`}
                                    >
                                        <option value="" disabled className="dark:bg-[var(--card)]">
                                            Pilih Cabang
                                        </option>
                                        {branches.map((b) => (
                                            <option key={b.id} value={b.id} className="dark:bg-[var(--card)]">
                                                {b.name}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                </div>
                                {errors.branch_id && <span className="text-xs text-red-500">{errors.branch_id}</span>}
                                <p className="mt-1 text-xs text-[var(--grey-text)] dark:text-[var(--muted-foreground)]">
                                    Stok awal tercatat untuk cabang ini
                                </p>
                            </div>
                        </div>

                        <div>
                            <Label>Harga</Label>
                            <Input
                                aria-label="Harga barang"
                                type="number"
                                min="0"
                                value={data.price}
                                onChange={(e) => setData('price', e.target.value)}
                            />
                            {errors.price && <span className="text-xs text-red-500">{errors.price}</span>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Stok Awal</Label>
                                <Input
                                    aria-label="Stok awal barang"
                                    type="number"
                                    min="0"
                                    value={data.current_stock}
                                    onChange={(e) => setData('current_stock', e.target.value)}
                                />
                                {errors.current_stock && <span className="text-xs text-red-500">{errors.current_stock}</span>}
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
                                <p className="mt-1 text-xs text-[var(--grey-text)] dark:text-[var(--muted-foreground)]">
                                    Jumlah minimum sebelum stok dianggap rendah
                                </p>
                            </div>
                        </div>

                        <div>
                            <Label>
                                Gambar <span className="font-normal text-[var(--grey-text)]">(Opsional)</span>
                            </Label>
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="flex cursor-pointer items-center gap-4 rounded-lg border border-dashed border-[var(--border-strong)] p-4 transition-colors hover:bg-[var(--surface-badge)] dark:hover:bg-[var(--second-accent)]"
                            >
                                {preview ? (
                                    <img src={preview} alt="Pratinjau gambar barang" className="h-12 w-12 rounded-lg object-cover" />
                                ) : (
                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 dark:bg-[var(--border-strong)]">
                                        <UploadCloud className="h-6 w-6 text-gray-400" />
                                    </div>
                                )}
                                <div>
                                    <p className="text-sm font-medium text-[var(--subheading)] dark:text-white">
                                        {preview ? 'Ganti gambar' : 'Klik untuk upload gambar'}
                                    </p>
                                    <p className="text-xs text-[var(--grey-text)] dark:text-[var(--muted-foreground)]">
                                        PNG, JPG atau WEBP. Maksimal 2MB
                                    </p>
                                </div>
                            </div>
                            <Input type="file" ref={fileInputRef} accept="image/*" onChange={handleImage} className="hidden" />
                            {errors.image && <span className="text-xs text-red-500">{errors.image}</span>}
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 border-t border-[var(--border-strong)] px-6 py-4">
                        <Button type="button" variant="outline" onClick={handleClose} className="dark:text-white">
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="bg-[var(--surface-header)] text-white hover:bg-[var(--surface-header-hover)] dark:bg-white dark:text-black dark:hover:bg-gray-200"
                        >
                            {processing ? 'Menyimpan...' : 'Simpan Barang'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
