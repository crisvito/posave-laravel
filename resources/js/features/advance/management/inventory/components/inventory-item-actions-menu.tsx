import { DropdownActionMenu } from '@/components';
import { useLanguage } from '@/hooks';
import { Eye, Pencil, Power } from 'lucide-react';

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
    is_active: boolean;
}

interface InventoryItemActionsMenuProps {
    item: InventoryItem;
    position: { top: number; left: number };
    onClose: () => void;
    onView: (item: InventoryItem) => void;
    onEdit: (item: InventoryItem) => void;
    onToggleActive: (item: InventoryItem) => void;
}

export function InventoryItemActionsMenu({ item, position, onClose, onView, onEdit, onToggleActive }: InventoryItemActionsMenuProps) {
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
                    label: item.is_active
                        ? t('dashboardAdvance.inventoryItems.actionsMenu.deactivate')
                        : t('dashboardAdvance.inventoryItems.actionsMenu.activate'),
                    icon: Power,
                    onClick: () => onToggleActive(item),
                    variant: item.is_active ? 'danger' : 'success',
                },
            ]}
        />
    );
}
