import { Button, Input, Label } from '@/components';
import { useLanguage } from '@/hooks';
import { useForm } from '@inertiajs/react';
import { ArrowRight, ChevronDown, Plus, Trash2, X } from 'lucide-react';
import React from 'react';

interface BranchOption {
    id: number;
    name: string;
}
interface InventoryItemOption {
    id: number;
    name: string;
    sku: string;
}

interface InventoryTransferCreateModalProps {
    inventoryItems: InventoryItemOption[];
    branchStocks: Record<number, Record<number, number>>;
    branches: BranchOption[];
    myBranchId: number | null;
    isBranchManager: boolean;
    onClose: () => void;
}

export function InventoryTransferCreateModal({
    inventoryItems,
    branchStocks,
    branches,
    myBranchId,
    isBranchManager,
    onClose,
}: InventoryTransferCreateModalProps) {
    const { t } = useLanguage();
    const [direction, setDirection] = React.useState<'send' | 'receive'>('send');

    const { data, setData, post, processing, errors, reset } = useForm({
        branch_id: isBranchManager && myBranchId ? String(myBranchId) : '',
        sender_branch_id: isBranchManager && direction === 'send' ? String(myBranchId) : '',
        receiver_branch_id: isBranchManager && direction === 'receive' ? String(myBranchId) : '',
        date: new Date().toISOString().slice(0, 10),
        items: [{ inventory_item_id: '', quantity: 1 }] as { inventory_item_id: string; quantity: number }[],
    });

    // Stok barang di cabang PENGIRIM yang lagi aktif — ini yang membatasi berapa banyak
    // barang boleh dikirim. Berubah otomatis kalau cabang pengirim diganti.
    const senderStocks = branchStocks[Number(data.sender_branch_id)] ?? {};

    const getStockFor = (itemId: string) => (itemId ? (senderStocks[Number(itemId)] ?? 0) : Infinity);

    const handleDirectionChange = (dir: 'send' | 'receive') => {
        setDirection(dir);
        if (dir === 'send') {
            setData((prev) => ({ ...prev, sender_branch_id: String(myBranchId), receiver_branch_id: '' }));
        } else {
            setData((prev) => ({ ...prev, sender_branch_id: '', receiver_branch_id: String(myBranchId) }));
        }
    };

    const handleSenderBranchChange = (branchId: string) => {
        const newStocks = branchStocks[Number(branchId)] ?? {};
        // Cabang pengirim ganti -> sisa stok tiap barang bisa beda. Clamp quantity yang udah
        // diisi biar gak lebih dari stok yang tersedia di cabang baru.
        const clampedItems = data.items.map((item) => {
            const max = item.inventory_item_id ? (newStocks[Number(item.inventory_item_id)] ?? 0) : Infinity;
            return { ...item, quantity: Math.min(item.quantity, Math.max(max, 1)) };
        });
        setData((prev) => ({ ...prev, sender_branch_id: branchId, items: clampedItems }));
    };

    const addItem = () => setData('items', [...data.items, { inventory_item_id: '', quantity: 1 }]);
    const removeItem = (index: number) =>
        setData(
            'items',
            data.items.filter((_, i) => i !== index),
        );
    const updateItem = (index: number, field: 'inventory_item_id' | 'quantity', value: string | number) => {
        const items = [...data.items];
        items[index] = { ...items[index], [field]: value };

        if (field === 'inventory_item_id') {
            // Barang baru dipilih -> clamp quantity ke stok yang tersedia buat barang itu.
            const max = getStockFor(String(value));
            items[index].quantity = Math.min(items[index].quantity, Math.max(max, 1));
        } else if (field === 'quantity') {
            const max = getStockFor(items[index].inventory_item_id);
            items[index].quantity = Math.min(Number(value), Math.max(max, 1));
        }

        setData('items', items);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('dashboard.inventory.transfers.store'), {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    const inputClass =
        'w-full appearance-none rounded-md border border-[var(--border-strong)] bg-transparent px-3 py-2 text-sm text-[var(--subheading)] shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--ring)]';
    const lockedBranchName = branches.find((b) => b.id === myBranchId)?.name ?? '';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-lg rounded-2xl bg-[var(--card)] p-6 shadow-xl">
                <div className="mb-5 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-[var(--subheading)]">{t('dashboardAdvance.inventoryTransfers.createModal.title')}</h3>
                    <Button
                        type="button"
                        onClick={() => {
                            reset();
                            onClose();
                        }}
                        aria-label={t('dashboardAdvance.inventoryTransfers.createModal.closeAriaLabel')}
                        variant="outline"
                    >
                        <X className="h-5 w-5 text-[var(--grey-text)] hover:text-[var(--subheading)]" />
                    </Button>
                </div>

                <form onSubmit={handleSubmit} className="-mx-1 flex max-h-[70vh] flex-col gap-4 overflow-y-auto px-1">
                    {isBranchManager ? (
                        <>
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    type="button"
                                    onClick={() => handleDirectionChange('send')}
                                    className={`rounded-lg border-2 px-3 py-2 text-sm font-semibold transition ${
                                        direction === 'send'
                                            ? 'border-[var(--surface-header)] bg-[var(--second-accent)] text-[var(--subheading)]'
                                            : 'border-[var(--border-strong)] text-[var(--grey-text)]'
                                    }`}
                                >
                                    {t('dashboardAdvance.inventoryTransfers.createModal.sendDirectionLabel')}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleDirectionChange('receive')}
                                    className={`rounded-lg border-2 px-3 py-2 text-sm font-semibold transition ${
                                        direction === 'receive'
                                            ? 'border-[var(--surface-header)] bg-[var(--second-accent)] text-[var(--subheading)]'
                                            : 'border-[var(--border-strong)] text-[var(--grey-text)]'
                                    }`}
                                >
                                    {t('dashboardAdvance.inventoryTransfers.createModal.receiveDirectionLabel')}
                                </button>
                            </div>

                            <div className="flex items-center gap-2 rounded-lg bg-[var(--second-accent)] px-3 py-2.5 text-sm text-[var(--subheading)]">
                                <span className="font-semibold text-[var(--subheading)]">
                                    {lockedBranchName || t('dashboardAdvance.inventoryTransfers.createModal.myBranchFallback')}
                                </span>
                                <ArrowRight className="h-4 w-4 text-[var(--grey-text)]" />
                                <div className="relative flex-1">
                                    <select
                                        value={direction === 'send' ? data.receiver_branch_id : data.sender_branch_id}
                                        onChange={(e) =>
                                            direction === 'send'
                                                ? setData('receiver_branch_id', e.target.value)
                                                : handleSenderBranchChange(e.target.value)
                                        }
                                        className={`${inputClass} bg-[var(--card)]`}
                                    >
                                        <option value="" disabled>
                                            {t('dashboardAdvance.inventoryTransfers.createModal.branchPlaceholder')}
                                        </option>
                                        {branches
                                            .filter((b) => b.id !== myBranchId)
                                            .map((b) => (
                                                <option key={b.id} value={b.id}>
                                                    {b.name}
                                                </option>
                                            ))}
                                    </select>
                                    <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-[var(--grey-text-muted)]" />
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-[var(--subheading)]">
                                    {t('dashboardAdvance.inventoryTransfers.createModal.senderBranchLabel')}
                                </label>
                                <div className="relative">
                                    <select
                                        value={data.sender_branch_id}
                                        onChange={(e) => handleSenderBranchChange(e.target.value)}
                                        className={`${inputClass} appearance-none`}
                                    >
                                        <option value="" disabled className="bg-[var(--card)]">
                                            {t('dashboardAdvance.inventoryTransfers.createModal.branchPlaceholder')}
                                        </option>
                                        {branches.map((b) => (
                                            <option key={b.id} value={b.id} className="bg-[var(--card)]">
                                                {b.name}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-[var(--grey-text-muted)]" />
                                </div>
                            </div>
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-[var(--subheading)]">
                                    {t('dashboardAdvance.inventoryTransfers.createModal.receiverBranchLabel')}
                                </label>
                                <div className="relative">
                                    <select
                                        value={data.receiver_branch_id}
                                        onChange={(e) => setData('receiver_branch_id', e.target.value)}
                                        className={`${inputClass} appearance-none`}
                                    >
                                        <option value="" disabled className="bg-[var(--card)]">
                                            {t('dashboardAdvance.inventoryTransfers.createModal.branchPlaceholder')}
                                        </option>
                                        {branches
                                            .filter((b) => String(b.id) !== data.sender_branch_id)
                                            .map((b) => (
                                                <option key={b.id} value={b.id} className="bg-[var(--card)]">
                                                    {b.name}
                                                </option>
                                            ))}
                                    </select>
                                    <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-[var(--grey-text-muted)]" />
                                </div>
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-[var(--subheading)]">
                            {t('dashboardAdvance.inventoryTransfers.createModal.dateLabel')}
                        </label>
                        <input type="date" value={data.date} onChange={(e) => setData('date', e.target.value)} className={inputClass} />
                    </div>

                    <div>
                        <div className="mb-2 flex items-center justify-between">
                            <Label>{t('dashboardAdvance.inventoryTransfers.createModal.itemsLabel')}</Label>
                            <button
                                type="button"
                                onClick={addItem}
                                className="flex items-center gap-1 text-sm font-medium text-[var(--secondary-600)] hover:underline"
                            >
                                <Plus className="h-4 w-4" /> {t('dashboardAdvance.inventoryTransfers.createModal.addItemButton')}
                            </button>
                        </div>

                        {!data.sender_branch_id && (
                            <p className="mb-2 text-xs text-[var(--grey-text)]">
                                {t('dashboardAdvance.inventoryTransfers.createModal.selectSenderFirstHint')}
                            </p>
                        )}

                        <div className="flex flex-col gap-2">
                            {data.items.map((item, index) => {
                                const stock = getStockFor(item.inventory_item_id);
                                return (
                                    <div key={index} className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2">
                                            <div className="relative flex-1">
                                                <select
                                                    value={item.inventory_item_id}
                                                    onChange={(e) => updateItem(index, 'inventory_item_id', e.target.value)}
                                                    className={`${inputClass} appearance-none`}
                                                >
                                                    <option value="" disabled className="bg-[var(--card)]">
                                                        {t('dashboardAdvance.inventoryTransfers.createModal.itemPlaceholder')}
                                                    </option>
                                                    {inventoryItems.map((i) => {
                                                        const itemStock = senderStocks[i.id] ?? 0;
                                                        return (
                                                            <option
                                                                key={i.id}
                                                                value={i.id}
                                                                disabled={!!data.sender_branch_id && itemStock <= 0}
                                                                className="bg-[var(--card)]"
                                                            >
                                                                {i.name} ({i.sku}){' '}
                                                                {data.sender_branch_id
                                                                    ? `- ${t('dashboardAdvance.inventoryTransfers.createModal.stockRemainingPrefix')} ${itemStock}`
                                                                    : ''}
                                                            </option>
                                                        );
                                                    })}
                                                </select>
                                                <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 !text-[var(--grey-text)]" />
                                            </div>
                                            <Input
                                                type="number"
                                                min={1}
                                                max={stock === Infinity ? undefined : stock}
                                                value={item.quantity}
                                                onChange={(e) => updateItem(index, 'quantity', Number(e.target.value))}
                                                placeholder={t('dashboardAdvance.inventoryTransfers.createModal.qtyPlaceholder')}
                                                className="w-24 shrink-0"
                                            />
                                            {data.items.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeItem(index)}
                                                    aria-label={t('dashboardAdvance.inventoryTransfers.createModal.removeItemAriaLabel')}
                                                    className="shrink-0 rounded-md p-1 hover:bg-[var(--danger-background)]"
                                                >
                                                    <Trash2 className="h-5 w-5 text-[var(--danger)]" />
                                                </button>
                                            )}
                                        </div>
                                        {item.inventory_item_id && data.sender_branch_id && (
                                            <p className="pr-9 text-right text-xs text-[var(--grey-text)]">
                                                {t('dashboardAdvance.inventoryTransfers.createModal.stockRemainingPrefix')} {stock}
                                            </p>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                        {errors.items && <span className="text-sm text-[var(--danger)]">{errors.items}</span>}
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
                            {t('dashboardAdvance.inventoryTransfers.createModal.cancel')}
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="bg-[var(--surface-header)] text-white hover:bg-[var(--surface-header-hover)]"
                        >
                            {processing
                                ? t('dashboardAdvance.inventoryTransfers.createModal.submitting')
                                : t('dashboardAdvance.inventoryTransfers.createModal.submitLabel')}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
