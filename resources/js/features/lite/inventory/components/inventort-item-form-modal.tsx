import { FilterDropdown } from '@/components';
import { Button, Input, Label } from '@/components/ui';
import { useForm } from '@inertiajs/react';
import { Package, Trash2, UploadCloud, X } from 'lucide-react';
import { useRef, useState } from 'react';

interface InventoryItemFormModalProps {
    item: { id: number; name: string; category_id: number; price: number; current_stock: number; min_stock: number; image: string | null } | null;
    categories: { id: number; name: string }[];
    onClose: () => void;
    onDelete?: () => void;
}

export function InventoryItemFormModal({ item, categories, onClose, onDelete }: InventoryItemFormModalProps) {
    const isEdit = !!item;
    const [preview, setPreview] = useState<string | null>(item?.image ? `/storage/${item.image}` : null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        _method: isEdit ? 'PUT' : 'POST',
        name: item?.name ?? '',
        category_id: item ? String(item.category_id) : '',
        price: item ? String(item.price) : '',
        current_stock: item ? String(item.current_stock) : '0',
        min_stock: item ? String(item.min_stock) : '3',
        image: null as File | null,
    });

    const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setData('image', file);
        if (file) setPreview(URL.createObjectURL(file));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const url = isEdit ? route('lite.inventory.items.update', item!.id) : route('lite.inventory.items.store');
        post(url, {
            forceFormData: true,
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center sm:p-4">
            <div className="w-full max-w-md rounded-t-3xl bg-[var(--neutral-white)] shadow-xl sm:rounded-3xl dark:bg-[var(--background)]">
                <div className="flex items-center justify-between p-5">
                    <div className="flex items-center gap-3">
                        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--second-accent)] dark:bg-[var(--border-strong)]">
                            <Package className="h-6 w-6 text-[var(--subheading)] dark:text-[var(--neutral-white)]" />
                        </span>
                        <h3 className="text-xl font-bold text-[var(--subheading)] dark:text-[var(--neutral-white)]">
                            {isEdit ? 'Ubah Barang' : 'Tambah Barang'}
                        </h3>
                    </div>
                    <button aria-label="Tutup" onClick={onClose}>
                        <X className="h-6 w-6 text-[var(--grey-text)] dark:text-[var(--neutral-white)]" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex max-h-[75vh] flex-col gap-4 overflow-y-auto px-5 pb-5">
                    <div>
                        <Label>Nama Barang</Label>
                        <Input
                            aria-label="Nama barang"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Contoh: Indomie Goreng"
                            className="h-12 rounded-xl text-base dark:border-[var(--border-strong)] dark:bg-[var(--primary-900)] dark:text-[var(--neutral-white)]"
                        />
                        {errors.name && <p className="mt-1 text-sm text-[var(--danger)]">{errors.name}</p>}
                    </div>

                    <div>
                        <Label>Kategori</Label>
                        <FilterDropdown
                            value={data.category_id || undefined}
                            allLabel="Pilih kategori"
                            options={categories.map((c) => ({
                                value: String(c.id),
                                label: c.name,
                            }))}
                            onChange={(value) => setData('category_id', value ?? '')}
                            buttonClassName="!w-full"
                        />
                        {errors.category_id && <p className="mt-1 text-sm text-[var(--danger)]">{errors.category_id}</p>}
                    </div>

                    <div>
                        <Label>Harga Jual</Label>
                        <Input
                            aria-label="Harga jual"
                            type="number"
                            min="0"
                            value={data.price}
                            onChange={(e) => setData('price', e.target.value)}
                            placeholder="0"
                            className="h-12 rounded-xl text-base dark:border-[var(--border-strong)] dark:bg-[var(--primary-900)] dark:text-[var(--neutral-white)]"
                        />
                        {errors.price && <p className="mt-1 text-sm text-[var(--danger)]">{errors.price}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <Label>{isEdit ? 'Stok Sekarang' : 'Stok Awal'}</Label>
                            <Input
                                aria-label="Jumlah stok"
                                type="number"
                                min="0"
                                value={data.current_stock}
                                onChange={(e) => setData('current_stock', e.target.value)}
                                className="h-12 rounded-xl text-base dark:border-[var(--border-strong)] dark:bg-[var(--primary-900)] dark:text-[var(--neutral-white)]"
                            />
                        </div>
                        <div>
                            <Label>Batas "Mau Habis"</Label>
                            <Input
                                aria-label="Batas stok mau habis"
                                type="number"
                                min="0"
                                value={data.min_stock}
                                onChange={(e) => setData('min_stock', e.target.value)}
                                className="h-12 rounded-xl text-base dark:border-[var(--border-strong)] dark:bg-[var(--primary-900)] dark:text-[var(--neutral-white)]"
                            />
                        </div>
                    </div>
                    <p className="-mt-2 text-xs text-[var(--grey-text)] dark:text-[var(--muted-foreground)]">
                        Kalau stok sisa segini atau kurang, barang akan ditandai "Mau Habis".
                    </p>

                    <div>
                        <Label>Foto (biar gampang dikenali)</Label>
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="flex cursor-pointer items-center gap-4 rounded-xl border-2 border-dashed border-[var(--border-strong)] p-4 hover:bg-[var(--second-accent)] dark:border-[var(--border-strong)] dark:hover:bg-white/10"
                        >
                            {preview ? (
                                <img src={preview} alt="Pratinjau" className="h-14 w-14 rounded-lg object-cover" />
                            ) : (
                                <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-[var(--second-accent)] dark:bg-[var(--border-strong)]">
                                    <UploadCloud className="h-6 w-6 text-[var(--grey-text)] dark:text-[var(--neutral-white)]" />
                                </div>
                            )}
                            <span className="text-sm font-medium text-[var(--subheading)] dark:text-[var(--neutral-white)]">
                                {preview ? 'Ganti foto' : 'Tap untuk pilih foto'}
                            </span>
                        </div>
                        <input
                            aria-label="Unggah foto barang"
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImage}
                            className="hidden"
                        />
                    </div>

                    <div className="mt-2 flex flex-col gap-2">
                        <Button
                            aria-label="Simpan barang"
                            type="submit"
                            disabled={processing}
                            className="h-12 rounded-xl bg-[var(--surface-header)] text-base font-bold hover:bg-[var(--surface-header-hover)] dark:bg-[var(--neutral-white)] dark:text-[var(--primary-900)] dark:hover:opacity-90"
                        >
                            {processing ? 'Menyimpan...' : 'Simpan'}
                        </Button>
                        {onDelete && (
                            <Button
                                aria-label="Hapus barang"
                                type="button"
                                variant="outline"
                                onClick={onDelete}
                                className="h-12 rounded-xl border-[var(--danger)] text-base font-bold text-[var(--danger)] hover:bg-[var(--danger-background)] dark:border-red-400 dark:text-red-400 dark:hover:bg-red-900/30"
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Hapus Barang
                            </Button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}
