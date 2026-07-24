import { Button, Input, Label } from '@/components';
import { useLanguage } from '@/hooks';
import { useForm } from '@inertiajs/react';
import { ChevronDown, X } from 'lucide-react';
import React from 'react';

interface InventoryItemOption {
    id: number;
    name: string;
    sku: string;
    price: number;
}

interface BranchOption {
    id: number;
    name: string;
}

interface InventoryAdjustmentCreateModalProps {
    inventoryItems: InventoryItemOption[];
    branches: BranchOption[];
    defaultBranchId: number | null;
    lockBranch: boolean;
    onClose: () => void;
}

export function InventoryAdjustmentCreateModal({
    inventoryItems,
    branches,
    defaultBranchId,
    lockBranch,
    onClose,
}: InventoryAdjustmentCreateModalProps) {
    const { t } = useLanguage();
    const { data, setData, post, processing, errors, reset } = useForm({
        branch_id: defaultBranchId ? String(defaultBranchId) : '',
        date: new Date().toISOString().slice(0, 10),
        inventory_item_id: '',
        type: 'in',
        quantity: 1,
        note: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('dashboard.inventory.adjustments.store'), {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    const inputClass =
        'w-full rounded-md border border-[var(--border-strong)] bg-transparent px-3 py-2 text-sm text-[var(--subheading)] shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--ring)]';

    const lockedBranchName = branches.find((b) => b.id === defaultBranchId)?.name ?? '';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-md rounded-2xl bg-[var(--card)] p-6 shadow-xl">
                <div className="mb-5 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-[var(--subheading)]">{t('dashboardAdvance.inventoryAdjustments.createModal.title')}</h3>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                            reset();
                            onClose();
                        }}
                        aria-label={t('dashboardAdvance.inventoryAdjustments.createModal.closeAriaLabel')}
                    >
                        <X className="h-5 w-5 text-[var(--grey-text)] hover:text-[var(--subheading)]" />
                    </Button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <Label>{t('dashboardAdvance.inventoryAdjustments.createModal.branchLabel')}</Label>
                            {lockBranch ? (
                                <div className={`${inputClass} flex items-center bg-[var(--second-accent)]`}>{lockedBranchName || '-'}</div>
                            ) : (
                                <div className="relative">
                                    <select
                                        aria-label={t('dashboardAdvance.inventoryAdjustments.createModal.branchAriaLabel')}
                                        value={data.branch_id}
                                        onChange={(e) => setData('branch_id', e.target.value)}
                                        className={`${inputClass} appearance-none pr-10`}
                                    >
                                        <option value="" disabled className="bg-[var(--card)]">
                                            {t('dashboardAdvance.inventoryAdjustments.createModal.branchPlaceholder')}
                                        </option>
                                        {branches.map((b) => (
                                            <option key={b.id} value={b.id} className="bg-[var(--card)]">
                                                {b.name}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-[var(--grey-text-muted)]" />
                                </div>
                            )}
                            {errors.branch_id && <span className="text-xs text-[var(--danger)]">{errors.branch_id}</span>}
                        </div>
                        <div>
                            <Label className="mb-1.5 block text-sm font-medium text-[var(--subheading)]">
                                {t('dashboardAdvance.inventoryAdjustments.createModal.dateLabel')}
                            </Label>
                            <Input
                                aria-label={t('dashboardAdvance.inventoryAdjustments.createModal.dateAriaLabel')}
                                type="date"
                                value={data.date}
                                onChange={(e) => setData('date', e.target.value)}
                                style={{ resize: 'none' }}
                            />
                            {errors.date && <span className="text-xs text-[var(--danger)]">{errors.date}</span>}
                        </div>
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-[var(--subheading)]">
                            {t('dashboardAdvance.inventoryAdjustments.createModal.itemLabel')}
                        </label>
                        <div className="relative">
                            <select
                                aria-label={t('dashboardAdvance.inventoryAdjustments.createModal.itemAriaLabel')}
                                value={data.inventory_item_id}
                                onChange={(e) => setData('inventory_item_id', e.target.value)}
                                className={`${inputClass} appearance-none pr-10`}
                            >
                                <option value="" disabled className="bg-[var(--card)]">
                                    {t('dashboardAdvance.inventoryAdjustments.createModal.itemPlaceholder')}
                                </option>
                                {inventoryItems.map((i) => (
                                    <option key={i.id} value={i.id} className="bg-[var(--card)]">
                                        {i.name} ({i.sku})
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-[var(--grey-text-muted)]" />
                        </div>
                        {errors.inventory_item_id && <span className="text-xs text-[var(--danger)]">{errors.inventory_item_id}</span>}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <Label>{t('dashboardAdvance.inventoryAdjustments.createModal.typeLabel')}</Label>
                            <div className="relative">
                                <select
                                    aria-label={t('dashboardAdvance.inventoryAdjustments.createModal.typeAriaLabel')}
                                    value={data.type}
                                    onChange={(e) => setData('type', e.target.value)}
                                    className={`${inputClass} appearance-none pr-10`}
                                >
                                    <option value="in" className="bg-[var(--card)]">
                                        {t('dashboardAdvance.inventoryAdjustments.createModal.typeInOption')}
                                    </option>
                                    <option value="out" className="bg-[var(--card)]">
                                        {t('dashboardAdvance.inventoryAdjustments.createModal.typeOutOption')}
                                    </option>
                                </select>
                                <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-[var(--grey-text-muted)]" />
                            </div>
                        </div>
                        <div>
                            <Label>{t('dashboardAdvance.inventoryAdjustments.createModal.qtyLabel')}</Label>
                            <Input
                                aria-label={t('dashboardAdvance.inventoryAdjustments.createModal.qtyAriaLabel')}
                                type="number"
                                min={1}
                                value={data.quantity}
                                onChange={(e) => setData('quantity', Number(e.target.value))}
                                style={{ resize: 'none', MozAppearance: 'textfield' }}
                                className={`[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
                            />
                            {errors.quantity && <span className="text-xs text-[var(--danger)]">{errors.quantity}</span>}
                        </div>
                    </div>

                    <div>
                        <Label>{t('dashboardAdvance.inventoryAdjustments.createModal.noteLabel')}</Label>
                        <Input
                            type="text"
                            value={data.note}
                            onChange={(e) => setData('note', e.target.value)}
                            placeholder={t('dashboardAdvance.inventoryAdjustments.createModal.notePlaceholder')}
                            style={{ resize: 'none' }}
                        />
                        {errors.note && <span className="text-xs text-[var(--danger)]">{errors.note}</span>}
                    </div>

                    <div className="mt-2 flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                reset();
                                onClose();
                            }}
                            className="!border-1 !border-[var(--danger)] bg-transparent !text-[var(--danger)]"
                        >
                            {t('dashboardAdvance.inventoryAdjustments.createModal.cancel')}
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="bg-[var(--surface-header)] text-[var(--text-light)] hover:bg-[var(--surface-header-hover)]"
                        >
                            {processing
                                ? t('dashboardAdvance.inventoryAdjustments.createModal.submitting')
                                : t('dashboardAdvance.inventoryAdjustments.createModal.submitLabel')}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
