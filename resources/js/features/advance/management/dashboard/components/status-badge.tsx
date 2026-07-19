import { useLanguage } from '@/hooks';

export function StatusBadge({ status }: { status: string }) {
    const { t } = useLanguage();

    const map: Record<string, { label: string; color: string; bg: string }> = {
        completed: { label: t('dashboardAdvance.dashboard.statusBadge.completed'), color: 'var(--success)', bg: 'var(--success-background)' },
        refunded: { label: t('dashboardAdvance.dashboard.statusBadge.refunded'), color: 'var(--warning)', bg: 'var(--warning-background)' },
        void: { label: t('dashboardAdvance.dashboard.statusBadge.void'), color: 'var(--danger)', bg: 'var(--danger-background)' },
    };
    const s = map[status] ?? map.completed;

    return (
        <span
            className="rounded-full px-2 py-0.5 text-[10px] font-medium transition-colors"
            style={{
                backgroundColor: s.bg,
                color: s.color,
            }}
        >
            {s.label}
        </span>
    );
}
