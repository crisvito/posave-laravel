import { Button } from '@/components/ui';
import { useLanguage } from '@/hooks';
import type { InertiaFormProps } from '@inertiajs/react';
import { ChevronDown, X } from 'lucide-react';

interface Branch {
    id: number;
    name: string;
}

type EditFormData = {
    name: string;
    role: string;
    branch_id: string | number;
    active_date: string;
    slot_status: string;
    [key: string]: string | number;
};
interface EmployeeEditModalProps {
    form: InertiaFormProps<EditFormData>;
    branches: Branch[];
    is_branch_manager: boolean;
    onSubmit: (e: React.FormEvent) => void;
    onClose: () => void;
}

export function EmployeeEditModal({ form, branches, is_branch_manager, onSubmit, onClose }: EmployeeEditModalProps) {
    const { t } = useLanguage();
    const { data, setData, errors, processing } = form;

    const inputClass =
        'w-full rounded-lg border border-[var(--border-strong)] bg-transparent px-3.5 py-2.5 text-sm text-[var(--subheading)] outline-none focus:ring-1 focus:ring-[var(--ring)] dark:text-[var(--neutral-white)]';
    const selectClass = `${inputClass} appearance-none`;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-md rounded-2xl bg-[var(--card)] p-6 shadow-xl">
                <div className="mb-5 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-[var(--subheading)]">{t('dashboardAdvance.employees.editModal.title')}</h3>
                    <button onClick={onClose} aria-label={t('dashboardAdvance.employees.editModal.closeAriaLabel')}>
                        <X className="h-5 w-5 text-[var(--grey-text)] hover:text-[var(--subheading)]" />
                    </button>
                </div>

                <form onSubmit={onSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-[var(--subheading)]">
                            {t('dashboardAdvance.employees.editModal.nameLabel')}
                        </label>
                        <input
                            aria-label={t('dashboardAdvance.employees.editModal.nameAriaLabel')}
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className={inputClass}
                        />
                        {errors.name && <span className="text-sm text-[var(--danger)]">{errors.name}</span>}
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-[var(--subheading)]">
                            {t('dashboardAdvance.employees.editModal.roleLabel')}
                        </label>
                        {is_branch_manager ? (
                            <div className={`${inputClass} flex items-center bg-[var(--second-accent)] capitalize dark:bg-[var(--border-strong)]`}>
                                {data.role}
                            </div>
                        ) : (
                            <div className="relative">
                                <select
                                    aria-label={t('dashboardAdvance.employees.editModal.roleAriaLabel')}
                                    value={data.role}
                                    onChange={(e) => setData('role', e.target.value)}
                                    className={selectClass}
                                >
                                    <option value="cashier" className="bg-[var(--card)]">
                                        {t('dashboardAdvance.employees.common.roleCashier')}
                                    </option>
                                    <option value="branch_manager" className="bg-[var(--card)]">
                                        {t('dashboardAdvance.employees.common.roleBranchManager')}
                                    </option>
                                </select>
                                <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 !text-[var(--grey-text)]" />
                            </div>
                        )}
                        {errors.role && <span className="text-sm text-[var(--danger)]">{errors.role}</span>}
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-[var(--subheading)]">
                            {t('dashboardAdvance.employees.editModal.branchLabel')}
                        </label>
                        {is_branch_manager ? (
                            <div className={`${inputClass} flex items-center bg-[var(--second-accent)] dark:bg-[var(--border-strong)]`}>
                                {branches.find((b) => b.id === Number(data.branch_id))?.name ?? branches[0]?.name ?? '-'}
                            </div>
                        ) : (
                            <div className="relative">
                                <select
                                    aria-label={t('dashboardAdvance.employees.editModal.branchAriaLabel')}
                                    value={data.branch_id}
                                    onChange={(e) => setData('branch_id', e.target.value)}
                                    className={selectClass}
                                >
                                    <option value="" disabled className="bg-[var(--card)]">
                                        {t('dashboardAdvance.employees.editModal.branchPlaceholder')}
                                    </option>
                                    {branches.map((b) => (
                                        <option key={b.id} value={b.id} className="bg-[var(--card)]">
                                            {b.name}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 !text-[var(--grey-text)]" />
                            </div>
                        )}
                        {errors.branch_id && <span className="text-sm text-[var(--danger)]">{errors.branch_id}</span>}
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-[var(--subheading)]">
                            {t('dashboardAdvance.employees.editModal.activeDateLabel')}
                        </label>
                        <input
                            aria-label={t('dashboardAdvance.employees.editModal.activeDateAriaLabel')}
                            type="date"
                            value={data.active_date}
                            onChange={(e) => setData('active_date', e.target.value)}
                            className={inputClass}
                        />
                        {errors.active_date && <span className="text-sm text-[var(--danger)]">{errors.active_date}</span>}
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-[var(--subheading)]">
                            {t('dashboardAdvance.employees.editModal.slotStatusLabel')}
                        </label>
                        <div className="relative">
                            <select
                                aria-label={t('dashboardAdvance.employees.editModal.slotStatusAriaLabel')}
                                value={data.slot_status}
                                onChange={(e) => setData('slot_status', e.target.value)}
                                className={selectClass}
                            >
                                <option value="available" className="bg-[var(--card)]">
                                    {t('dashboardAdvance.employees.common.slotAvailable')}
                                </option>
                                <option value="on_shift" className="bg-[var(--card)]">
                                    {t('dashboardAdvance.employees.common.slotOnShift')}
                                </option>
                                <option value="off" className="bg-[var(--card)]">
                                    {t('dashboardAdvance.employees.common.slotOff')}
                                </option>
                            </select>
                            <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 !text-[var(--grey-text)]" />
                        </div>
                    </div>

                    <div className="mt-2 flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={onClose}>
                            {t('dashboardAdvance.employees.editModal.cancel')}
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing
                                ? t('dashboardAdvance.employees.editModal.submitting')
                                : t('dashboardAdvance.employees.editModal.submitLabel')}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
