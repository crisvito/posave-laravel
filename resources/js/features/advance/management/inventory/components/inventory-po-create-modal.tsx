import { Button, Input, Label } from '@/components';
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
    lastPurchasePrices: Record<number, number>;
    branches: BranchOption[];
    myBranchId: number | null;
    isBranchManager: boolean;
    onClose: () => void;
}

export function InventoryPurchaseOrderCreateModal({
    suppliers,
    inventoryItems,
    lastPurchasePrices = {},
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
            // Auto-isi dari harga beli TERAKHIR barang ini (riwayat PO), kalau ada — tetap bisa diubah manual
            // di bawah kalau harga beli kali ini beda. Barang yang belum pernah dibeli via PO tetap 0.
            const lastPrice = lastPurchasePrices[Number(value)];
            items[index].price = lastPrice ?? 0;
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
    const selectClass =
        'w-full appearance-none rounded-md border border-[var(--border-strong)] bg-transparent px-3 py-2 text-sm text-[var(--subheading)] shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--ring)]';

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
                            <Label>{t('dashboardAdvance.inventoryPurchaseOrders.createModal.branchLabel')}</Label>
                            {isBranchManager ? (
                                <div className={`${selectClass} flex items-center bg-[var(--second-accent)] text-[var(--subheading)]`}>
                                    {lockedBranchName || '-'}
                                </div>
                            ) : (
                                <div className="relative">
                                    <select
                                        aria-label={t('dashboardAdvance.inventoryPurchaseOrders.createModal.branchAriaLabel')}
                                        value={data.branch_id}
                                        onChange={(e) => setData('branch_id', e.target.value)}
                                        className={selectClass}
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
                                    <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 !text-[var(--grey-text)]" />
                                </div>
                            )}
                            {errors.branch_id && <span className="text-sm text-[var(--danger)]">{errors.branch_id}</span>}
                        </div>
                        <div>
                            <Label>{t('dashboardAdvance.inventoryPurchaseOrders.createModal.supplierLabel')}</Label>
                            <div className="relative">
                                <select
                                    aria-label={t('dashboardAdvance.inventoryPurchaseOrders.createModal.supplierAriaLabel')}
                                    value={data.supplier_id}
                                    onChange={(e) => setData('supplier_id', e.target.value)}
                                    className={selectClass}
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
                                <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 !text-[var(--grey-text)]" />
                            </div>
                            {errors.supplier_id && <span className="text-sm text-[var(--danger)]">{errors.supplier_id}</span>}
                        </div>
                    </div>

                    <div>
                        <Label>{t('dashboardAdvance.inventoryPurchaseOrders.createModal.dateLabel')}</Label>
                        <Input
                            aria-label={t('dashboardAdvance.inventoryPurchaseOrders.createModal.dateLabel')}
                            type="date"
                            value={data.date}
                            onChange={(e) => setData('date', e.target.value)}
                        />
                        {errors.date && <span className="text-sm text-[var(--danger)]">{errors.date}</span>}
                    </div>

                    <div>
                        <div className="mb-2 flex items-center justify-between">
                            <Label className="mb-0">{t('dashboardAdvance.inventoryPurchaseOrders.createModal.itemsLabel')}</Label>
                            <button
                                type="button"
                                onClick={addItem}
                                className="flex items-center gap-1 text-sm font-medium text-[var(--secondary-600)] hover:underline"
                            >
                                <Plus className="h-4 w-4" /> {t('dashboardAdvance.inventoryPurchaseOrders.createModal.addItemButton')}
                            </button>
                        </div>

                        <div className="grid grid-cols-[1fr_72px_200px] gap-2 px-0.5">
                            <span className="text-xs font-medium text-[var(--grey-text)]">
                                {t('dashboardAdvance.inventoryPurchaseOrders.createModal.itemColumnLabel')}
                            </span>
                            <span className="text-xs font-medium text-[var(--grey-text)]">
                                {t('dashboardAdvance.inventoryPurchaseOrders.createModal.qtyColumnLabel')}
                            </span>
                            <span className="text-xs font-medium text-[var(--grey-text)]">
                                {t('dashboardAdvance.inventoryPurchaseOrders.createModal.priceColumnLabel')}
                            </span>
                            <span />
                        </div>

                        <div className="flex w-full flex-col gap-2">
                            {data.items.map((item, index) => {
                                const subtotal = item.quantity * item.price;
                                const hasLastPrice = item.inventory_item_id && lastPurchasePrices[Number(item.inventory_item_id)] !== undefined;
                                return (
                                    <div key={index} className="flex w-full flex-col gap-1">
                                        <div className="grid w-full grid-cols-[1fr_72px_200px] items-center gap-2">
                                            <div className="relative">
                                                <select
                                                    aria-label={t('dashboardAdvance.inventoryPurchaseOrders.createModal.itemColumnLabel')}
                                                    value={item.inventory_item_id}
                                                    onChange={(e) => updateItem(index, 'inventory_item_id', e.target.value)}
                                                    className={selectClass}
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
                                                <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 !text-[var(--grey-text)]" />
                                            </div>
                                            <Input
                                                aria-label={t('dashboardAdvance.inventoryPurchaseOrders.createModal.qtyColumnLabel')}
                                                type="number"
                                                min={1}
                                                value={item.quantity}
                                                onChange={(e) => updateItem(index, 'quantity', Number(e.target.value))}
                                                className="w-full"
                                            />
                                            <Input
                                                aria-label={t('dashboardAdvance.inventoryPurchaseOrders.createModal.priceColumnLabel')}
                                                type="number"
                                                min={0}
                                                value={item.price}
                                                onChange={(e) => updateItem(index, 'price', Number(e.target.value))}
                                                className="w-full"
                                            />
                                            {data.items.length > 1 ? (
                                                <button
                                                    type="button"
                                                    onClick={() => removeItem(index)}
                                                    aria-label={t('dashboardAdvance.inventoryPurchaseOrders.createModal.removeItemAriaLabel')}
                                                    className="flex h-8 w-7 items-center justify-center rounded-md border border-[var(--danger)]/30 text-[var(--danger)] hover:bg-[var(--danger-background)]"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            ) : (
                                                <div />
                                            )}
                                        </div>
                                        <div className="grid grid-cols-[1fr_72px_200px] gap-2">
                                            <p className="col-span-2 text-xs text-[var(--grey-text)]">
                                                {hasLastPrice
                                                    ? `${t('dashboardAdvance.inventoryPurchaseOrders.createModal.lastPricePrefix')} Rp ${lastPurchasePrices[Number(item.inventory_item_id)].toLocaleString('id-ID')}`
                                                    : ''}
                                            </p>
                                            <p className="text-right text-xs text-[var(--grey-text)]">
                                                {t('dashboardAdvance.inventoryPurchaseOrders.createModal.subtotalPrefix')} Rp{' '}
                                                {subtotal.toLocaleString('id-ID')}
                                            </p>
                                            <span />
                                        </div>
                                    </div>
                                );
                            })}
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
