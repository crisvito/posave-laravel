import { DropdownActionMenu } from '@/components';
import { useLanguage } from '@/hooks';
import { Eye, Pencil, Trash2 } from 'lucide-react';

interface InventoryCategory {
    id: number;
    name: string;
    color: string | null;
    items_count: number;
}

export interface InventoryItem {
    id: number;
    name: string;
    sku: string;
    category_id: number;
    category: InventoryCategory;
    image: string | null;
    min_stock: number;
    current_stock: number;
    price: number;
    cost: number;
}

interface InventoryItemActionsMenuProps {
    item: InventoryItem;
    position: { top: number; left: number };
    onClose: () => void;
    onView: (item: InventoryItem) => void;
    onEdit: (item: InventoryItem) => void;
    onDelete: (id: number) => void;
}

export function InventoryItemActionsMenu({ item, position, onClose, onView, onEdit, onDelete }: InventoryItemActionsMenuProps) {
    const { t } = useLanguage();

    return (
        <DropdownActionMenu
            position={position}
            onClose={onClose}
            items={[
                {
                    label: t('dashboardAdvance.inventoryItems.actionsMenu.view'),
                    icon: Eye,
                    onClick: () => onView(item),
                    variant: 'default',
                },
                {
                    label: t('dashboardAdvance.inventoryItems.actionsMenu.edit'),
                    icon: Pencil,
                    onClick: () => onEdit(item),
                    variant: 'warning',
                },
                {
                    label: t('dashboardAdvance.inventoryItems.actionsMenu.delete'),
                    icon: Trash2,
                    onClick: () => onDelete(item.id),
                    variant: 'danger',
                },
            ]}
        />
    );
}
