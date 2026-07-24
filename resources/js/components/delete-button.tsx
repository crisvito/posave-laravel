import { ComponentProps } from 'react';
import { Button } from './ui';

interface DeleteButtonProps extends ComponentProps<typeof Button> {
    label: string;
}

export function DeleteButton({ label, className, ...props }: DeleteButtonProps) {
    return (
        <Button
            variant="outline"
            {...props}
            aria-label={`Hapus ${label}`}
            className={`rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-500 transition-all hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-900/30 ${className ?? ''}`}
        >
            {label}
        </Button>
    );
}
