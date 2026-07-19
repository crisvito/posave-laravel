import { DropdownActionMenu } from '@/components';
import { useLanguage } from '@/hooks';
import { Trash2 } from 'lucide-react';

export interface Adjustment {
    id: number;
    date: string;
    note: string;
    item: { name: string; sku: string };
    qty_change: number;
    financial_change: number;
}

interface InventoryAdjustmentActionsMenuProps {
    adjustment: Adjustment;
    position: { top: number; left: number };
    onClose: () => void;
    onDelete: (id: number) => void;
}

export function InventoryAdjustmentActionsMenu({ adjustment, position, onClose, onDelete }: InventoryAdjustmentActionsMenuProps) {
    const { t } = useLanguage();

    return (
        <DropdownActionMenu
            position={position}
            onClose={onClose}
            items={[
                {
                    label: t('dashboardAdvance.inventoryAdjustments.actionsMenu.delete'),
                    icon: Trash2,
                    onClick: () => onDelete(adjustment.id),
                    variant: 'danger',
                },
            ]}
        />
    );
}
