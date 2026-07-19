import {
    Button,
    CreateButton,
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
import {
    EmployeeAccessActionsMenu,
    EmployeeAccessCreateModal,
    EmployeeAccessEditModal,
    type EmployeeAccess,
} from '@/features/advance/management/employee/components';
import { useConfirmAction, useDropdownMenu, useFilters, useLanguage } from '@/hooks';
import { DashboardSidebarLayout } from '@/layouts';
import { Head } from '@inertiajs/react';
import { MoreVertical } from 'lucide-react';
import { useState } from 'react';

interface EmployeeAccessListProps {
    accesses: {
        data: EmployeeAccess[];
        total: number;
        from: number;
        to: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    filters: {
        search?: string;
        per_page?: string;
    };
}

export default function EmployeeAccessList({ accesses, filters }: EmployeeAccessListProps) {
    const { t } = useLanguage();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editAccess, setEditAccess] = useState<EmployeeAccess | null>(null);
    const { search, setSearch, applyFilters, handleSearch } = useFilters('dashboard.employees-access.index', filters);
    const { openId: openMenuId, position: menuPosition, buttonRefs, toggleMenu, closeMenu } = useDropdownMenu();
    const { confirmAndDelete } = useConfirmAction();

    const handleEdit = (access: EmployeeAccess) => {
        setEditAccess(access);
        closeMenu();
    };

    const handleDelete = (id: number) => {
        confirmAndDelete(t('dashboardAdvance.employeeAccess.list.deleteConfirm'), route('dashboard.employees.access.destroy', id));
        closeMenu();
    };

    const activeMenuAccess = accesses.data.find((a) => a.id === openMenuId);

    return (
        <DashboardSidebarLayout
            title={t('dashboardAdvance.employeeAccess.list.layoutTitle')}
            description={t('dashboardAdvance.employeeAccess.list.layoutDescription')}
        >
            <Head title={t('dashboardAdvance.employeeAccess.list.headTitle')} />
            <div className="min-h-screen bg-[var(--page-bg)] p-4 sm:p-6">
                <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
                    <SearchInput
                        value={search}
                        onChange={setSearch}
                        onSubmit={handleSearch}
                        placeholder={t('dashboardAdvance.employeeAccess.list.searchPlaceholder')}
                    />

                    <div className="flex flex-wrap items-center gap-3">
                        <CreateButton label={t('dashboardAdvance.employeeAccess.list.createLabel')} onClick={() => setShowCreateModal(true)} />
                    </div>
                </div>

                <div className="overflow-hidden rounded-2xl border border-[var(--border-strong)] bg-[var(--card)] shadow-sm">
                    <div className="overflow-x-auto">
                        <Table className="min-w-[520px]">
                            <TableHeader className="bg-[var(--surface-header)]">
                                <TableRow className="border-none hover:bg-[var(--surface-header)]">
                                    <TableHead className="text-[var(--text-light)]">{t('dashboardAdvance.employeeAccess.list.columnName')}</TableHead>
                                    <TableHead className="text-[var(--text-light)]">
                                        {t('dashboardAdvance.employeeAccess.list.columnEmployeeCount')}
                                    </TableHead>
                                    <TableHead className="w-[60px] text-[var(--text-light)]">
                                        {t('dashboardAdvance.employeeAccess.list.columnAction')}
                                    </TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {accesses.data.length === 0 ? (
                                    <TableEmptyState
                                        colSpan={3}
                                        message={
                                            filters.search
                                                ? `${t('dashboardAdvance.employeeAccess.list.notFoundPrefix')} "${filters.search}" ${t('dashboardAdvance.employeeAccess.list.notFoundSuffix')}`
                                                : t('dashboardAdvance.employeeAccess.list.emptyState')
                                        }
                                    />
                                ) : (
                                    accesses.data.map((access) => (
                                        <TableRow key={access.id}>
                                            <TableCell>
                                                <span
                                                    className="rounded-full px-3 py-1 text-xs font-medium"
                                                    style={{
                                                        backgroundColor: 'var(--second-accent)',
                                                        color: 'var(--subheading)',
                                                    }}
                                                >
                                                    {access.name}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-[var(--grey-text)]">
                                                {access.employees_count} {t('dashboardAdvance.employeeAccess.list.employeeCountSuffix')}
                                            </TableCell>
                                            <TableCell className="relative">
                                                <Button
                                                    ref={(el) => {
                                                        buttonRefs.current[access.id] = el;
                                                    }}
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => toggleMenu(access.id)}
                                                >
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                <PaginationBar
                    from={accesses.from ?? 0}
                    to={accesses.to ?? 0}
                    total={accesses.total}
                    itemLabel={t('dashboardAdvance.employeeAccess.list.itemLabel')}
                    links={accesses.links}
                    perPage={filters.per_page ?? '5'}
                    onPerPageChange={(v) => applyFilters({ per_page: v })}
                />
            </div>

            {activeMenuAccess && (
                <EmployeeAccessActionsMenu
                    access={activeMenuAccess}
                    position={menuPosition}
                    onClose={closeMenu}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            )}

            {showCreateModal && <EmployeeAccessCreateModal onClose={() => setShowCreateModal(false)} />}

            {editAccess && <EmployeeAccessEditModal access={editAccess} onClose={() => setEditAccess(null)} />}
        </DashboardSidebarLayout>
    );
}
