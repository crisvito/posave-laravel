import { Button, CategoryColorPicker, Input, Label } from '@/components';
import { useLanguage } from '@/hooks';
import { useForm } from '@inertiajs/react';
import { X } from 'lucide-react';
import React from 'react';

interface InventoryCategoryCreateModalProps {
    onClose: () => void;
}

export function InventoryCategoryCreateModal({ onClose }: InventoryCategoryCreateModalProps) {
    const { t } = useLanguage();
    const { data, setData, post, processing, errors, reset } = useForm<{ name: string; color: string | null }>({
        name: '',
        color: null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('dashboard.inventory.categories.store'), {
            preserveState: true,
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
                    <h3 className="text-lg font-bold text-[var(--subheading)]">{t('dashboardAdvance.inventoryCategories.createModal.title')}</h3>
                    <Button variant="outline" aria-label={t('dashboardAdvance.inventoryCategories.createModal.closeAriaLabel')} onClick={handleClose}>
                        <X className="h-5 w-5 text-[var(--grey-text)] hover:text-[var(--subheading)]" />
                    </Button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <Label className="mb-1.5 block text-sm font-medium text-[var(--subheading)]">
                            {t('dashboardAdvance.inventoryCategories.createModal.nameLabel')}
                        </Label>
                        <Input
                            aria-label={t('dashboardAdvance.inventoryCategories.createModal.nameAriaLabel')}
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder={t('dashboardAdvance.inventoryCategories.createModal.namePlaceholder')}
                        />
                        {errors.name && <span className="text-sm text-[var(--danger)]">{errors.name}</span>}
                    </div>

                    <CategoryColorPicker value={data.color} onChange={(color) => setData('color', color)} allowAuto />
                    {errors.color && <span className="text-sm text-[var(--danger)]">{errors.color}</span>}

                    <div className="mt-2 flex justify-end gap-2">
                        <Button
                            aria-label={t('dashboardAdvance.inventoryCategories.createModal.cancelAriaLabel')}
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            className="!border-1 !border-[var(--danger)] bg-transparent !text-[var(--danger)]"
                        >
                            {t('dashboardAdvance.inventoryCategories.createModal.cancel')}
                        </Button>
                        <Button
                            aria-label={t('dashboardAdvance.inventoryCategories.createModal.submitAriaLabel')}
                            type="submit"
                            disabled={processing}
                            className="bg-[var(--surface-header)] text-[var(--text-light)] hover:bg-[var(--surface-header-hover)]"
                        >
                            {processing
                                ? t('dashboardAdvance.inventoryCategories.createModal.submitting')
                                : t('dashboardAdvance.inventoryCategories.createModal.submitLabel')}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
