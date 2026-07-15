import { Button } from '@/components';
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
        'w-full rounded-md border border-[var(--border-strong)] bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--ring)] dark:text-white';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-lg rounded-2xl bg-[var(--neutral-white)] p-6 shadow-xl dark:border dark:border-[var(--border-strong)] dark:bg-[var(--card)]">
                <div className="mb-5 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-[var(--subheading)] dark:text-white">Buat PO Baru</h3>
                    <button
                        type="button"
                        onClick={() => {
                            reset();
                            onClose();
                        }}
                        aria-label="Tutup"
                    >
                        <X className="h-5 w-5 text-[var(--grey-text)] hover:text-[var(--subheading)] dark:hover:text-white" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="-mx-1 flex max-h-[70vh] flex-col gap-4 overflow-y-auto px-1">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-[var(--subheading)] dark:text-white">Cabang</label>
                            {isBranchManager ? (
                                <div className={`${inputClass} flex items-center bg-[var(--second-accent)] text-[var(--subheading)]`}>
                                    {lockedBranchName || '-'}
                                </div>
                            ) : (
                                <div className="relative">
                                    <select
                                        aria-label="Pilih cabang"
                                        value={data.branch_id}
                                        onChange={(e) => setData('branch_id', e.target.value)}
                                        className={`${inputClass} appearance-none`}
                                    >
                                        <option value="" disabled className="dark:bg-[var(--card)]">
                                            Pilih cabang
                                        </option>
                                        {branches.map((b) => (
                                            <option key={b.id} value={b.id} className="dark:bg-[var(--card)]">
                                                {b.name}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                </div>
                            )}
                            {errors.branch_id && <span className="text-sm text-red-500">{errors.branch_id}</span>}
                        </div>
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-[var(--subheading)] dark:text-white">Pemasok</label>
                            <div className="relative">
                                <select
                                    aria-label="Pilih pemasok"
                                    value={data.supplier_id}
                                    onChange={(e) => setData('supplier_id', e.target.value)}
                                    className={`${inputClass} appearance-none`}
                                >
                                    <option value="" disabled className="dark:bg-[var(--card)]">
                                        Pilih pemasok
                                    </option>
                                    {suppliers.map((s) => (
                                        <option key={s.id} value={s.id} className="dark:bg-[var(--card)]">
                                            {s.name}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            </div>
                            {errors.supplier_id && <span className="text-sm text-red-500">{errors.supplier_id}</span>}
                        </div>
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-[var(--subheading)] dark:text-white">Tanggal PO</label>
                        <input type="date" value={data.date} onChange={(e) => setData('date', e.target.value)} className={inputClass} />
                        {errors.date && <span className="text-sm text-red-500">{errors.date}</span>}
                    </div>

                    <div>
                        <div className="mb-2 flex items-center justify-between">
                            <label className="text-sm font-medium text-[var(--subheading)] dark:text-white">Barang</label>
                            <button
                                type="button"
                                onClick={addItem}
                                className="flex items-center gap-1 text-sm font-medium text-[var(--bright-accent)] hover:underline"
                            >
                                <Plus className="h-4 w-4" /> Tambah Barang
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
                                        <option value="" disabled className="dark:bg-[var(--card)]">
                                            Pilih barang
                                        </option>
                                        {inventoryItems.map((i) => (
                                            <option key={i.id} value={i.id} className="dark:bg-[var(--card)]">
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
                                        placeholder="Qty"
                                    />
                                    <input
                                        type="number"
                                        min={0}
                                        value={item.price}
                                        onChange={(e) => updateItem(index, 'price', Number(e.target.value))}
                                        className={`${inputClass} w-28`}
                                        placeholder="Harga"
                                    />
                                    {data.items.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeItem(index)}
                                            className="rounded-md p-1 hover:bg-red-50 dark:hover:bg-red-900/30"
                                        >
                                            <Trash2 className="h-5 w-5 text-red-500" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                        {errors.items && <span className="text-sm text-red-500">{errors.items}</span>}
                    </div>

                    <div className="mt-2 flex items-center justify-between rounded-lg bg-[var(--page-bg)] px-4 py-3 dark:bg-[var(--second-accent)]">
                        <span className="text-sm font-medium text-[var(--subheading)] dark:text-white">Total Harga</span>
                        <span className="text-base font-bold text-[var(--subheading)] dark:text-white">Rp {totalPrice.toLocaleString('id-ID')}</span>
                    </div>

                    <div className="mt-2 flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                reset();
                                onClose();
                            }}
                            className="dark:text-white"
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="bg-[var(--surface-header)] text-white hover:bg-[var(--surface-header-hover)] dark:bg-white dark:text-black dark:hover:bg-gray-200"
                        >
                            {processing ? 'Menyimpan...' : 'Buat PO'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
