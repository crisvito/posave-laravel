interface NotificationBadgeProps {
    count: number;
    className?: string;
}

export function NotificationBadge({ count, className = '' }: NotificationBadgeProps) {
    if (count <= 0) return null;

    return (
        <span
            className={`flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--danger)] px-1.5 text-[10px] font-bold text-white ${className}`}
        >
            {count > 99 ? '99+' : count}
        </span>
    );
}
