import { Button } from '@/components';
import { X } from 'lucide-react';
import type { InventoryItem } from './inventory-item-actions-menu';

interface InventoryItemDetailModalProps {
    item: InventoryItem;
    onClose: () => void;
}

export function InventoryItemDetailModal({ item, onClose }: InventoryItemDetailModalProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-md rounded-2xl bg-[var(--neutral-white)] p-6 shadow-xl dark:border dark:border-[var(--border-strong)] dark:bg-[var(--card)]">
                <div className="mb-5 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-[var(--subheading)] dark:text-white">Detail Barang</h3>
                    <button onClick={onClose} aria-label="Tutup modal detail">
                        <X className="h-5 w-5 text-[var(--grey-text)] hover:text-[var(--subheading)] dark:hover:text-white" />
                    </button>
                </div>

                {item.image && (
                    <div className="mb-4 flex justify-center">
                        <img src={`/storage/${item.image}`} alt={item.name} className="h-32 w-32 rounded-xl object-cover" />
                    </div>
                )}

                <div className="flex flex-col gap-4">
                    <div>
                        <span className="block text-sm font-medium text-[var(--grey-text)] dark:text-[var(--muted-foreground)]">Nama Barang</span>
                        <span className="text-base font-semibold text-[var(--subheading)] dark:text-white">{item.name}</span>
                    </div>
                    <div>
                        <span className="block text-sm font-medium text-[var(--grey-text)] dark:text-[var(--muted-foreground)]">SKU</span>
                        <span className="text-base text-[var(--subheading)] dark:text-white">{item.sku}</span>
                    </div>
                    <div>
                        <span className="block text-sm font-medium text-[var(--grey-text)] dark:text-[var(--muted-foreground)]">Kategori</span>
                        <span
                            className="mt-1 inline-block rounded-full px-3 py-1 text-xs font-medium"
                            style={{
                                backgroundColor: `${item.category.color ?? '#94a3b8'}1a`,
                                color: item.category.color ?? '#64748b',
                            }}
                        >
                            {item.category.name}
                        </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <span className="block text-sm font-medium text-[var(--grey-text)] dark:text-[var(--muted-foreground)]">
                                Stok Saat Ini
                            </span>
                            <span className="text-base text-[var(--subheading)] dark:text-white">{item.current_stock}</span>
                        </div>
                        <div>
                            <span className="block text-sm font-medium text-[var(--grey-text)] dark:text-[var(--muted-foreground)]">
                                Stok Minimum
                            </span>
                            <span className="text-base text-[var(--subheading)] dark:text-white">{item.min_stock}</span>
                        </div>
                    </div>
                    <div>
                        <span className="block text-sm font-medium text-[var(--grey-text)] dark:text-[var(--muted-foreground)]">Harga</span>
                        <span className="text-base text-[var(--subheading)] dark:text-white">Rp {Number(item.price).toLocaleString('id-ID')}</span>
                    </div>
                </div>

                <div className="mt-6 flex justify-end">
                    <Button variant="outline" onClick={onClose} className="dark:text-white">
                        Tutup
                    </Button>
                </div>
            </div>
        </div>
    );
}
