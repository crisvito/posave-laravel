import { Button } from '@/components';
import { useLanguage } from '@/hooks';
import { X } from 'lucide-react';
import type { InventoryItem } from './inventory-item-actions-menu';

interface InventoryItemDetailModalProps {
    item: InventoryItem;
    canSeeCost: boolean;
    onClose: () => void;
}

export function InventoryItemDetailModal({ item, onClose }: InventoryItemDetailModalProps) {
    const { t } = useLanguage();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-md rounded-2xl bg-[var(--card)] p-6 shadow-xl">
                <div className="mb-5 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-[var(--subheading)]">{t('dashboardAdvance.inventoryItems.detailModal.title')}</h3>
                    <button onClick={onClose} aria-label={t('dashboardAdvance.inventoryItems.detailModal.closeAriaLabel')}>
                        <X className="h-5 w-5 text-[var(--grey-text)] hover:text-[var(--subheading)]" />
                    </button>
                </div>

                {item.image && (
                    <div className="mb-4 flex justify-center">
                        <img src={`/storage/${item.image}`} alt={item.name} className="h-32 w-32 rounded-xl object-cover" />
                    </div>
                )}

                <div className="flex flex-col gap-4">
                    <div>
                        <span className="block text-sm font-medium text-[var(--grey-text)]">
                            {t('dashboardAdvance.inventoryItems.detailModal.nameLabel')}
                        </span>
                        <span className="text-base font-semibold text-[var(--subheading)]">{item.name}</span>
                    </div>
                    <div>
                        <span className="block text-sm font-medium text-[var(--grey-text)]">
                            {t('dashboardAdvance.inventoryItems.detailModal.skuLabel')}
                        </span>
                        <span className="text-base text-[var(--subheading)]">{item.sku}</span>
                    </div>
                    <div>
                        <span className="block text-sm font-medium text-[var(--grey-text)]">
                            {t('dashboardAdvance.inventoryItems.detailModal.categoryLabel')}
                        </span>
                        <span
                            className="mt-1 inline-block rounded-full px-3 py-1 text-xs font-medium"
                            style={{
                                backgroundColor: `${item.category.color ?? '#94a3b8'}1a`,
                                color: item.category.color ?? '#94a3b8',
                            }}
                        >
                            {item.category.name}
                        </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <span className="block text-sm font-medium text-[var(--grey-text)]">
                                {t('dashboardAdvance.inventoryItems.detailModal.currentStockLabel')}
                            </span>
                            <span className="text-base text-[var(--subheading)]">{item.current_stock}</span>
                        </div>
                        <div>
                            <span className="block text-sm font-medium text-[var(--grey-text)]">
                                {t('dashboardAdvance.inventoryItems.detailModal.minStockLabel')}
                            </span>
                            <span className="text-base text-[var(--subheading)]">{item.min_stock}</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <span className="block text-sm font-medium text-[var(--grey-text)]">
                                {t('dashboardAdvance.inventoryItems.detailModal.priceLabel')}
                            </span>
                            <span className="text-base text-[var(--subheading)]">Rp {Number(item.price).toLocaleString('id-ID')}</span>
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex justify-end">
                    <Button variant="outline" onClick={onClose}>
                        {t('dashboardAdvance.inventoryItems.detailModal.closeButton')}
                    </Button>
                </div>
            </div>
        </div>
    );
}
