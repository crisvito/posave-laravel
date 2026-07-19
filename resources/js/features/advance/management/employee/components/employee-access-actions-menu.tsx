import { DropdownActionMenu } from '@/components';
import { useLanguage } from '@/hooks';
import { Pencil, Trash2 } from 'lucide-react';

export interface EmployeeAccess {
    id: number;
    name: string;
    employees_count: number;
}

interface EmployeeAccessActionsMenuProps {
    access: EmployeeAccess;
    position: { top: number; left: number };
    onClose: () => void;
    onEdit: (access: EmployeeAccess) => void;
    onDelete: (id: number) => void;
}

export function EmployeeAccessActionsMenu({ access, position, onClose, onEdit, onDelete }: EmployeeAccessActionsMenuProps) {
    const { t } = useLanguage();

    return (
        <DropdownActionMenu
            position={position}
            onClose={onClose}
            items={[
                { label: t('dashboardAdvance.employeeAccess.actionsMenu.edit'), icon: Pencil, onClick: () => onEdit(access) },
                {
                    label: t('dashboardAdvance.employeeAccess.actionsMenu.delete'),
                    icon: Trash2,
                    onClick: () => onDelete(access.id),
                    variant: 'danger',
                },
            ]}
        />
    );
}
