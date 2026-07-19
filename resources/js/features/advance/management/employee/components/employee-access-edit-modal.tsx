import { Button } from '@/components';
import { useLanguage } from '@/hooks';
import { useForm } from '@inertiajs/react';
import { X } from 'lucide-react';
import React from 'react';
import type { EmployeeAccess } from './employee-access-actions-menu';

interface EmployeeAccessEditModalProps {
    access: EmployeeAccess;
    onClose: () => void;
}

export function EmployeeAccessEditModal({ access, onClose }: EmployeeAccessEditModalProps) {
    const { t } = useLanguage();
    const { data, setData, put, processing, errors, reset } = useForm({
        name: access.name,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('dashboard.employees-access.update', access.id), {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-md rounded-2xl bg-[var(--card)] p-6 shadow-xl">
                <div className="mb-5 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-[var(--subheading)]">{t('dashboardAdvance.employeeAccess.editModal.title')}</h3>
                    <button onClick={handleClose} aria-label={t('dashboardAdvance.employeeAccess.editModal.closeAriaLabel')}>
                        <X className="h-5 w-5 text-[var(--grey-text)] hover:text-[var(--subheading)]" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-[var(--subheading)]">
                            {t('dashboardAdvance.employeeAccess.editModal.nameLabel')}
                        </label>
                        <input
                            aria-label={t('dashboardAdvance.employeeAccess.editModal.nameAriaLabel')}
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="border-input focus-visible:ring-ring w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:ring-1 focus-visible:outline-none"
                        />
                        {errors.name && <span className="text-sm text-[var(--danger)]">{errors.name}</span>}
                    </div>

                    <div className="mt-2 flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={handleClose}>
                            {t('dashboardAdvance.employeeAccess.editModal.cancel')}
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing
                                ? t('dashboardAdvance.employeeAccess.editModal.submitting')
                                : t('dashboardAdvance.employeeAccess.editModal.submitLabel')}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
