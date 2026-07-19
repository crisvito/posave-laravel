import { Button, CATEGORY_COLOR_SWATCHES, CategoryColorPicker } from '@/components';
import { Input } from '@/components/ui';
import { useLanguage } from '@/hooks';
import { useForm } from '@inertiajs/react';
import { Tag, X } from 'lucide-react';

interface InventoryCategoryFormModalProps {
    category: { id: number; name: string; color: string | null } | null;
    onClose: () => void;
}

export function InventoryCategoryFormModal({ category, onClose }: InventoryCategoryFormModalProps) {
    const { t } = useLanguage();
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
                            {isEdit
                                ? t('dashboardLite.inventoryCategories.modal.editTitle')
                                : t('dashboardLite.inventoryCategories.modal.createTitle')}
                        </h3>
                    </div>
                    <button aria-label={t('dashboardLite.inventoryCategories.modal.closeAria')} onClick={onClose}>
                        <X className="h-6 w-6 text-[var(--grey-text)] dark:text-[var(--neutral-white)]" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-5 pb-5">
                    <div>
                        <label className="mb-1.5 block text-sm font-semibold text-[var(--subheading)] dark:text-[var(--neutral-white)]">
                            {t('dashboardLite.inventoryCategories.modal.nameLabel')}
                        </label>
                        <Input
                            aria-label={t('dashboardLite.inventoryCategories.modal.nameAria')}
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder={t('dashboardLite.inventoryCategories.modal.namePlaceholder')}
                        />
                        {errors.name && <p className="mt-1 text-sm text-[var(--danger)]">{errors.name}</p>}
                    </div>

                    <CategoryColorPicker value={data.color} onChange={(color) => setData('color', color ?? CATEGORY_COLOR_SWATCHES[0])} />
                    {errors.color && <p className="mt-1 text-sm text-[var(--danger)]">{errors.color}</p>}

                    <div className="mt-2 flex flex-col gap-2">
                        <Button
                            aria-label={t('dashboardLite.inventoryCategories.modal.saveAria')}
                            type="submit"
                            disabled={processing}
                            className="h-12 rounded-xl bg-[var(--surface-header)] text-base font-bold hover:bg-[var(--surface-header-hover)] dark:bg-[var(--neutral-white)] dark:text-[var(--primary-900)] dark:hover:opacity-90"
                        >
                            {processing
                                ? t('dashboardLite.inventoryCategories.modal.savingButton')
                                : t('dashboardLite.inventoryCategories.modal.saveButton')}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
