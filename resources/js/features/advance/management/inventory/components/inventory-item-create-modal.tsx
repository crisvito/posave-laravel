import { Button, Input, Label } from '@/components';
import { useLanguage } from '@/hooks';
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
    const { t } = useLanguage();
    const [preview, setPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, errors, reset } = useForm<{
        name: string;
        category_id: string;
        branch_id: string;
        image: File | null;
        min_stock: string;
        price: string;
        cost: string;
    }>({
        name: '',
        category_id: '',
        branch_id: '',
        image: null,
        min_stock: '0',
        price: '0',
        cost: '0',
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
        'w-full rounded-lg border border-[var(--border-strong)] bg-transparent px-3 py-2 text-sm text-[var(--subheading)] shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--ring)]';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-lg rounded-2xl bg-[var(--card)] shadow-xl">
                <div className="flex items-start justify-between p-6 pb-4">
                    <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--second-accent)]">
                            <Package className="h-7 w-7 text-[var(--grey-text-muted)]" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-[var(--subheading)]">{t('dashboardAdvance.inventoryItems.createModal.title')}</h3>
                            <p className="text-sm text-[var(--grey-text)]">{t('dashboardAdvance.inventoryItems.createModal.subtitle')}</p>
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        aria-label={t('dashboardAdvance.inventoryItems.createModal.closeAriaLabel')}
                        onClick={handleClose}
                        className="mt-1"
                    >
                        <X className="h-5 w-5 text-[var(--grey-text)] hover:text-[var(--subheading)]" />
                    </Button>
                </div>

                <div className="border-t border-[var(--border-strong)]" />

                <form onSubmit={handleSubmit}>
                    <div className="flex max-h-[60vh] flex-col gap-4 overflow-y-auto p-6">
                        <div>
                            <Label>{t('dashboardAdvance.inventoryItems.createModal.nameLabel')}</Label>
                            <Input
                                aria-label={t('dashboardAdvance.inventoryItems.createModal.nameAriaLabel')}
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder={t('dashboardAdvance.inventoryItems.createModal.namePlaceholder')}
                            />
                            {errors.name && <span className="text-xs text-[var(--danger)]">{errors.name}</span>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>{t('dashboardAdvance.inventoryItems.createModal.categoryLabel')}</Label>
                                <div className="relative">
                                    <select
                                        aria-label={t('dashboardAdvance.inventoryItems.createModal.categoryAriaLabel')}
                                        value={data.category_id}
                                        onChange={(e) => setData('category_id', e.target.value)}
                                        className={`${inputClass} appearance-none`}
                                    >
                                        <option value="" disabled className="bg-[var(--card)]">
                                            {t('dashboardAdvance.inventoryItems.createModal.categoryPlaceholder')}
                                        </option>
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id} className="bg-[var(--card)]">
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-[var(--grey-text-muted)]" />
                                </div>
                                {errors.category_id && <span className="text-xs text-[var(--danger)]">{errors.category_id}</span>}
                            </div>
                            <div>
                                <Label>{t('dashboardAdvance.inventoryItems.createModal.branchLabel')}</Label>
                                <div className="relative">
                                    <select
                                        aria-label={t('dashboardAdvance.inventoryItems.createModal.branchAriaLabel')}
                                        value={data.branch_id}
                                        onChange={(e) => setData('branch_id', e.target.value)}
                                        className={`${inputClass} appearance-none`}
                                    >
                                        <option value="" disabled className="bg-[var(--card)]">
                                            {t('dashboardAdvance.inventoryItems.createModal.branchPlaceholder')}
                                        </option>
                                        {branches.map((b) => (
                                            <option key={b.id} value={b.id} className="bg-[var(--card)]">
                                                {b.name}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-[var(--grey-text-muted)]" />
                                </div>
                                {errors.branch_id && <span className="text-xs text-[var(--danger)]">{errors.branch_id}</span>}
                                <p className="mt-1 text-xs text-[var(--grey-text)]">{t('dashboardAdvance.inventoryItems.createModal.branchHint')}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>{t('dashboardAdvance.inventoryItems.createModal.priceLabel')}</Label>
                                <Input
                                    aria-label={t('dashboardAdvance.inventoryItems.createModal.priceAriaLabel')}
                                    type="number"
                                    min="0"
                                    value={data.price}
                                    onChange={(e) => setData('price', e.target.value)}
                                />
                                {errors.price && <span className="text-xs text-[var(--danger)]">{errors.price}</span>}
                            </div>
                        </div>

                        <div>
                            <Label>{t('dashboardAdvance.inventoryItems.createModal.minStockLabel')}</Label>
                            <Input
                                aria-label={t('dashboardAdvance.inventoryItems.createModal.minStockAriaLabel')}
                                type="number"
                                min="0"
                                value={data.min_stock}
                                onChange={(e) => setData('min_stock', e.target.value)}
                            />
                            <p className="mt-1 text-xs text-[var(--grey-text)]">{t('dashboardAdvance.inventoryItems.createModal.minStockHint')}</p>
                        </div>

                        <p className="rounded-lg bg-[var(--second-accent)] px-3 py-2 text-xs text-[var(--grey-text)]">
                            {t('dashboardAdvance.inventoryItems.createModal.noInitialStockNotice')}
                        </p>

                        <div>
                            <Label>
                                {t('dashboardAdvance.inventoryItems.createModal.imageLabel')}{' '}
                                <span className="font-normal text-[var(--grey-text)]">
                                    {t('dashboardAdvance.inventoryItems.createModal.imageOptional')}
                                </span>
                            </Label>
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="flex cursor-pointer items-center gap-4 rounded-lg border border-dashed border-[var(--border-strong)] p-4 transition-colors hover:bg-[var(--second-accent)]"
                            >
                                {preview ? (
                                    <img
                                        src={preview}
                                        alt={t('dashboardAdvance.inventoryItems.createModal.imageLabel')}
                                        className="h-12 w-12 rounded-lg object-cover"
                                    />
                                ) : (
                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--second-accent)]">
                                        <UploadCloud className="h-6 w-6 text-[var(--grey-text-muted)]" />
                                    </div>
                                )}
                                <div>
                                    <p className="text-sm font-medium text-[var(--subheading)]">
                                        {preview
                                            ? t('dashboardAdvance.inventoryItems.createModal.changeImage')
                                            : t('dashboardAdvance.inventoryItems.createModal.uploadImage')}
                                    </p>
                                    <p className="text-xs text-[var(--grey-text)]">{t('dashboardAdvance.inventoryItems.createModal.imageHint')}</p>
                                </div>
                            </div>
                            <Input type="file" ref={fileInputRef} accept="image/*" onChange={handleImage} className="hidden" />
                            {errors.image && <span className="text-xs text-[var(--danger)]">{errors.image}</span>}
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 border-t border-[var(--border-strong)] px-6 py-4">
                        <Button type="button" variant="outline" onClick={handleClose}>
                            {t('dashboardAdvance.inventoryItems.createModal.cancel')}
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="bg-[var(--surface-header)] text-white hover:bg-[var(--surface-header-hover)]"
                        >
                            {processing
                                ? t('dashboardAdvance.inventoryItems.createModal.submitting')
                                : t('dashboardAdvance.inventoryItems.createModal.submitLabel')}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
