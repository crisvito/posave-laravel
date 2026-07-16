import type { ReactNode } from 'react';

interface SettingsCardProps {
    title: string;
    children: ReactNode;
    className?: string;
}

export function SettingsCard({ title, children, className = '' }: SettingsCardProps) {
    return (
        <div
            className={`overflow-hidden rounded-2xl border border-[var(--border-strong)] bg-[var(--neutral-white)] shadow-sm dark:border-[var(--border-strong)] dark:bg-[var(--card)] ${className}`}
        >
            <div className="border-b border-[var(--border-strong)] bg-[var(--surface-header)] px-4 py-3 sm:px-6 sm:py-4">
                <h2 className="text-sm font-medium text-[var(--text-light)]">{title}</h2>
            </div>
            <div className="p-4 sm:p-6">{children}</div>
        </div>
    );
}
