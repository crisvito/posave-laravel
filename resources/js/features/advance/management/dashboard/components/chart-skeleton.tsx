export function ChartSkeleton({ className }: { className?: string }) {
    return <div className={`animate-pulse rounded-lg bg-[var(--second-accent)] dark:bg-[var(--border-strong)] ${className ?? 'h-[240px]'}`} />;
}
