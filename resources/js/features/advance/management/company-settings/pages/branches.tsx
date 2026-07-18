import {
    Button,
    CountBadge,
    CreateButton,
    DeleteButton,
    EditButton,
    Input,
    Label,
    PaginationBar,
    PrintButton,
    SearchInput,
    Table,
    TableBody,
    TableCell,
    TableEmptyState,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components';
import { useConfirmAction, useFilters, useLanguage } from '@/hooks';
import { DashboardSidebarLayout } from '@/layouts';
import { Head, useForm } from '@inertiajs/react';
import { MapPin, Phone } from 'lucide-react';
import { useState } from 'react';

interface Branch {
    id: number;
    name: string;
    address: string | null;
    phone: string | null;
    is_main: boolean;
    status: 'open' | 'closed';
}

interface Props {
    branches: {
        data: Branch[];
        total: number;
        from: number;
        to: number;
        per_page: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    filters: {
        search?: string;
        per_page?: string;
    };
}

type ModalMode = 'add' | 'edit' | null;

export default function BranchesPage({ branches, filters = {} }: Props) {
    const { t } = useLanguage();
    const [modal, setModal] = useState<ModalMode>(null);
    const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
    const { search, setSearch, applyFilters, handleSearch } = useFilters('settings.branches', filters);
    const { confirmAndRun } = useConfirmAction();

    const {
        data,
        setData,
        post,
        put,
        delete: destroy,
        processing,
        errors,
        reset,
    } = useForm({
        name: '',
        address: '',
        phone: '',
    });

    const openAdd = () => {
        reset();
        setEditingBranch(null);
        setModal('add');
    };

    const openEdit = (branch: Branch) => {
        setData({ name: branch.name, address: branch.address ?? '', phone: branch.phone ?? '' });
        setEditingBranch(branch);
        setModal('edit');
    };

    const closeModal = () => {
        setModal(null);
        setEditingBranch(null);
        reset();
    };

    const submitAdd = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('settings.branches.store'), { onSuccess: closeModal });
    };

    const submitEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingBranch) return;
        put(route('settings.branches.update', editingBranch.id), { onSuccess: closeModal });
    };

    const handleDelete = (branch: Branch) => {
        confirmAndRun(
            `${t('dashboardAdvance.branches.deleteConfirmPrefix')} "${branch.name}"? ${t('dashboardAdvance.branches.deleteConfirmSuffix')}`,
            () => destroy(route('settings.branches.destroy', branch.id)),
        );
    };

    return (
        <DashboardSidebarLayout title={t('dashboardAdvance.branches.layoutTitle')} description={t('dashboardAdvance.branches.layoutDescription')}>
            <Head title={t('dashboardAdvance.branches.headTitle')} />

            <div className="min-h-screen bg-[var(--page-bg)] p-6">
                <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-3">
                        <SearchInput
                            value={search}
                            onChange={setSearch}
                            onSubmit={handleSearch}
                            placeholder={t('dashboardAdvance.branches.searchPlaceholder')}
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <CountBadge label={t('dashboardAdvance.branches.countLabel')} count={branches.total} />
                        <CreateButton label={t('dashboardAdvance.branches.createLabel')} onClick={openAdd} />
                        <PrintButton label={t('dashboardAdvance.branches.printLabel')} />
                    </div>
                </div>

                <div className="overflow-hidden rounded-2xl border border-[var(--border-strong)] bg-[var(--card)] shadow-sm">
                    <div className="overflow-x-auto">
                        <Table className="min-w-[800px]">
                            <TableHeader className="bg-[var(--surface-header)]">
                                <TableRow className="border-none hover:bg-[var(--surface-header)]">
                                    <TableHead className="text-[var(--text-light)]">{t('dashboardAdvance.branches.columnName')}</TableHead>
                                    <TableHead className="text-[var(--text-light)]">{t('dashboardAdvance.branches.columnAddress')}</TableHead>
                                    <TableHead className="text-[var(--text-light)]">{t('dashboardAdvance.branches.columnPhone')}</TableHead>
                                    <TableHead className="text-[var(--text-light)]">{t('dashboardAdvance.branches.columnStatus')}</TableHead>
                                    <TableHead className="w-32 text-[var(--text-light)]">{t('dashboardAdvance.branches.columnAction')}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {branches.data.length === 0 ? (
                                    <TableEmptyState
                                        colSpan={5}
                                        message={
                                            filters?.search
                                                ? `${t('dashboardAdvance.branches.searchNotFoundPrefix')} "${filters.search}" ${t('dashboardAdvance.branches.searchNotFoundSuffix')}`
                                                : t('dashboardAdvance.branches.emptyState')
                                        }
                                    />
                                ) : (
                                    branches.data.map((branch) => (
                                        <TableRow key={branch.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-medium text-[var(--subheading)]">{branch.name}</span>
                                                    {branch.is_main && (
                                                        <span className="rounded-full bg-[var(--surface-header)] px-2 py-0.5 text-xs text-[var(--text-light)]">
                                                            {t('dashboardAdvance.branches.mainBadge')}
                                                        </span>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-[var(--grey-text)]">
                                                <div className="flex items-start gap-1.5">
                                                    <MapPin
                                                        className="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--grey-text-muted)]"
                                                        aria-hidden="true"
                                                    />
                                                    <span>{branch.address || '-'}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-[var(--grey-text)]">
                                                <div className="flex items-center gap-1.5">
                                                    <Phone className="h-4 w-4 flex-shrink-0 text-[var(--grey-text-muted)]" aria-hidden="true" />
                                                    <span>{branch.phone || '-'}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                                                        branch.status === 'closed'
                                                            ? 'bg-[var(--danger-background)] text-[var(--danger)]'
                                                            : 'bg-[var(--success-background)] text-[var(--success)]'
                                                    }`}
                                                >
                                                    {branch.status === 'closed'
                                                        ? t('dashboardAdvance.branches.statusClosed')
                                                        : t('dashboardAdvance.branches.statusOpen')}
                                                </span>
                                            </TableCell>
                                            <TableCell className="relative">
                                                <div className="flex items-center gap-2">
                                                    <EditButton label={t('dashboardAdvance.branches.editLabel')} onClick={() => openEdit(branch)} />
                                                    {!branch.is_main && (
                                                        <DeleteButton
                                                            label={t('dashboardAdvance.branches.deleteLabel')}
                                                            onClick={() => handleDelete(branch)}
                                                        />
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                <PaginationBar
                    from={branches.from ?? 0}
                    to={branches.to ?? 0}
                    total={branches.total}
                    itemLabel={t('dashboardAdvance.branches.countLabel')}
                    links={branches.links}
                    perPage={filters?.per_page ?? '5'}
                    onPerPageChange={(v) => applyFilters({ per_page: v })}
                />
            </div>

            {modal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    style={{ background: 'rgba(0,0,0,0.5)' }}
                    onClick={(e) => {
                        if (e.target === e.currentTarget) closeModal();
                    }}
                >
                    <div className="w-full max-w-md rounded-2xl bg-[var(--card)] p-6 shadow-xl dark:border dark:border-[var(--border-strong)]">
                        <div className="mb-5 flex items-center justify-between">
                            <h2 className="text-base font-medium text-[var(--grey-text)]">
                                {modal === 'add' ? t('dashboardAdvance.branches.modalTitleAdd') : t('dashboardAdvance.branches.modalTitleEdit')}
                            </h2>
                            <Button aria-label={t('dashboardAdvance.branches.closeModalLabel')} onClick={closeModal}>
                                ✕
                            </Button>
                        </div>

                        <form onSubmit={modal === 'add' ? submitAdd : submitEdit}>
                            <div className="mb-4">
                                <Label htmlFor="branch-name">{t('dashboardAdvance.branches.nameLabel')}</Label>
                                <Input
                                    id="branch-name"
                                    type="text"
                                    aria-label={t('dashboardAdvance.branches.nameAriaLabel')}
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder={t('dashboardAdvance.branches.namePlaceholder')}
                                    autoFocus
                                />
                                {errors.name && <p className="mt-1 text-xs text-[var(--danger)]">{errors.name}</p>}
                            </div>

                            <div className="mb-4">
                                <Label htmlFor="branch-address">{t('dashboardAdvance.branches.addressLabel')}</Label>
                                <Input
                                    id="branch-address"
                                    type="text"
                                    aria-label={t('dashboardAdvance.branches.addressAriaLabel')}
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                    placeholder={t('dashboardAdvance.branches.addressPlaceholder')}
                                />
                            </div>

                            <div className="mb-6">
                                <Label htmlFor="branch-phone">{t('dashboardAdvance.branches.phoneLabel')}</Label>
                                <Input
                                    id="branch-phone"
                                    type="text"
                                    aria-label={t('dashboardAdvance.branches.phoneAriaLabel')}
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    placeholder={t('dashboardAdvance.branches.phonePlaceholder')}
                                />
                            </div>

                            <div className="flex gap-3">
                                <DeleteButton type="button" label={t('dashboardAdvance.branches.cancel')} onClick={closeModal} />
                                <Button
                                    type="submit"
                                    aria-label={
                                        modal === 'add'
                                            ? t('dashboardAdvance.branches.submitCreateAriaLabel')
                                            : t('dashboardAdvance.branches.submitEditAriaLabel')
                                    }
                                    disabled={processing}
                                >
                                    {processing
                                        ? t('dashboardAdvance.branches.submitting')
                                        : modal === 'add'
                                          ? t('dashboardAdvance.branches.modalTitleAdd')
                                          : t('dashboardAdvance.branches.submitEditLabel')}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </DashboardSidebarLayout>
    );
}
