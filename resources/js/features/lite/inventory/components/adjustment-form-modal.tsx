import { FilterDropdown } from '@/components';
import { Button } from '@/components/ui';
import { useLanguage } from '@/hooks';
import { useForm } from '@inertiajs/react';
import { ClipboardEdit, Minus, Plus, X } from 'lucide-react';

interface AdjustmentRecord {
    id: number;
    inventory_item_id: number;
    note: string;
    qty_change: number;
}

interface AdjustmentFormModalProps {
    items: { id: number; name: string }[];
    adjustment?: AdjustmentRecord | null;
    onClose: () => void;
}

type Direction = 'in' | 'out';

const REASONS_BY_LOCALE: Record<'id' | 'en', Record<Direction, string[]>> = {
    id: {
        out: ['Barang rusak', 'Hilang', 'Kadaluarsa'],
        in: ['Beli/restock barang baru', 'Ketemu lebih saat hitung ulang', 'Retur dari pelanggan'],
    },
    en: {
        out: ['Damaged item', 'Lost', 'Expired'],
        in: ['Restocked / bought new stock', 'Found extra during recount', 'Customer return'],
    },
};

export function AdjustmentFormModal({ items, adjustment, onClose }: AdjustmentFormModalProps) {
    const { t, locale } = useLanguage();
    const isEdit = !!adjustment;
    const REASONS = REASONS_BY_LOCALE[locale] ?? REASONS_BY_LOCALE.id;

    const { data, setData, post, put, processing, errors, reset, transform } = useForm({
        inventory_item_id: adjustment ? String(adjustment.inventory_item_id) : '',
        direction: (adjustment && adjustment.qty_change < 0 ? 'out' : 'in') as Direction,
        amount: adjustment ? String(Math.abs(adjustment.qty_change)) : '1',
        note: adjustment?.note ?? '',
    });

    const handleDirectionChange = (direction: Direction) => {
        setData((prev) => ({ ...prev, direction, note: '' }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        transform((formData) => {
            const amountNum = Number(formData.amount) || 0;
            const qty_change = formData.direction === 'out' ? -amountNum : amountNum;
            return {
                inventory_item_id: formData.inventory_item_id,
                qty_change,
                note: formData.note,
            };
        });

        const options = {
            onSuccess: () => {
                reset();
                onClose();
            },
        };

        if (isEdit) {
            put(route('lite.inventory.adjustments.update', adjustment!.id), options);
        } else {
            post(route('lite.inventory.adjustments.store'), options);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center sm:p-4">
            <div className="w-full max-w-md rounded-t-3xl bg-[var(--neutral-white)] shadow-xl sm:rounded-3xl dark:bg-[var(--background)]">
                <div className="flex items-center justify-between p-5">
                    <div className="flex items-center gap-3">
                        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--second-accent)] dark:bg-[var(--border-strong)]">
                            <ClipboardEdit className="h-6 w-6 text-[var(--subheading)] dark:text-[var(--neutral-white)]" />
                        </span>
                        <h3 className="text-xl font-bold text-[var(--subheading)] dark:text-[var(--neutral-white)]">
                            {isEdit ? t('dashboardLite.inventoryAdjustments.modal.editTitle') : t('dashboardLite.inventoryAdjustments.modal.title')}
                        </h3>
                    </div>
                    <button aria-label={t('dashboardLite.inventoryAdjustments.modal.closeAria')} onClick={onClose}>
                        <X className="h-6 w-6 text-[var(--grey-text)] dark:text-[var(--neutral-white)]" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-5 pb-5">
                    <div>
                        <FilterDropdown
                            value={data.inventory_item_id || undefined}
                            allLabel={t('dashboardLite.inventoryAdjustments.modal.itemPlaceholder')}
                            options={items.map((c) => ({
                                value: String(c.id),
                                label: c.name,
                            }))}
                            onChange={(value) => setData('inventory_item_id', value ?? '')}
                            buttonClassName="!w-full"
                        />
                        {errors.inventory_item_id && <p className="mt-1 text-sm text-[var(--danger)]">{errors.inventory_item_id}</p>}
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-[var(--subheading)] dark:text-[var(--neutral-white)]">
                            {t('dashboardLite.inventoryAdjustments.modal.directionLabel')}
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                aria-label={t('dashboardLite.inventoryAdjustments.modal.directionOutAria')}
                                onClick={() => handleDirectionChange('out')}
                                className={`flex flex-col items-center gap-1.5 rounded-2xl border-2 p-4 transition ${
                                    data.direction === 'out'
                                        ? 'border-[var(--danger)] bg-[var(--danger-background)] text-[var(--danger)]'
                                        : 'border-[var(--border-strong)] text-[var(--grey-text)] dark:border-[var(--border-strong)] dark:text-[var(--neutral-white)]'
                                }`}
                            >
                                <Minus className="h-6 w-6" />
                                <span className="text-sm font-bold">{t('dashboardLite.inventoryAdjustments.modal.directionOutLabel')}</span>
                            </button>
                            <button
                                type="button"
                                aria-label={t('dashboardLite.inventoryAdjustments.modal.directionInAria')}
                                onClick={() => handleDirectionChange('in')}
                                className={`flex flex-col items-center gap-1.5 rounded-2xl border-2 p-4 transition ${
                                    data.direction === 'in'
                                        ? 'border-[var(--success)] bg-[var(--success-background)] text-[var(--success)]'
                                        : 'border-[var(--border-strong)] text-[var(--grey-text)] dark:border-[var(--border-strong)] dark:text-[var(--neutral-white)]'
                                }`}
                            >
                                <Plus className="h-6 w-6" />
                                <span className="text-sm font-bold">{t('dashboardLite.inventoryAdjustments.modal.directionInLabel')}</span>
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-semibold text-[var(--subheading)] dark:text-[var(--neutral-white)]">
                            {t('dashboardLite.inventoryAdjustments.modal.amountLabel')}
                        </label>
                        <input
                            aria-label={t('dashboardLite.inventoryAdjustments.modal.amountAria')}
                            type="number"
                            min="1"
                            value={data.amount}
                            onChange={(e) => setData('amount', e.target.value)}
                            className="h-12 w-full rounded-xl border border-[var(--border-strong)] bg-transparent px-3 text-base dark:border-[var(--border-strong)] dark:text-[var(--neutral-white)]"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-[var(--subheading)] dark:text-[var(--neutral-white)]">
                            {t('dashboardLite.inventoryAdjustments.modal.reasonLabel')}
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {REASONS[data.direction].map((reason) => (
                                <button
                                    key={reason}
                                    type="button"
                                    aria-label={`${t('dashboardLite.inventoryAdjustments.modal.reasonAriaPrefix')} ${reason}`}
                                    onClick={() => setData('note', reason)}
                                    className={`rounded-full border-2 px-3 py-1.5 text-sm font-medium transition ${
                                        data.note === reason
                                            ? 'border-[var(--surface-header)] bg-[var(--surface-header)] text-white dark:border-[var(--neutral-white)] dark:bg-[var(--neutral-white)] dark:text-[var(--primary-900)]'
                                            : 'border-[var(--border-strong)] text-[var(--grey-text)] dark:border-[var(--border-strong)] dark:text-[var(--neutral-white)] dark:hover:bg-white/10'
                                    }`}
                                >
                                    {reason}
                                </button>
                            ))}
                        </div>
                        <input
                            aria-label={t('dashboardLite.inventoryAdjustments.modal.reasonOtherAria')}
                            value={data.note}
                            onChange={(e) => setData('note', e.target.value)}
                            placeholder={t('dashboardLite.inventoryAdjustments.modal.reasonOtherPlaceholder')}
                            className="mt-2 h-12 w-full rounded-xl border border-[var(--border-strong)] bg-transparent px-3 text-base dark:border-[var(--border-strong)] dark:text-[var(--neutral-white)]"
                        />
                        {errors.note && <p className="mt-1 text-sm text-[var(--danger)]">{errors.note}</p>}
                    </div>

                    <Button
                        aria-label={t('dashboardLite.inventoryAdjustments.modal.saveAria')}
                        type="submit"
                        disabled={processing}
                        className="mt-2 h-12 rounded-xl bg-[var(--surface-header)] text-base font-bold hover:bg-[var(--surface-header-hover)] dark:bg-[var(--neutral-white)] dark:text-[var(--primary-900)] dark:hover:opacity-90"
                    >
                        {processing
                            ? t('dashboardLite.inventoryAdjustments.modal.savingButton')
                            : t('dashboardLite.inventoryAdjustments.modal.saveButton')}
                    </Button>
                </form>
            </div>
        </div>
    );
}
