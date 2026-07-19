import { useLanguage } from '@/hooks';
import { Link } from '@inertiajs/react';
import { ArrowRight, PackageSearch } from 'lucide-react';

export interface PendingTransfer {
    id: number;
    transfer_number: string;
    date: string;
    items_count: number;
    sender_branch_name: string;
    receiver_branch_name: string;
}

interface PendingTransfersCardProps {
    transfers: PendingTransfer[];
    count: number;
}

export function PendingTransfersCard({ transfers, count }: PendingTransfersCardProps) {
    const { t } = useLanguage();
    if (count === 0) return null;

    return (
        <div className="rounded-2xl border-2 border-amber-300 bg-amber-50 p-4 shadow-sm sm:p-6 dark:border-amber-900 dark:bg-amber-950/30">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <PackageSearch className="h-5 w-5 text-amber-700 dark:text-amber-500" />
                    <h3 className="text-sm font-semibold text-amber-900 dark:text-amber-200">
                        {count} {t('dashboardAdvance.dashboard.pendingTransfers.titleSuffix')}
                    </h3>
                </div>
                <Link
                    href={route('dashboard.inventory.transfers.index', { view: 'incoming' })}
                    className="flex items-center gap-1 text-xs font-medium text-amber-800 hover:underline dark:text-amber-400"
                >
                    {t('dashboardAdvance.dashboard.pendingTransfers.viewAll')}
                    <ArrowRight className="h-3.5 w-3.5" />
                </Link>
            </div>

            <div className="flex flex-col gap-2">
                {transfers.map((tr) => (
                    <Link
                        key={tr.id}
                        href={route('dashboard.inventory.transfers.index', { view: 'incoming' })}
                        className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-[var(--card)] px-4 py-2.5 text-sm transition hover:bg-amber-100/50 dark:hover:bg-amber-900/40"
                    >
                        <div className="flex items-center gap-2">
                            <span className="font-medium text-[var(--subheading)]">{tr.sender_branch_name}</span>
                            <ArrowRight className="h-3.5 w-3.5 text-[var(--grey-text)]" />
                            <span className="font-medium text-[var(--subheading)]">{tr.receiver_branch_name}</span>
                        </div>
                        <span className="text-xs text-[var(--grey-text)]">
                            #{tr.transfer_number} · {tr.items_count} {t('dashboardAdvance.dashboard.pendingTransfers.itemsCountSuffix')}
                        </span>
                    </Link>
                ))}
            </div>
        </div>
    );
}
