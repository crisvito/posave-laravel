import { useLanguage } from '@/hooks';
import { Link } from '@inertiajs/react';
import { FileText, Package, Plus, Receipt, ReceiptText, UserPlus, type LucideIcon } from 'lucide-react';

interface QuickAction {
    label: string;
    icon: LucideIcon;
    routeName: string;
    color: string;
    bg: string;
}

export function QuickActionsCard({ className }: { className?: string }) {
    const { t } = useLanguage();

    const QUICK_ACTIONS: QuickAction[] = [
        {
            label: t('dashboardAdvance.dashboard.quickActions.addProduct'),
            icon: Plus,
            routeName: 'dashboard.inventory.items.create',
            color: 'var(--income-icon-text)',
            bg: 'var(--income-icon-bg)',
        },
        {
            label: t('dashboardAdvance.dashboard.quickActions.viewProducts'),
            icon: Package,
            routeName: 'dashboard.inventory.items.index',
            color: 'var(--success)',
            bg: 'var(--success-background)',
        },
        {
            label: t('dashboardAdvance.dashboard.quickActions.addEmployee'),
            icon: UserPlus,
            routeName: 'dashboard.employees.create',
            color: 'var(--category-color-1)',
            bg: 'var(--category-bg-color-3)',
        },
        {
            label: t('dashboardAdvance.dashboard.quickActions.salesReport'),
            icon: ReceiptText,
            routeName: 'dashboard.reports.index',
            color: 'var(--warning)',
            bg: 'var(--warning-background)',
        },
        {
            label: t('dashboardAdvance.dashboard.quickActions.stockReport'),
            icon: FileText,
            routeName: '',
            color: 'var(--income-icon-text)',
            bg: 'var(--income-icon-bg)',
        },
        {
            label: t('dashboardAdvance.dashboard.quickActions.printReceipt'),
            icon: Receipt,
            routeName: 'settings.receipt',
            color: 'var(--danger)',
            bg: 'var(--danger-background)',
        },
    ];

    return (
        <div className={`rounded-2xl border border-[var(--border-strong)] bg-[var(--card)] p-4 shadow-sm sm:p-6 ${className ?? ''}`}>
            <h3 className="mb-4 text-sm font-semibold text-[var(--subheading)]">{t('dashboardAdvance.dashboard.quickActions.title')}</h3>
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
                            <span className="text-[11px] leading-tight font-medium text-[var(--grey-text)]">{action.label}</span>
                        </>
                    );

                    if (!action.routeName) {
                        return (
                            <div
                                key={action.label}
                                title={t('dashboardAdvance.dashboard.quickActions.comingSoon')}
                                aria-disabled
                                className="flex cursor-not-allowed flex-col items-center gap-2 rounded-xl border border-dashed border-[var(--border-strong)] p-3 text-center opacity-50"
                            >
                                {content}
                            </div>
                        );
                    }

                    return (
                        <Link
                            key={action.label}
                            href={route(action.routeName)}
                            className="flex flex-col items-center gap-2 rounded-xl border border-[var(--border-strong)] p-3 text-center transition-colors hover:bg-[var(--second-accent)]"
                        >
                            {content}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
