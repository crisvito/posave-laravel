import { ComponentProps } from 'react';
import { Button } from './ui';

interface EditButtonProps extends ComponentProps<typeof Button> {
    label: string;
}

export function EditButton({ label, className, ...props }: EditButtonProps) {
    return (
        <Button
            {...props}
            aria-label={`Edit ${label}`}
            className={`rounded-lg border border-[var(--border-strong)] px-3 py-1.5 text-xs font-medium text-[var(--grey-text)] transition-all hover:bg-[var(--second-accent)] dark:border-[var(--border-strong)] dark:text-white dark:hover:bg-[var(--border-strong)] ${className ?? ''}`}
        >
            {label}
        </Button>
    );
}
