import { Button, Input, Label } from '@/components';
import { useLanguage } from '@/hooks';
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
    const { t } = useLanguage();
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
        'w-full rounded-lg border border-[var(--border-strong)] bg-transparent px-3 py-2 text-sm text-[var(--subheading)] shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--ring)]';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-md rounded-2xl bg-[var(--card)] p-6 shadow-xl">
                <div className="mb-5 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-[var(--subheading)]">{t('dashboardAdvance.inventoryItems.editModal.title')}</h3>
                    <button aria-label={t('dashboardAdvance.inventoryItems.editModal.closeAriaLabel')} onClick={handleClose}>
                        <X className="h-5 w-5 text-[var(--grey-text)] hover:text-[var(--subheading)]" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <Label>
                            {t('dashboardAdvance.inventoryItems.editModal.imageLabel')}{' '}
                            <span className="text-[var(--grey-text)]">{t('dashboardAdvance.inventoryItems.editModal.imageOptional')}</span>
                        </Label>
                        {preview && (
                            <img
                                src={preview}
                                alt={t('dashboardAdvance.inventoryItems.editModal.imageLabel')}
                                className="mb-2 h-16 w-16 rounded-lg object-cover"
                            />
                        )}
                        <input
                            aria-label={t('dashboardAdvance.inventoryItems.editModal.imageAriaLabel')}
                            type="file"
                            accept="image/*"
                            onChange={handleImage}
                            className={inputClass}
                        />
                        {errors.image && <span className="text-sm text-[var(--danger)]">{errors.image}</span>}
                    </div>

                    <div>
                        <Label>{t('dashboardAdvance.inventoryItems.editModal.nameLabel')}</Label>
                        <Input
                            aria-label={t('dashboardAdvance.inventoryItems.editModal.nameAriaLabel')}
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                        />
                        {errors.name && <span className="text-sm text-[var(--danger)]">{errors.name}</span>}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <Label>{t('dashboardAdvance.inventoryItems.editModal.skuLabel')}</Label>
                            <Input
                                aria-label={t('dashboardAdvance.inventoryItems.editModal.skuAriaLabel')}
                                type="text"
                                value={data.sku}
                                onChange={(e) => setData('sku', e.target.value)}
                            />
                            {errors.sku && <span className="text-xs text-[var(--danger)]">{errors.sku}</span>}
                        </div>
                        <div>
                            <Label>{t('dashboardAdvance.inventoryItems.editModal.categoryLabel')}</Label>
                            <select
                                aria-label={t('dashboardAdvance.inventoryItems.editModal.categoryAriaLabel')}
                                value={data.category_id}
                                onChange={(e) => setData('category_id', e.target.value)}
                                className={`${inputClass} appearance-none`}
                            >
                                <option value="" disabled className="bg-[var(--card)]">
                                    {t('dashboardAdvance.inventoryItems.editModal.categoryPlaceholder')}
                                </option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id} className="bg-[var(--card)]">
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                            {errors.category_id && <span className="text-xs text-[var(--danger)]">{errors.category_id}</span>}
                        </div>
                    </div>

                    {selectedBranchId ? (
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <Label>
                                    {t('dashboardAdvance.inventoryItems.editModal.currentStockLabelPrefix')} {selectedBranchName}
                                </Label>
                                <Input
                                    aria-label={`${t('dashboardAdvance.inventoryItems.editModal.currentStockLabelPrefix')} ${selectedBranchName ?? ''}`}
                                    type="number"
                                    min="0"
                                    value={data.current_stock}
                                    onChange={(e) => setData('current_stock', e.target.value)}
                                    className={inputClass}
                                />
                            </div>
                            <div>
                                <Label>{t('dashboardAdvance.inventoryItems.editModal.minStockLabel')}</Label>
                                <Input
                                    aria-label={t('dashboardAdvance.inventoryItems.editModal.minStockAriaLabel')}
                                    type="number"
                                    min="0"
                                    value={data.min_stock}
                                    onChange={(e) => setData('min_stock', e.target.value)}
                                />
                            </div>
                        </div>
                    ) : (
                        <p className="rounded-lg bg-[var(--second-accent)] px-3 py-2 text-xs text-[var(--grey-text)]">
                            {t('dashboardAdvance.inventoryItems.editModal.selectBranchNotice')}
                        </p>
                    )}

                    <div>
                        <Label className="mb-1 block text-sm font-medium text-[var(--subheading)]">
                            {t('dashboardAdvance.inventoryItems.editModal.priceLabel')}
                        </Label>
                        <Input
                            aria-label={t('dashboardAdvance.inventoryItems.editModal.priceAriaLabel')}
                            type="number"
                            min="0"
                            value={data.price}
                            onChange={(e) => setData('price', e.target.value)}
                        />
                    </div>

                    <div className="mt-3 flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={handleClose}>
                            {t('dashboardAdvance.inventoryItems.editModal.cancel')}
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="bg-[var(--surface-header)] text-white hover:bg-[var(--surface-header-hover)]"
                        >
                            {processing
                                ? t('dashboardAdvance.inventoryItems.editModal.submitting')
                                : t('dashboardAdvance.inventoryItems.editModal.submitLabel')}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
