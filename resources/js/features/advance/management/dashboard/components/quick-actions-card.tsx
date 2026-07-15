import { Link } from '@inertiajs/react';
import { FileText, Package, Plus, Receipt, ReceiptText, UserPlus, type LucideIcon } from 'lucide-react';

interface QuickAction {
    label: string;
    icon: LucideIcon;
    routeName: string;
    color: string;
    bg: string;
}

const QUICK_ACTIONS: QuickAction[] = [
    {
        label: 'Tambah Produk',
        icon: Plus,
        routeName: 'dashboard.inventory.items.create',
        color: 'var(--income-icon-text)',
        bg: 'var(--income-icon-bg)',
    },
    { label: 'Lihat Produk', icon: Package, routeName: 'dashboard.inventory.items.index', color: 'var(--success)', bg: 'var(--success-background)' },
    {
        label: 'Tambah Karyawan',
        icon: UserPlus,
        routeName: 'dashboard.employees.create',
        color: 'var(--category-color-1)',
        bg: 'var(--category-bg-color-3)',
    },
    { label: 'Laporan Penjualan', icon: ReceiptText, routeName: 'dashboard.reports.index', color: 'var(--warning)', bg: 'var(--warning-background)' },
    { label: 'Laporan Stok', icon: FileText, routeName: '', color: 'var(--income-icon-text)', bg: 'var(--income-icon-bg)' },
    { label: 'Cetak Struk', icon: Receipt, routeName: 'settings.receipt', color: 'var(--danger)', bg: 'var(--danger-background)' },
];

export function QuickActionsCard({ className }: { className?: string }) {
    return (
        <div
            className={`rounded-2xl border border-[var(--border)] bg-[var(--neutral-white)] p-4 shadow-sm sm:p-6 dark:border-[var(--border-strong)] dark:bg-[var(--card)] ${className ?? ''}`}
        >
            <h3 className="mb-4 text-sm font-semibold text-[var(--subheading)] dark:text-white">Aksi Cepat</h3>
            <div className="grid grid-cols-3 gap-3">
                {QUICK_ACTIONS.map((action) => {
                    const content = (
                        <>
                            <span
                                className="flex h-10 w-10 items-center justify-center rounded-full"
                                style={{ backgroundColor: action.bg, color: action.color }}
                            >
                                <action.icon className="h-5 w-5" />
                            </span>
                            <span className="text-[11px] leading-tight font-medium text-[var(--grey-text)] dark:text-[var(--muted-foreground)]">
                                {action.label}
                            </span>
                        </>
                    );

                    if (!action.routeName) {
                        return (
                            <div
                                key={action.label}
                                title="Segera hadir"
                                aria-disabled
                                className="flex cursor-not-allowed flex-col items-center gap-2 rounded-xl border border-dashed border-[var(--border)] p-3 text-center opacity-50 dark:border-[var(--border-strong)]"
                            >
                                {content}
                            </div>
                        );
                    }

                    return (
                        <Link
                            key={action.label}
                            href={route(action.routeName)}
                            className="flex flex-col items-center gap-2 rounded-xl border border-[var(--border)] p-3 text-center transition-colors hover:bg-[var(--second-accent)] dark:border-[var(--border-strong)] dark:hover:bg-[var(--second-accent)]"
                        >
                            {content}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
