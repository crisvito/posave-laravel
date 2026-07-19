import { Button } from '@/components';
import { useLanguage } from '@/hooks';
import { X } from 'lucide-react';
import type { Employee } from './employee-actions-menu';

interface EmployeeDetailModalProps {
    employee: Employee;
    onClose: () => void;
}

export function EmployeeDetailModal({ employee, onClose }: EmployeeDetailModalProps) {
    const { t } = useLanguage();

    const roleLabel = (role: string) => {
        if (role === 'cashier') return t('dashboardAdvance.employees.common.roleCashier');
        if (role === 'branch_manager') return t('dashboardAdvance.employees.common.roleBranchManager');
        if (role === 'owner') return t('dashboardAdvance.employees.common.roleOwner');
        return role;
    };

    const slotStatusLabel = (status: string) => {
        if (status === 'on_shift') return t('dashboardAdvance.employees.common.slotOnShift');
        if (status === 'off') return t('dashboardAdvance.employees.common.slotOff');
        return t('dashboardAdvance.employees.common.slotAvailable');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-md rounded-2xl bg-[var(--card)] p-6 shadow-xl">
                <div className="mb-5 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-[var(--subheading)]">{t('dashboardAdvance.employees.detailModal.title')}</h3>
                    <button onClick={onClose} aria-label={t('dashboardAdvance.employees.detailModal.closeAriaLabel')}>
                        <X className="h-5 w-5 text-[var(--grey-text)] hover:text-[var(--subheading)]" />
                    </button>
                </div>

                <div className="flex flex-col gap-4">
                    <div>
                        <span className="block text-sm font-medium text-[var(--grey-text)]">
                            {t('dashboardAdvance.employees.detailModal.nameLabel')}
                        </span>
                        <span className="text-base font-semibold text-[var(--subheading)]">{employee.name}</span>
                    </div>

                    <div>
                        <span className="block text-sm font-medium text-[var(--grey-text)]">
                            {t('dashboardAdvance.employees.detailModal.emailLabel')}
                        </span>
                        <span className="text-base text-[var(--subheading)]">{employee.user?.email ?? '-'}</span>
                    </div>

                    <div>
                        <span className="block text-sm font-medium text-[var(--grey-text)]">
                            {t('dashboardAdvance.employees.detailModal.roleLabel')}
                        </span>
                        <span className="mt-1 inline-block w-fit rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
                            {roleLabel(employee.role)}
                        </span>
                    </div>

                    <div>
                        <span className="block text-sm font-medium text-[var(--grey-text)]">
                            {t('dashboardAdvance.employees.detailModal.branchLabel')}
                        </span>
                        <span className="text-base text-[var(--subheading)]">{employee.branch?.name ?? '-'}</span>
                    </div>

                    <div>
                        <span className="block text-sm font-medium text-[var(--grey-text)]">
                            {t('dashboardAdvance.employees.detailModal.activeDateLabel')}
                        </span>
                        <span className="text-base text-[var(--subheading)]">{employee.active_date}</span>
                    </div>

                    <div>
                        <span className="block text-sm font-medium text-[var(--grey-text)]">
                            {t('dashboardAdvance.employees.detailModal.slotStatusLabel')}
                        </span>
                        <span
                            className={`mt-1 inline-block rounded-full px-3 py-1 text-xs font-medium ${
                                employee.slot_status === 'on_shift'
                                    ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                                    : employee.slot_status === 'off'
                                      ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400'
                                      : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
                            }`}
                        >
                            {slotStatusLabel(employee.slot_status)}
                        </span>
                    </div>
                </div>

                <div className="mt-6 flex justify-end">
                    <Button variant="outline" onClick={onClose}>
                        {t('dashboardAdvance.employees.detailModal.closeButton')}
                    </Button>
                </div>
            </div>
        </div>
    );
}
