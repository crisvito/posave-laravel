import { DropdownActionMenu } from '@/components';
import { useLanguage } from '@/hooks';
import { Pencil, Trash2 } from 'lucide-react';

export interface InventoryCategory {
    id: number;
    name: string;
    color: string | null;
    items_count: number;
}

interface InventoryCategoryActionsMenuProps {
    category: InventoryCategory;
    position: { top: number; left: number };
    onClose: () => void;
    onEdit: (category: InventoryCategory) => void;
    onDelete: (id: number) => void;
}

export function InventoryCategoryActionsMenu({ category, position, onClose, onEdit, onDelete }: InventoryCategoryActionsMenuProps) {
    const { t } = useLanguage();

    return (
        <DropdownActionMenu
            position={position}
            onClose={onClose}
            items={[
                { label: t('dashboardAdvance.inventoryCategories.actionsMenu.edit'), icon: Pencil, onClick: () => onEdit(category) },
                {
                    label: t('dashboardAdvance.inventoryCategories.actionsMenu.delete'),
                    icon: Trash2,
                    onClick: () => onDelete(category.id),
                    variant: 'danger',
                },
            ]}
        />
    );
}
