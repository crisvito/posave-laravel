import { Button, CATEGORY_COLOR_SWATCHES, CategoryColorPicker, Input, Label } from '@/components';
import { useLanguage } from '@/hooks';
import { useForm } from '@inertiajs/react';
import { X } from 'lucide-react';
import React from 'react';
import type { InventoryCategory } from '.';

interface InventoryCategoryEditModalProps {
    category: InventoryCategory;
    onClose: () => void;
}

export function InventoryCategoryEditModal({ category, onClose }: InventoryCategoryEditModalProps) {
    const { t } = useLanguage();
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
            <div className="w-full max-w-md rounded-2xl bg-[var(--card)] p-6 shadow-xl">
                <div className="mb-5 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-[var(--subheading)]">{t('dashboardAdvance.inventoryCategories.editModal.title')}</h3>
                    <button aria-label={t('dashboardAdvance.inventoryCategories.editModal.closeAriaLabel')} onClick={handleClose}>
                        <X className="h-5 w-5 text-[var(--grey-text)] hover:text-[var(--subheading)]" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <Label className="mb-1.5 block text-sm font-medium text-[var(--subheading)]">
                            {t('dashboardAdvance.inventoryCategories.editModal.nameLabel')}
                        </Label>
                        <Input
                            aria-label={t('dashboardAdvance.inventoryCategories.editModal.nameAriaLabel')}
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                        />
                        {errors.name && <span className="text-sm text-[var(--danger)]">{errors.name}</span>}
                    </div>

                    <CategoryColorPicker value={data.color} onChange={(color) => setData('color', color ?? CATEGORY_COLOR_SWATCHES[0])} />
                    {errors.color && <span className="text-sm text-[var(--danger)]">{errors.color}</span>}

                    <div className="mt-2 flex justify-end gap-2">
                        <Button
                            aria-label={t('dashboardAdvance.inventoryCategories.editModal.cancelAriaLabel')}
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            className="bg-transparent"
                        >
                            {t('dashboardAdvance.inventoryCategories.editModal.cancel')}
                        </Button>
                        <Button
                            aria-label={t('dashboardAdvance.inventoryCategories.editModal.submitAriaLabel')}
                            type="submit"
                            disabled={processing}
                            className="bg-[var(--surface-header)] text-[var(--text-light)] hover:bg-[var(--surface-header-hover)]"
                        >
                            {processing
                                ? t('dashboardAdvance.inventoryCategories.editModal.submitting')
                                : t('dashboardAdvance.inventoryCategories.editModal.submitLabel')}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
