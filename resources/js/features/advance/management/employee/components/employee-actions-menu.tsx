import { DropdownActionMenu } from '@/components';
import { useLanguage } from '@/hooks';
import { Eye, Pencil, Power } from 'lucide-react';

export interface Employee {
    id: number;
    name: string;
    role: string;
    branch_id: number | null;
    branch: { id: number; name: string } | null;
    active_date: string;
    slot_status: string;
    is_active: boolean;
    user?: { id: number; email: string };
}

interface EmployeeActionsMenuProps {
    employee: Employee;
    position: { top: number; left: number };
    onClose: () => void;
    onView: (employee: Employee) => void;
    onEdit: (employee: Employee) => void;
    onToggleActive: (employee: Employee) => void;
}

export function EmployeeActionsMenu({ employee, position, onClose, onView, onEdit, onToggleActive }: EmployeeActionsMenuProps) {
    const { t } = useLanguage();

    return (
        <DropdownActionMenu
            position={position}
            onClose={onClose}
            items={[
                { label: t('dashboardAdvance.employees.actionsMenu.view'), icon: Eye, onClick: () => onView(employee) },
                { label: t('dashboardAdvance.employees.actionsMenu.edit'), icon: Pencil, onClick: () => onEdit(employee), variant: 'warning' },
                {
                    label: employee.is_active
                        ? t('dashboardAdvance.employees.actionsMenu.deactivate')
                        : t('dashboardAdvance.employees.actionsMenu.activate'),
                    icon: Power,
                    onClick: () => onToggleActive(employee),
                    variant: employee.is_active ? 'danger' : 'success',
                },
            ]}
        />
    );
}
