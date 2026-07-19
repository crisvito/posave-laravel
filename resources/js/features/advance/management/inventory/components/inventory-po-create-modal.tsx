import { Button } from '@/components';
import { useLanguage } from '@/hooks';
import { useForm } from '@inertiajs/react';
import { ChevronDown, Plus, Trash2, X } from 'lucide-react';
import React from 'react';

interface Supplier {
    id: number;
    name: string;
}
interface BranchOption {
    id: number;
    name: string;
}
interface InventoryItemOption {
    id: number;
    name: string;
    sku: string;
    price: number;
}

interface InventoryPurchaseOrderCreateModalProps {
    suppliers: Supplier[];
    inventoryItems: InventoryItemOption[];
    branches: BranchOption[];
    myBranchId: number | null;
    isBranchManager: boolean;
    onClose: () => void;
}

export function InventoryPurchaseOrderCreateModal({
    suppliers,
    inventoryItems,
    branches,
    myBranchId,
    isBranchManager,
    onClose,
}: InventoryPurchaseOrderCreateModalProps) {
    const { t } = useLanguage();
    const { data, setData, post, processing, errors, reset } = useForm({
        branch_id: isBranchManager && myBranchId ? String(myBranchId) : '',
        supplier_id: '',
        date: new Date().toISOString().slice(0, 10),
        items: [{ inventory_item_id: '', quantity: 1, price: 0 }] as { inventory_item_id: string; quantity: number; price: number }[],
    });

    const addItem = () => {
        setData('items', [...data.items, { inventory_item_id: '', quantity: 1, price: 0 }]);
    };

    const removeItem = (index: number) => {
        setData(
            'items',
            data.items.filter((_, i) => i !== index),
        );
    };

    const updateItem = (index: number, field: 'inventory_item_id' | 'quantity' | 'price', value: string | number) => {
        const items = [...data.items];
        items[index] = { ...items[index], [field]: value };

        if (field === 'inventory_item_id') {
            const selected = inventoryItems.find((i) => String(i.id) === String(value));
            if (selected) {
                items[index].price = selected.price;
            }
        }

        setData('items', items);
    };

    const totalPrice = data.items.reduce((sum, item) => sum + item.quantity * item.price, 0);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('dashboard.inventory.purchase-orders.store'), {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    const lockedBranchName = branches.find((b) => b.id === myBranchId)?.name ?? '';
    const inputClass =
        'w-full rounded-md border border-[var(--border-strong)] bg-transparent px-3 py-2 text-sm text-[var(--subheading)] shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--ring)]';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-lg rounded-2xl bg-[var(--card)] p-6 shadow-xl">
                <div className="mb-5 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-[var(--subheading)]">{t('dashboardAdvance.inventoryPurchaseOrders.createModal.title')}</h3>
                    <button
                        type="button"
                        onClick={() => {
                            reset();
                            onClose();
                        }}
                        aria-label={t('dashboardAdvance.inventoryPurchaseOrders.createModal.closeAriaLabel')}
                    >
                        <X className="h-5 w-5 text-[var(--grey-text)] hover:text-[var(--subheading)]" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="-mx-1 flex max-h-[70vh] flex-col gap-4 overflow-y-auto px-1">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-[var(--subheading)]">
                                {t('dashboardAdvance.inventoryPurchaseOrders.createModal.branchLabel')}
                            </label>
                            {isBranchManager ? (
                                <div className={`${inputClass} flex items-center bg-[var(--second-accent)] text-[var(--subheading)]`}>
                                    {lockedBranchName || '-'}
                                </div>
                            ) : (
                                <div className="relative">
                                    <select
                                        aria-label={t('dashboardAdvance.inventoryPurchaseOrders.createModal.branchAriaLabel')}
                                        value={data.branch_id}
                                        onChange={(e) => setData('branch_id', e.target.value)}
                                        className={`${inputClass} appearance-none`}
                                    >
                                        <option value="" disabled className="bg-[var(--card)]">
                                            {t('dashboardAdvance.inventoryPurchaseOrders.createModal.branchPlaceholder')}
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
                            {errors.branch_id && <span className="text-sm text-[var(--danger)]">{errors.branch_id}</span>}
                        </div>
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-[var(--subheading)]">
                                {t('dashboardAdvance.inventoryPurchaseOrders.createModal.supplierLabel')}
                            </label>
                            <div className="relative">
                                <select
                                    aria-label={t('dashboardAdvance.inventoryPurchaseOrders.createModal.supplierAriaLabel')}
                                    value={data.supplier_id}
                                    onChange={(e) => setData('supplier_id', e.target.value)}
                                    className={`${inputClass} appearance-none`}
                                >
                                    <option value="" disabled className="bg-[var(--card)]">
                                        {t('dashboardAdvance.inventoryPurchaseOrders.createModal.supplierPlaceholder')}
                                    </option>
                                    {suppliers.map((s) => (
                                        <option key={s.id} value={s.id} className="bg-[var(--card)]">
                                            {s.name}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-[var(--grey-text-muted)]" />
                            </div>
                            {errors.supplier_id && <span className="text-sm text-[var(--danger)]">{errors.supplier_id}</span>}
                        </div>
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-[var(--subheading)]">
                            {t('dashboardAdvance.inventoryPurchaseOrders.createModal.dateLabel')}
                        </label>
                        <input type="date" value={data.date} onChange={(e) => setData('date', e.target.value)} className={inputClass} />
                        {errors.date && <span className="text-sm text-[var(--danger)]">{errors.date}</span>}
                    </div>

                    <div>
                        <div className="mb-2 flex items-center justify-between">
                            <label className="text-sm font-medium text-[var(--subheading)]">
                                {t('dashboardAdvance.inventoryPurchaseOrders.createModal.itemsLabel')}
                            </label>
                            <button
                                type="button"
                                onClick={addItem}
                                className="flex items-center gap-1 text-sm font-medium text-[var(--secondary-600)] hover:underline"
                            >
                                <Plus className="h-4 w-4" /> {t('dashboardAdvance.inventoryPurchaseOrders.createModal.addItemButton')}
                            </button>
                        </div>
                        <div className="flex flex-col gap-3">
                            {data.items.map((item, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <select
                                        value={item.inventory_item_id}
                                        onChange={(e) => updateItem(index, 'inventory_item_id', e.target.value)}
                                        className={`${inputClass} appearance-none`}
                                    >
                                        <option value="" disabled className="bg-[var(--card)]">
                                            {t('dashboardAdvance.inventoryPurchaseOrders.createModal.itemPlaceholder')}
                                        </option>
                                        {inventoryItems.map((i) => (
                                            <option key={i.id} value={i.id} className="bg-[var(--card)]">
                                                {i.name} ({i.sku})
                                            </option>
                                        ))}
                                    </select>
                                    <input
                                        type="number"
                                        min={1}
                                        value={item.quantity}
                                        onChange={(e) => updateItem(index, 'quantity', Number(e.target.value))}
                                        className={`${inputClass} w-20`}
                                        placeholder={t('dashboardAdvance.inventoryPurchaseOrders.createModal.qtyPlaceholder')}
                                    />
                                    <input
                                        type="number"
                                        min={0}
                                        value={item.price}
                                        onChange={(e) => updateItem(index, 'price', Number(e.target.value))}
                                        className={`${inputClass} w-28`}
                                        placeholder={t('dashboardAdvance.inventoryPurchaseOrders.createModal.pricePlaceholder')}
                                    />
                                    {data.items.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeItem(index)}
                                            aria-label={t('dashboardAdvance.inventoryPurchaseOrders.createModal.removeItemAriaLabel')}
                                            className="rounded-md p-1 hover:bg-[var(--danger-background)]"
                                        >
                                            <Trash2 className="h-5 w-5 text-[var(--danger)]" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                        {errors.items && <span className="text-sm text-[var(--danger)]">{errors.items}</span>}
                    </div>

                    <div className="mt-2 flex items-center justify-between rounded-lg bg-[var(--second-accent)] px-4 py-3">
                        <span className="text-sm font-medium text-[var(--subheading)]">
                            {t('dashboardAdvance.inventoryPurchaseOrders.createModal.totalPriceLabel')}
                        </span>
                        <span className="text-base font-bold text-[var(--subheading)]">Rp {totalPrice.toLocaleString('id-ID')}</span>
                    </div>

                    <div className="mt-2 flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                reset();
                                onClose();
                            }}
                        >
                            {t('dashboardAdvance.inventoryPurchaseOrders.createModal.cancel')}
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="bg-[var(--surface-header)] text-white hover:bg-[var(--surface-header-hover)]"
                        >
                            {processing
                                ? t('dashboardAdvance.inventoryPurchaseOrders.createModal.submitting')
                                : t('dashboardAdvance.inventoryPurchaseOrders.createModal.submitLabel')}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
