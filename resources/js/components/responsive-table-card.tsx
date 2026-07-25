import type { ReactNode } from 'react';

interface ResponsiveTableCardProps {
    children: ReactNode;
    className?: string;
}

export function ResponsiveTableCard({ children, className = '' }: ResponsiveTableCardProps) {
    return (
        <div className={`min-w-0 overflow-hidden rounded-2xl border border-[var(--border-strong)] bg-[var(--card)] shadow-sm ${className}`}>
            <div className="min-w-0 overflow-x-auto">{children}</div>
        </div>
    );
}
