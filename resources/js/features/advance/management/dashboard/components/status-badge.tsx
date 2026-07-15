/** Badge status transaksi (completed/refunded/void) dengan warna semantik. */
export function StatusBadge({ status }: { status: string }) {
    const map: Record<string, { label: string; color: string; bg: string }> = {
        completed: { label: 'Selesai', color: 'var(--success)', bg: 'var(--success-background)' },
        refunded: { label: 'Refund', color: 'var(--warning)', bg: 'var(--warning-background)' },
        void: { label: 'Batal', color: 'var(--danger)', bg: 'var(--danger-background)' },
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
