import { Button } from '@/components';
import { useForm } from '@inertiajs/react';
import { Store, UploadCloud, X } from 'lucide-react';
import React, { useRef, useState } from 'react';

interface Supplier {
    id: number;
    name: string;
    category_id: number | null;
    address: string | null;
    phone: string | null;
    email: string | null;
    logo: string | null;
}

interface InventorySupplierEditModalProps {
    supplier: Supplier;
    categories: { id: number; name: string }[];
    onClose: () => void;
}

export function InventorySupplierEditModal({ supplier, categories, onClose }: InventorySupplierEditModalProps) {
    const [preview, setPreview] = useState<string | null>(supplier.logo ? `/storage/${supplier.logo}` : null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, errors, reset } = useForm<{
        _method: string;
        name: string;
        category_id: string;
        address: string;
        phone: string;
        email: string;
        logo: File | null;
    }>({
        _method: 'PUT',
        name: supplier.name,
        category_id: supplier.category_id ? String(supplier.category_id) : '',
        address: supplier.address ?? '',
        phone: supplier.phone ?? '',
        email: supplier.email ?? '',
        logo: null,
    });

    const handleLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setData('logo', file);
        if (file) setPreview(URL.createObjectURL(file));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('dashboard.inventory.suppliers.update', supplier.id), {
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

    const inputClass =
        'w-full rounded-lg border border-[var(--border-strong)] bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--ring)] dark:text-white';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-lg rounded-2xl bg-[var(--neutral-white)] shadow-xl dark:border dark:border-[var(--border-strong)] dark:bg-[var(--card)]">
                <div className="flex items-start justify-between p-6 pb-4">
                    <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 dark:bg-[var(--second-accent)]">
                            <Store className="h-7 w-7 text-gray-500 dark:text-[var(--muted-foreground)]" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-[var(--subheading)] dark:text-white">Ubah Pemasok</h3>
                            <p className="text-sm text-[var(--grey-text)] dark:text-[var(--muted-foreground)]">Perbarui data pemasok</p>
                        </div>
                    </div>
                    <button onClick={handleClose} className="mt-1" aria-label="Tutup">
                        <X className="h-5 w-5 text-[var(--grey-text)] hover:text-[var(--subheading)] dark:hover:text-white" />
                    </button>
                </div>

                <div className="border-t border-[var(--border-strong)]" />

                <form onSubmit={handleSubmit}>
                    <div className="flex max-h-[60vh] flex-col gap-4 overflow-y-auto p-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-[var(--subheading)] dark:text-white">Nama Pemasok</label>
                                <input type="text" value={data.name} onChange={(e) => setData('name', e.target.value)} className={inputClass} />
                                {errors.name && <span className="text-xs text-red-500">{errors.name}</span>}
                            </div>
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-[var(--subheading)] dark:text-white">Kategori</label>
                                <select
                                    value={data.category_id}
                                    onChange={(e) => setData('category_id', e.target.value)}
                                    className={`${inputClass} appearance-none`}
                                >
                                    <option value="" className="dark:bg-[var(--card)]">
                                        Tanpa kategori
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

                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-[var(--subheading)] dark:text-white">Alamat</label>
                            <textarea
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                                rows={2}
                                className={`${inputClass} resize-none`}
                            />
                            {errors.address && <span className="text-xs text-red-500">{errors.address}</span>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-[var(--subheading)] dark:text-white">Nomor Telepon</label>
                                <input type="text" value={data.phone} onChange={(e) => setData('phone', e.target.value)} className={inputClass} />
                                {errors.phone && <span className="text-xs text-red-500">{errors.phone}</span>}
                            </div>
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-[var(--subheading)] dark:text-white">Email</label>
                                <input type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} className={inputClass} />
                                {errors.email && <span className="text-xs text-red-500">{errors.email}</span>}
                            </div>
                        </div>

                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-[var(--subheading)] dark:text-white">
                                Logo <span className="font-normal text-[var(--grey-text)]">(Opsional)</span>
                            </label>
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="flex cursor-pointer items-center gap-4 rounded-lg border border-dashed border-[var(--border-strong)] p-4 transition-colors hover:bg-[var(--surface-badge)] dark:hover:bg-[var(--second-accent)]"
                            >
                                {preview ? (
                                    <img src={preview} alt="preview" className="h-12 w-12 rounded-full object-cover" />
                                ) : (
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-[var(--border-strong)]">
                                        <UploadCloud className="h-6 w-6 text-gray-400" />
                                    </div>
                                )}
                                <div>
                                    <p className="text-sm font-medium text-[var(--subheading)] dark:text-white">
                                        {preview ? 'Ganti logo' : 'Klik untuk upload logo'}
                                    </p>
                                    <p className="text-xs text-[var(--grey-text)] dark:text-[var(--muted-foreground)]">
                                        PNG, JPG atau WEBP. Maksimal 2MB
                                    </p>
                                </div>
                            </div>
                            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleLogo} className="hidden" aria-label="file-input" />
                            {errors.logo && <span className="text-xs text-red-500">{errors.logo}</span>}
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
                            {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
