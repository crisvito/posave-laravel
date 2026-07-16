import { Button, Input, Label } from '@/components';
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
    branches: BranchOption[];
    myBranchId: number | null;
    isBranchManager: boolean;
    onClose: () => void;
}

export function InventoryTransferCreateModal({ inventoryItems, branches, myBranchId, isBranchManager, onClose }: InventoryTransferCreateModalProps) {
    const [direction, setDirection] = React.useState<'send' | 'receive'>('send');

    const { data, setData, post, processing, errors, reset } = useForm({
        branch_id: isBranchManager && myBranchId ? String(myBranchId) : '',
        sender_branch_id: isBranchManager && direction === 'send' ? String(myBranchId) : '',
        receiver_branch_id: isBranchManager && direction === 'receive' ? String(myBranchId) : '',
        date: new Date().toISOString().slice(0, 10),
        items: [{ inventory_item_id: '', quantity: 1 }] as { inventory_item_id: string; quantity: number }[],
    });

    const handleDirectionChange = (dir: 'send' | 'receive') => {
        setDirection(dir);
        if (dir === 'send') {
            setData((prev) => ({ ...prev, sender_branch_id: String(myBranchId), receiver_branch_id: '' }));
        } else {
            setData((prev) => ({ ...prev, sender_branch_id: '', receiver_branch_id: String(myBranchId) }));
        }
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
        'w-full appearance-none rounded-md border border-[var(--border-strong)] bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--ring)] dark:text-white';
    const lockedBranchName = branches.find((b) => b.id === myBranchId)?.name ?? '';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-lg rounded-2xl bg-[var(--neutral-white)] p-6 shadow-xl dark:border dark:border-[var(--border-strong)] dark:bg-[var(--card)]">
                <div className="mb-5 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-[var(--subheading)] dark:text-white">Buat Kiriman Baru</h3>
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
                    {isBranchManager ? (
                        <>
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    type="button"
                                    onClick={() => handleDirectionChange('send')}
                                    className={`rounded-lg border-2 px-3 py-2 text-sm font-semibold transition ${
                                        direction === 'send'
                                            ? 'border-[var(--surface-header)] bg-[var(--second-accent)] dark:bg-[var(--second-accent)] dark:text-white'
                                            : 'border-[var(--border-strong)] text-[var(--grey-text)]'
                                    }`}
                                >
                                    Kirim ke cabang lain
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleDirectionChange('receive')}
                                    className={`rounded-lg border-2 px-3 py-2 text-sm font-semibold transition ${
                                        direction === 'receive'
                                            ? 'border-[var(--surface-header)] bg-[var(--second-accent)] dark:bg-[var(--second-accent)] dark:text-white'
                                            : 'border-[var(--border-strong)] text-[var(--grey-text)]'
                                    }`}
                                >
                                    Minta dari cabang lain
                                </button>
                            </div>

                            <div className="flex items-center gap-2 rounded-lg bg-[var(--second-accent)] px-3 py-2.5 text-sm dark:text-white">
                                <span className="font-semibold text-[var(--subheading)] dark:text-white">{lockedBranchName || 'Cabang saya'}</span>
                                <ArrowRight className="h-4 w-4 text-[var(--grey-text)]" />
                                <div className="relative flex-1">
                                    <select
                                        value={direction === 'send' ? data.receiver_branch_id : data.sender_branch_id}
                                        onChange={(e) =>
                                            direction === 'send'
                                                ? setData('receiver_branch_id', e.target.value)
                                                : setData('sender_branch_id', e.target.value)
                                        }
                                        className={`${inputClass} bg-white dark:bg-[var(--card)]`}
                                    >
                                        <option value="" disabled>
                                            Pilih cabang
                                        </option>
                                        {branches
                                            .filter((b) => b.id !== myBranchId)
                                            .map((b) => (
                                                <option key={b.id} value={b.id}>
                                                    {b.name}
                                                </option>
                                            ))}
                                    </select>
                                    <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-[var(--subheading)] dark:text-white">Cabang Pengirim</label>
                                <div className="relative">
                                    <select
                                        value={data.sender_branch_id}
                                        onChange={(e) => setData('sender_branch_id', e.target.value)}
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
                            </div>
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-[var(--subheading)] dark:text-white">Cabang Penerima</label>
                                <div className="relative">
                                    <select
                                        value={data.receiver_branch_id}
                                        onChange={(e) => setData('receiver_branch_id', e.target.value)}
                                        className={`${inputClass} appearance-none`}
                                    >
                                        <option value="" disabled className="dark:bg-[var(--card)]">
                                            Pilih cabang
                                        </option>
                                        {branches
                                            .filter((b) => String(b.id) !== data.sender_branch_id)
                                            .map((b) => (
                                                <option key={b.id} value={b.id} className="dark:bg-[var(--card)]">
                                                    {b.name}
                                                </option>
                                            ))}
                                    </select>
                                    <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                </div>
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-[var(--subheading)] dark:text-white">Tanggal</label>
                        <input type="date" value={data.date} onChange={(e) => setData('date', e.target.value)} className={inputClass} />
                    </div>

                    <div>
                        <div className="mb-2 flex items-center justify-between">
                            <Label>Barang</Label>
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
                                    <Input
                                        type="number"
                                        min={1}
                                        value={item.quantity}
                                        onChange={(e) => updateItem(index, 'quantity', Number(e.target.value))}
                                        placeholder="Qty"
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
                            {processing ? 'Mengirim...' : 'Kirim Permintaan'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
