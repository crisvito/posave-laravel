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
    if (count === 0) return null;

    return (
        <div className="rounded-2xl border-2 border-amber-300 bg-amber-50 p-4 shadow-sm sm:p-6 dark:border-amber-900 dark:bg-amber-950/30">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <PackageSearch className="h-5 w-5 text-amber-700 dark:text-amber-500" />
                    <h3 className="text-sm font-semibold text-amber-900 dark:text-amber-200">{count} Kiriman Menunggu Konfirmasi Kamu</h3>
                </div>
                <Link
                    href={route('dashboard.inventory.transfers.index', { view: 'incoming' })}
                    className="flex items-center gap-1 text-xs font-medium text-amber-800 hover:underline dark:text-amber-400"
                >
                    Lihat Semua
                    <ArrowRight className="h-3.5 w-3.5" />
                </Link>
            </div>

            <div className="flex flex-col gap-2">
                {transfers.map((t) => (
                    <Link
                        key={t.id}
                        href={route('dashboard.inventory.transfers.index', { view: 'incoming' })}
                        className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-white px-4 py-2.5 text-sm transition hover:bg-amber-100/50 dark:bg-[var(--card)] dark:hover:bg-amber-900/40"
                    >
                        <div className="flex items-center gap-2">
                            <span className="font-medium text-[var(--subheading)] dark:text-white">{t.sender_branch_name}</span>
                            <ArrowRight className="h-3.5 w-3.5 text-[var(--grey-text)] dark:text-[var(--muted-foreground)]" />
                            <span className="font-medium text-[var(--subheading)] dark:text-white">{t.receiver_branch_name}</span>
                        </div>
                        <span className="text-xs text-[var(--grey-text)] dark:text-[var(--muted-foreground)]">
                            #{t.transfer_number} · {t.items_count} barang
                        </span>
                    </Link>
                ))}
            </div>
        </div>
    );
}
