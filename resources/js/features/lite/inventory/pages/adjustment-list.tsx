import { Button, Input } from '@/components/ui';
import { AdjustmentFormModal } from '@/features/lite/inventory/components';
import { useConfirmAction, useLanguage } from '@/hooks';
import { DashboardSidebarLayout } from '@/layouts';
import { Head, router } from '@inertiajs/react';
import axios from 'axios';
import { ClipboardEdit, Plus, Search } from 'lucide-react';
import { useEffect, useState } from 'react';

interface AdjustmentRow {
    id: number;
    inventory_item_id: number;
    item_name: string;
    note: string;
    qty_change: number;
    date: string;
}

interface ItemOption {
    id: number;
    name: string;
}

interface Props {
    adjustments: {
        data: AdjustmentRow[];
        next_page_url: string | null;
    };
    items: ItemOption[];
    filters: { search?: string };
}

export default function AdjustmentList({ adjustments: initialAdjustments, items, filters }: Props) {
    const { t, locale } = useLanguage();
    const [adjustments, setAdjustments] = useState<AdjustmentRow[]>(initialAdjustments.data);
    const [nextPageUrl, setNextPageUrl] = useState(initialAdjustments.next_page_url);
    const [loadingMore, setLoadingMore] = useState(false);
    const [search, setSearch] = useState(filters.search ?? '');
    const [formAdjustment, setFormAdjustment] = useState<AdjustmentRow | 'new' | null>(null);
    const { confirmAndDelete, confirmDialog } = useConfirmAction();

    const dateLocale = locale === 'en' ? 'en-US' : 'id-ID';

    useEffect(() => {
        setAdjustments(initialAdjustments.data);
        setNextPageUrl(initialAdjustments.next_page_url);
    }, [initialAdjustments.data, initialAdjustments.next_page_url]);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            route('lite.inventory.adjustments.index'),
            { search: search || undefined },
            { preserveState: true, preserveScroll: true, replace: true, only: ['adjustments'] },
        );
    };

    const handleLoadMore = async () => {
        if (!nextPageUrl) return;
        setLoadingMore(true);
        try {
            const res = await axios.get(nextPageUrl);
            setAdjustments((prev) => [...prev, ...res.data.props.adjustments.data]);
            setNextPageUrl(res.data.props.adjustments.next_page_url);
        } finally {
            setLoadingMore(false);
        }
    };

    const handleDelete = (adjustment: AdjustmentRow) => {
        confirmAndDelete(
            `${t('dashboardLite.inventoryAdjustments.deleteConfirmPrefix')} "${adjustment.item_name}" ${t('dashboardLite.inventoryAdjustments.deleteConfirmSuffix')}`,
            route('lite.inventory.adjustments.destroy', adjustment.id),
            {
                onSuccess: () => setAdjustments((prev) => prev.filter((a) => a.id !== adjustment.id)),
            },
        );
    };

    return (
        <DashboardSidebarLayout
            title={t('dashboardLite.inventoryAdjustments.pageTitle')}
            description={t('dashboardLite.inventoryAdjustments.pageDescription')}
        >
            <Head title={t('dashboardLite.inventoryAdjustments.pageTitle')} />
            <div className="min-h-screen bg-[var(--page-bg)] p-4 sm:p-6 dark:bg-[var(--background)]">
                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <form onSubmit={handleSearchSubmit} className="relative flex-1">
                        <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-[var(--grey-text)] dark:text-[var(--neutral-white)]" />
                        <Input
                            aria-label={t('dashboardLite.inventoryAdjustments.search.aria')}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder={t('dashboardLite.inventoryAdjustments.search.placeholder')}
                            className="h-12 rounded-md border-[var(--border-strong)] bg-[var(--neutral-white)] pl-12 text-base dark:border-[var(--border-strong)] dark:bg-[var(--primary-900)] dark:text-[var(--neutral-white)]"
                        />
                    </form>
                    <Button aria-label={t('dashboardLite.inventoryAdjustments.createAria')} onClick={() => setFormAdjustment('new')} className="h-12">
                        <Plus className="mr-1 h-5 w-5" />
                        {t('dashboardLite.inventoryAdjustments.createButton')}
                    </Button>
                </div>

                {adjustments.length === 0 ? (
                    <div className="rounded-2xl border-2 border-dashed border-[var(--border-strong)] bg-[var(--neutral-white)] py-16 text-center dark:border-[var(--border-strong)] dark:bg-[var(--primary-900)]">
                        <ClipboardEdit className="mx-auto mb-3 h-10 w-10 text-[var(--grey-text)] dark:text-[var(--neutral-white)]" />
                        <p className="text-lg font-semibold text-[var(--subheading)] dark:text-[var(--neutral-white)]">
                            {t('dashboardLite.inventoryAdjustments.empty.title')}
                        </p>
                        <p className="mt-1 text-sm text-[var(--grey-text)] dark:text-[var(--neutral-white)]">
                            {t('dashboardLite.inventoryAdjustments.empty.hint')}
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {adjustments.map((a) => {
                            const isReduction = a.qty_change < 0;
                            return (
                                <div
                                    key={a.id}
                                    className="flex items-center justify-between gap-3 rounded-2xl border border-[var(--border-strong)] bg-[var(--neutral-white)] p-4 shadow-sm dark:border-[var(--border-strong)] dark:bg-[var(--primary-900)]"
                                >
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-base font-bold text-[var(--subheading)] dark:text-[var(--neutral-white)]">
                                            {a.item_name}
                                        </p>
                                        <p className="text-sm text-[var(--grey-text)] dark:text-[var(--neutral-white)]">{a.note}</p>
                                        <p className="mt-0.5 text-xs text-[var(--grey-text)] dark:text-[var(--neutral-white)]">
                                            {new Date(a.date).toLocaleDateString(dateLocale, { day: 'numeric', month: 'long', year: 'numeric' })}
                                        </p>
                                    </div>
                                    <div className="flex shrink-0 items-center gap-3">
                                        <span
                                            className="rounded-full px-3 py-1.5 text-base font-extrabold"
                                            style={{
                                                backgroundColor: isReduction ? 'var(--danger-background)' : 'var(--success-background)',
                                                color: isReduction ? 'var(--danger)' : 'var(--success)',
                                            }}
                                        >
                                            {isReduction ? a.qty_change : `+${a.qty_change}`}
                                        </span>
                                        <div className="flex gap-2">
                                            <Button
                                                aria-label={`${t('dashboardLite.inventoryAdjustments.editAriaPrefix')} ${a.item_name}`}
                                                onClick={() => setFormAdjustment(a)}
                                                className="h-9 rounded-xl bg-[var(--surface-header)] px-3 text-xs font-bold hover:bg-[var(--surface-header-hover)] dark:bg-[var(--neutral-white)] dark:text-[var(--primary-900)] dark:hover:opacity-90"
                                            >
                                                {t('dashboardLite.inventoryAdjustments.editButton')}
                                            </Button>
                                            <Button
                                                aria-label={`${t('dashboardLite.inventoryAdjustments.deleteAriaPrefix')} ${a.item_name}`}
                                                type="button"
                                                variant="outline"
                                                onClick={() => handleDelete(a)}
                                                className="!hover:bg-[var(--danger-background)] h-9 rounded-xl !border-[var(--danger)] px-3 text-xs font-bold !text-[var(--danger)]"
                                            >
                                                {t('dashboardLite.inventoryAdjustments.deleteButton')}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {nextPageUrl && (
                    <div className="mt-6 flex justify-center">
                        <Button
                            aria-label={t('dashboardLite.inventoryAdjustments.loadMoreAria')}
                            variant="outline"
                            onClick={handleLoadMore}
                            disabled={loadingMore}
                            className="h-12 rounded-2xl border-[var(--border-strong)] bg-[var(--neutral-white)] px-8 text-base font-semibold dark:border-[var(--border-strong)] dark:bg-[var(--primary-900)] dark:text-[var(--neutral-white)] dark:hover:bg-white/10"
                        >
                            {loadingMore
                                ? t('dashboardLite.inventoryAdjustments.loadingButton')
                                : t('dashboardLite.inventoryAdjustments.loadMoreButton')}
                        </Button>
                    </div>
                )}
            </div>

            {formAdjustment && (
                <AdjustmentFormModal
                    items={items}
                    adjustment={formAdjustment === 'new' ? null : formAdjustment}
                    onClose={() => setFormAdjustment(null)}
                />
            )}
            {confirmDialog}
        </DashboardSidebarLayout>
    );
}