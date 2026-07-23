import { Button, Input, Label } from '@/components';
import { useLanguage } from '@/hooks';
import { DashboardSidebarLayout } from '@/layouts';
import { Head, Link, useForm } from '@inertiajs/react';
import { ChevronDown, ChevronLeft } from 'lucide-react';
import React from 'react';

interface Branch {
    id: number;
    name: string;
}

interface EmployeeCreateProps {
    roles: string[];
    branches: Branch[];
}

export default function EmployeeCreate({ roles, branches }: EmployeeCreateProps) {
    const { t } = useLanguage();
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        role: '',
        branch_id: '',
        active_date: '',
        slot_status: 'available',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('dashboard.employees.store'));
    };

    const roleLabel = (role: string) => {
        if (role === 'cashier') return t('dashboardAdvance.employees.common.roleCashier');
        if (role === 'branch_manager') return t('dashboardAdvance.employees.common.roleBranchManager');
        if (role === 'owner') return t('dashboardAdvance.employees.common.roleOwner');
        return role;
    };

    const selectClass =
        'w-full appearance-none rounded-md border border-[var(--border-strong)] bg-transparent px-3 py-2 text-sm text-[var(--subheading)] shadow-sm outline-none focus-visible:ring-1 focus-visible:ring-[var(--ring)] dark:text-[var(--neutral-white)]';

    return (
        <DashboardSidebarLayout
            title={t('dashboardAdvance.employees.create.layoutTitle')}
            description={t('dashboardAdvance.employees.create.layoutDescription')}
        >
            <Head title={t('dashboardAdvance.employees.create.headTitle')} />

            <div className="min-h-screen bg-[var(--page-bg)] p-4 sm:p-6">
                <div className="mb-5 flex items-center gap-4">
                    <Link href={route('dashboard.employees.index')}>
                        <Button variant="outline" size="icon" className="h-10 w-10 shrink-0 bg-[var(--card)]">
                            <ChevronLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <h2 className="text-xl font-bold text-[var(--subheading)]">{t('dashboardAdvance.employees.create.formTitle')}</h2>
                </div>

                <div className="max-w-2xl rounded-2xl border border-[var(--border-strong)] bg-[var(--card)] p-4 shadow-sm sm:p-6">
                    <form onSubmit={submit} className="flex flex-col gap-5">
                        <div>
                            <Label htmlFor="emp-name">{t('dashboardAdvance.employees.create.nameLabel')}</Label>
                            <Input
                                id="emp-name"
                                type="text"
                                aria-label={t('dashboardAdvance.employees.create.nameAriaLabel')}
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder={t('dashboardAdvance.employees.create.namePlaceholder')}
                            />
                            {errors.name && <span className="text-sm text-[var(--danger)]">{errors.name}</span>}
                        </div>

                        <div>
                            <Label htmlFor="emp-email">{t('dashboardAdvance.employees.create.emailLabel')}</Label>
                            <Input
                                id="emp-email"
                                type="email"
                                aria-label={t('dashboardAdvance.employees.create.emailAriaLabel')}
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder={t('dashboardAdvance.employees.create.emailPlaceholder')}
                            />
                            {errors.email && <span className="text-sm text-[var(--danger)]">{errors.email}</span>}
                        </div>

                        <div>
                            <Label htmlFor="emp-role">{t('dashboardAdvance.employees.create.roleLabel')}</Label>
                            <div className="relative">
                                <select
                                    id="emp-role"
                                    aria-label={t('dashboardAdvance.employees.create.roleAriaLabel')}
                                    className={selectClass}
                                    value={data.role}
                                    onChange={(e) => setData('role', e.target.value)}
                                >
                                    <option value="" disabled className="bg-[var(--card)]">
                                        {t('dashboardAdvance.employees.create.rolePlaceholder')}
                                    </option>
                                    {roles.map((role) => (
                                        <option key={role} value={role} className="bg-[var(--card)]">
                                            {roleLabel(role)}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 !text-[var(--grey-text)]" />
                            </div>
                            {errors.role && <span className="text-sm text-[var(--danger)]">{errors.role}</span>}
                        </div>

                        <div>
                            <label htmlFor="emp-branch" className="mb-1.5 block text-sm font-medium text-[var(--subheading)]">
                                {t('dashboardAdvance.employees.create.branchLabel')}
                            </label>
                            <div className="relative">
                                <select
                                    id="emp-branch"
                                    aria-label={t('dashboardAdvance.employees.create.branchAriaLabel')}
                                    className={selectClass}
                                    value={data.branch_id}
                                    onChange={(e) => setData('branch_id', e.target.value)}
                                >
                                    <option value="" disabled className="bg-[var(--card)]">
                                        {t('dashboardAdvance.employees.create.branchPlaceholder')}
                                    </option>
                                    {branches.map((branch) => (
                                        <option key={branch.id} value={branch.id} className="bg-[var(--card)]">
                                            {branch.name}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 !text-[var(--grey-text)]" />
                            </div>
                            {errors.branch_id && <span className="text-sm text-[var(--danger)]">{errors.branch_id}</span>}
                        </div>

                        <div>
                            <label htmlFor="emp-date" className="mb-1.5 block text-sm font-medium text-[var(--subheading)]">
                                {t('dashboardAdvance.employees.create.activeDateLabel')}
                            </label>
                            <Input
                                id="emp-date"
                                type="date"
                                aria-label={t('dashboardAdvance.employees.create.activeDateAriaLabel')}
                                value={data.active_date}
                                onChange={(e) => setData('active_date', e.target.value)}
                            />
                            {errors.active_date && <span className="text-sm text-[var(--danger)]">{errors.active_date}</span>}
                        </div>

                        <div>
                            <label htmlFor="emp-slot" className="mb-1.5 block text-sm font-medium text-[var(--subheading)]">
                                {t('dashboardAdvance.employees.create.slotStatusLabel')}
                            </label>
                            <div className="relative">
                                <select
                                    id="emp-slot"
                                    aria-label={t('dashboardAdvance.employees.create.slotStatusAriaLabel')}
                                    className={selectClass}
                                    value={data.slot_status}
                                    onChange={(e) => setData('slot_status', e.target.value)}
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

                        <div className="mt-4 flex justify-end">
                            <Button
                                type="submit"
                                aria-label={t('dashboardAdvance.employees.create.submitAriaLabel')}
                                disabled={processing}
                                className="w-full sm:w-auto"
                            >
                                {processing ? t('dashboardAdvance.employees.create.submitting') : t('dashboardAdvance.employees.create.submitLabel')}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </DashboardSidebarLayout>
    );
}
