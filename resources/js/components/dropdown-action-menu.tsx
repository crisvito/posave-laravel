import type { LucideIcon } from 'lucide-react';

interface DropdownActionMenuItem {
    label: string;
    icon: LucideIcon;
    onClick: () => void;
    variant?: 'default' | 'danger' | 'success' | 'warning';
}

interface DropdownActionMenuProps {
    position: { top: number; left: number };
    onClose: () => void;
    items: DropdownActionMenuItem[];
    width?: string;
}

const VARIANT_STYLES: Record<string, string> = {
    default: 'bg-[var(--secondary-600)]/10 text-[var(--secondary-600)] hover:bg-[var(--secondary-600)]/20',
    danger: 'bg-[var(--danger-background)] text-[var(--danger)] hover:opacity-80',
    success: 'bg-[var(--success-background)] text-[var(--success)] hover:opacity-80',
    warning: 'bg-[var(--warning-background)] text-[var(--warning)] hover:opacity-80',
};

export function DropdownActionMenu({ position, onClose, items, width = 'w-36' }: DropdownActionMenuProps) {
    return (
        <>
            <div className="fixed inset-0 z-40" onClick={onClose} />
            <div
                className={`fixed z-50 ${width} overflow-hidden rounded-xl border border-[var(--border-strong)] bg-[var(--card)] shadow-lg`}
                style={{ top: position.top, left: position.left }}
            >
                {items.map((item, i) => (
                    <button
                        key={i}
                        onClick={item.onClick}
                        className={`flex w-full items-center gap-2 px-4 py-3 text-sm font-medium ${VARIANT_STYLES[item.variant ?? 'default']}`}
                    >
                        <item.icon className="h-4 w-4" />
                        {item.label}
                    </button>
                ))}
            </div>
        </>
    );
}
