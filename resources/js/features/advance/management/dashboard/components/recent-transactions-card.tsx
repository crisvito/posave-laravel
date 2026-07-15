import { formatRupiah } from '@/lib/format';
import { StatusBadge } from './status-badge';

export interface RecentTransaction {
    invoice: string;
    total: number;
    status: string;
    payment: string;
    time: string;
}

export function RecentTransactionsCard({ transactions, className }: { transactions: RecentTransaction[]; className?: string }) {
    return (
        <div
            className={`rounded-2xl border border-[var(--border)] bg-[var(--neutral-white)] p-4 shadow-sm sm:p-6 dark:border-[var(--border-strong)] dark:bg-[var(--card)] ${className ?? ''}`}
        >
            <h3 className="mb-4 text-sm font-semibold text-[var(--subheading)] dark:text-white">Transaksi Terbaru</h3>
            {transactions.length === 0 ? (
                <p className="py-8 text-center text-sm text-[var(--grey-text)] dark:text-[var(--muted-foreground)]">Belum ada transaksi</p>
            ) : (
                <ul className="flex flex-col gap-3">
                    {transactions.map((trx) => (
                        <li key={trx.invoice} className="flex items-center justify-between gap-2">
                            <div className="min-w-0">
                                <p className="truncate text-sm font-medium text-[var(--subheading)] dark:text-white">{trx.invoice}</p>
                                <p className="text-xs text-[var(--grey-text)] dark:text-[var(--muted-foreground)]">{trx.time}</p>
                            </div>
                            <div className="flex shrink-0 flex-col items-end gap-1">
                                <span className="text-sm font-semibold text-[var(--subheading)] dark:text-white">{formatRupiah(trx.total)}</span>
                                <StatusBadge status={trx.status} />
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
