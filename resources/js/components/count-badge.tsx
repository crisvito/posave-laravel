interface CountBadgeProps {
    label: string;
    count: number;
}

export function CountBadge({ label, count }: CountBadgeProps) {
    return (
        <div
            aria-label={`${label}: ${count}`}
            className="flex items-center gap-2 rounded-lg border border-[var(--border-strong)] bg-[var(--neutral-white)] px-4 py-2 dark:bg-[var(--primary-900)]"
        >
            <span className="text-sm text-[var(--grey-text)]">{label} :</span>
            <span className="text-sm font-medium text-[var(--grey-text)]">{count}</span>
        </div>
    );
}
