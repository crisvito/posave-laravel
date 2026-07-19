import { DropdownActionMenu } from '@/components';
import { useLanguage } from '@/hooks';
import { CheckCircle2, Trash2, XCircle } from 'lucide-react';

export interface PurchaseOrder {
    id: number;
    po_number: string;
    branch: { id: number; name: string };
    date: string;
    total_price: number;
    status: 'waiting_fulfilment' | 'success' | 'cancelled';
    items_count: number;
    supplier: { id: number; name: string };
}

interface InventoryPurchaseOrderActionsMenuProps {
    purchaseOrder: PurchaseOrder;
    position: { top: number; left: number };
    onClose: () => void;
    onUpdateStatus: (id: number, status: 'success' | 'cancelled') => void;
    onDelete: (id: number) => void;
}

export function InventoryPurchaseOrderActionsMenu({
    purchaseOrder,
    position,
    onClose,
    onUpdateStatus,
    onDelete,
}: InventoryPurchaseOrderActionsMenuProps) {
    const { t } = useLanguage();

    const items = [
        ...(purchaseOrder.status === 'waiting_fulfilment'
            ? [
                  {
                      label: t('dashboardAdvance.inventoryPurchaseOrders.actionsMenu.markSuccess'),
                      icon: CheckCircle2,
                      onClick: () => onUpdateStatus(purchaseOrder.id, 'success'),
                      variant: 'success' as const,
                  },
                  {
                      label: t('dashboardAdvance.inventoryPurchaseOrders.actionsMenu.cancelOrder'),
                      icon: XCircle,
                      onClick: () => onUpdateStatus(purchaseOrder.id, 'cancelled'),
                      variant: 'warning' as const,
                  },
              ]
            : []),
        {
            label: t('dashboardAdvance.inventoryPurchaseOrders.actionsMenu.delete'),
            icon: Trash2,
            onClick: () => onDelete(purchaseOrder.id),
            variant: 'danger' as const,
        },
    ];

    return <DropdownActionMenu position={position} onClose={onClose} items={items} width="w-44" />;
}
