import {
    Button,
    FilterDropdown,
    PaginationBar,
    SearchInput,
    Table,
    TableBody,
    TableCell,
    TableEmptyState,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components';
import { EmployeeActionsMenu, EmployeeDetailModal, EmployeeEditModal, type Employee } from '@/features/advance/management/employee/components';
import { useConfirmAction, useDropdownMenu, useFilters, useLanguage } from '@/hooks';
import { DashboardSidebarLayout } from '@/layouts';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { MoreVertical, Plus, Store } from 'lucide-react';
import React, { useState } from 'react';

interface Branch {
    id: number;
    name: string;
}

interface EmployeeListProps {
    employees: {
        data: Employee[];
        total: number;
        from: number;
        to: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    branches: Branch[];
    filters: {
        branch?: string;
        per_page?: string;
        search?: string;
        status?: string;
    };
    is_branch_manager: boolean;
}

export default function EmployeeList({ employees, branches, filters, is_branch_manager }: EmployeeListProps) {
    const { t } = useLanguage();
    const [detailEmployee, setDetailEmployee] = useState<Employee | null>(null);
    const [editEmployee, setEditEmployee] = useState<Employee | null>(null);
    const { openId: openMenuId, position: menuPosition, buttonRefs, toggleMenu, closeMenu } = useDropdownMenu();
    const { search, setSearch, applyFilters, handleSearch } = useFilters('dashboard.employees.index', filters);
    const editForm = useForm({
        name: '',
        role: '',
        branch_id: '' as string | number,
        active_date: '',
        slot_status: '',
    });
    const { confirmAndRun, confirmDialog } = useConfirmAction();

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

    const slotStatusClass = (status: string) => {
        if (status === 'on_shift') return 'bg-[var(--success-background)] text-[var(--success)]';
        if (status === 'off') return 'bg-[var(--warning-background)] text-[var(--warning)]';
        return 'bg-[var(--second-accent)] text-[var(--grey-text)]';
    };

    const handleShowDetail = (employee: Employee) => {
        setDetailEmployee(employee);
        closeMenu();
    };

    const handleShowEdit = (employee: Employee) => {
        setEditEmployee(employee);
        editForm.setData({
            name: employee.name,
            role: employee.role,
            branch_id: employee.branch_id ?? '',
            active_date: employee.active_date,
            slot_status: employee.slot_status,
        });
        closeMenu();
    };

    const handleCloseEdit = () => {
        setEditEmployee(null);
        editForm.reset();
    };

    const handleSubmitEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editEmployee) return;
        editForm.put(route('dashboard.employees.update', editEmployee.id), { onSuccess: handleCloseEdit });
    };

    const handleToggleActive = (employee: Employee) => {
        const doToggle = () => router.patch(route('dashboard.employees.toggle-active', employee.id), {}, { preserveScroll: true });

        if (employee.is_active) {
            confirmAndRun(
                `${t('dashboardAdvance.employees.list.deactivateConfirmPrefix')} "${employee.name}"? ${t('dashboardAdvance.employees.list.deactivateConfirmSuffix')}`,
                doToggle,
                'danger',
            );
        } else {
            doToggle();
        }
        closeMenu();
    };

    const statusOptions = [
        { value: 'active', label: t('dashboardAdvance.employees.list.activeStatusActive') },
        { value: 'inactive', label: t('dashboardAdvance.employees.list.activeStatusInactive') },
    ];

    const activeMenuEmployee = employees.data.find((e) => e.id === openMenuId);
    const canManage = (employee: Employee) => !is_branch_manager || employee.role === 'cashier';

    return (
        <DashboardSidebarLayout
            title={t('dashboardAdvance.employees.list.layoutTitle')}
            description={t('dashboardAdvance.employees.list.layoutDescription')}
        >
            <Head title={t('dashboardAdvance.employees.list.headTitle')} />
            <div className="min-h-screen bg-[var(--page-bg)] p-4 sm:p-6">
                <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-3">
                        {!is_branch_manager ? (
                            <FilterDropdown
                                value={filters.branch}
                                options={branches.map((b) => ({ value: String(b.id), label: b.name }))}
                                allLabel={t('dashboardAdvance.employees.list.allBranches')}
                                icon={<Store className="h-4 w-4" />}
                                onChange={(v) => applyFilters({ branch: v })}
                            />
                        ) : (
                            <div className="flex shrink-0 items-center gap-2 rounded-lg bg-[var(--second-accent)] px-3 py-2 text-sm font-medium text-[var(--subheading)]">
                                <Store className="h-4 w-4" />
                                {branches[0]?.name ?? t('dashboardAdvance.employees.list.yourBranchFallback')}
                            </div>
                        )}
                        <FilterDropdown
                            value={filters.status}
                            options={statusOptions}
                            allLabel={t('dashboardAdvance.employees.list.allActiveStatus')}
                            onChange={(v) => applyFilters({ status: v })}
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <span className="rounded-lg bg-[var(--surface-badge)] px-4 py-2 text-sm font-medium text-[var(--subheading)]">
                            {t('dashboardAdvance.employees.list.countPrefix')} : {employees.total}
                        </span>
                        {!is_branch_manager && (
                            <Link href={route('dashboard.employees.create')}>
                                <Button className="bg-[var(--surface-header)] hover:bg-[var(--surface-header-hover)]">
                                    <Plus className="mr-2 h-4 w-4" />
                                    {t('dashboardAdvance.employees.list.addButton')}
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>

                <div className="mb-4">
                    <SearchInput
                        value={search}
                        onChange={setSearch}
                        onSubmit={handleSearch}
                        placeholder={t('dashboardAdvance.employees.list.searchPlaceholder')}
                    />
                </div>

                <div className="overflow-hidden rounded-2xl border border-[var(--border-strong)] bg-[var(--card)] shadow-sm">
                    <div className="overflow-x-auto">
                        <Table className="min-w-[950px]">
                            <TableHeader className="bg-[var(--surface-header)]">
                                <TableRow className="border-none hover:bg-[var(--surface-header)]">
                                    <TableHead className="text-[var(--text-light)]">{t('dashboardAdvance.employees.list.columnName')}</TableHead>
                                    <TableHead className="text-[var(--text-light)]">{t('dashboardAdvance.employees.list.columnEmail')}</TableHead>
                                    <TableHead className="text-[var(--text-light)]">{t('dashboardAdvance.employees.list.columnRole')}</TableHead>
                                    <TableHead className="text-[var(--text-light)]">{t('dashboardAdvance.employees.list.columnBranch')}</TableHead>
                                    <TableHead className="text-[var(--text-light)]">
                                        {t('dashboardAdvance.employees.list.columnActiveDate')}
                                    </TableHead>
                                    <TableHead className="text-[var(--text-light)]">
                                        {t('dashboardAdvance.employees.list.columnSlotStatus')}
                                    </TableHead>
                                    <TableHead className="text-[var(--text-light)]">
                                        {t('dashboardAdvance.employees.list.columnActiveStatus')}
                                    </TableHead>
                                    <TableHead className="w-[60px] text-[var(--text-light)]">
                                        {t('dashboardAdvance.employees.list.columnAction')}
                                    </TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {employees.data.length === 0 ? (
                                    <TableEmptyState colSpan={8} message={t('dashboardAdvance.employees.list.emptyState')} />
                                ) : (
                                    employees.data.map((employee) => (
                                        <TableRow
                                            key={employee.id}
                                            className={`${employee.role === 'branch_manager' ? 'bg-[var(--secondary-600)]/5' : ''} ${!employee.is_active ? 'opacity-60' : ''}`}
                                        >
                                            <TableCell className="font-medium text-[var(--subheading)]">{employee.name}</TableCell>
                                            <TableCell className="text-[var(--subheading)]">{employee.user?.email ?? '-'}</TableCell>
                                            <TableCell>
                                                <span className="rounded-full bg-[var(--secondary-600)]/10 px-3 py-1 text-xs font-medium whitespace-nowrap text-[var(--secondary-600)]">
                                                    {roleLabel(employee.role)}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-[var(--subheading)]">{employee.branch?.name ?? '-'}</TableCell>
                                            <TableCell className="text-[var(--subheading)]">{employee.active_date}</TableCell>
                                            <TableCell>
                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap ${slotStatusClass(employee.slot_status)}`}
                                                >
                                                    {slotStatusLabel(employee.slot_status)}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap ${
                                                        employee.is_active
                                                            ? 'bg-[var(--success-background)] text-[var(--success)]'
                                                            : 'bg-[var(--danger-background)] text-[var(--danger)]'
                                                    }`}
                                                >
                                                    {employee.is_active
                                                        ? t('dashboardAdvance.employees.list.activeStatusActive')
                                                        : t('dashboardAdvance.employees.list.activeStatusInactive')}
                                                </span>
                                            </TableCell>
                                            <TableCell className="relative">
                                                {canManage(employee) ? (
                                                    <Button
                                                        ref={(el) => {
                                                            buttonRefs.current[employee.id] = el;
                                                        }}
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => toggleMenu(employee.id)}
                                                    >
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleShowDetail(employee)}
                                                        className="text-xs font-medium text-[var(--secondary-600)] hover:underline"
                                                    >
                                                        {t('dashboardAdvance.employees.list.viewLabel')}
                                                    </button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                <PaginationBar
                    from={employees.from ?? 0}
                    to={employees.to ?? 0}
                    total={employees.total}
                    itemLabel={t('dashboardAdvance.employees.list.itemLabel')}
                    links={employees.links}
                    perPage={filters.per_page ?? '5'}
                    onPerPageChange={(v) => applyFilters({ per_page: v })}
                />
            </div>
            {activeMenuEmployee && (
                <EmployeeActionsMenu
                    employee={activeMenuEmployee}
                    position={menuPosition}
                    onClose={closeMenu}
                    onView={handleShowDetail}
                    onEdit={handleShowEdit}
                    onToggleActive={handleToggleActive}
                />
            )}
            {detailEmployee && <EmployeeDetailModal employee={detailEmployee} onClose={() => setDetailEmployee(null)} />}
            {editEmployee && (
                <EmployeeEditModal
                    form={editForm}
                    branches={branches}
                    is_branch_manager={is_branch_manager}
                    onSubmit={handleSubmitEdit}
                    onClose={handleCloseEdit}
                />
            )}
            {confirmDialog}
        </DashboardSidebarLayout>
    );
}
