import { Button, CATEGORY_COLOR_SWATCHES, CategoryColorPicker } from '@/components';
import { Input } from '@/components/ui';
import { useForm } from '@inertiajs/react';
import { Tag, Trash2, X } from 'lucide-react';

interface InventoryCategoryFormModalProps {
    category: { id: number; name: string; color: string | null } | null;
    onClose: () => void;
    onDelete?: () => void;
}

export function InventoryCategoryFormModal({ category, onClose, onDelete }: InventoryCategoryFormModalProps) {
    const isEdit = !!category;

    const { data, setData, post, processing, errors, reset } = useForm({
        _method: isEdit ? 'PUT' : 'POST',
        name: category?.name ?? '',
        color: category?.color ?? CATEGORY_COLOR_SWATCHES[0],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const url = isEdit ? route('lite.inventory.categories.update', category!.id) : route('lite.inventory.categories.store');
        post(url, {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center sm:p-4">
            <div className="w-full max-w-md rounded-t-3xl bg-[var(--neutral-white)] shadow-xl sm:rounded-3xl dark:bg-[var(--primary-900)]">
                <div className="flex items-center justify-between p-5">
                    <div className="flex items-center gap-3">
                        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--second-accent)] dark:bg-[var(--border-strong)]">
                            <Tag className="h-6 w-6 text-[var(--subheading)] dark:text-[var(--neutral-white)]" />
                        </span>
                        <h3 className="text-xl font-bold text-[var(--subheading)] dark:text-[var(--neutral-white)]">
                            {isEdit ? 'Ubah Kategori' : 'Tambah Kategori'}
                        </h3>
                    </div>
                    <button aria-label="Tutup" onClick={onClose}>
                        <X className="h-6 w-6 text-[var(--grey-text)] dark:text-[var(--neutral-white)]" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-5 pb-5">
                    <div>
                        <label className="mb-1.5 block text-sm font-semibold text-[var(--subheading)] dark:text-[var(--neutral-white)]">
                            Nama Kategori
                        </label>
                        <Input
                            aria-label="Nama kategori"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Contoh: Minuman, Sembako..."
                        />
                        {errors.name && <p className="mt-1 text-sm text-[var(--danger)]">{errors.name}</p>}
                    </div>

                    <CategoryColorPicker value={data.color} onChange={(color) => setData('color', color ?? CATEGORY_COLOR_SWATCHES[0])} />
                    {errors.color && <p className="mt-1 text-sm text-[var(--danger)]">{errors.color}</p>}

                    <div className="mt-2 flex flex-col gap-2">
                        <Button
                            aria-label="Simpan kategori"
                            type="submit"
                            disabled={processing}
                            className="h-12 rounded-xl bg-[var(--surface-header)] text-base font-bold hover:bg-[var(--surface-header-hover)] dark:bg-[var(--neutral-white)] dark:text-[var(--primary-900)] dark:hover:opacity-90"
                        >
                            {processing ? 'Menyimpan...' : 'Simpan'}
                        </Button>
                        {onDelete && (
                            <Button
                                aria-label="Hapus kategori"
                                type="button"
                                variant="outline"
                                onClick={onDelete}
                                className="h-12 rounded-xl border-[var(--danger)] text-base font-bold text-[var(--danger)] hover:bg-[var(--danger-background)] dark:border-red-400 dark:text-red-400 dark:hover:bg-red-900/30"
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Hapus Kategori
                            </Button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}
