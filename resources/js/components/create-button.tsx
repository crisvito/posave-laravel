import { Plus } from 'lucide-react';
import { ComponentProps } from 'react';
import { Button } from './ui';

interface CreateButtonProps extends ComponentProps<typeof Button> {
    label: string;
}

export function CreateButton({ label, className, ...props }: CreateButtonProps) {
    return (
        <Button
            {...props}
            aria-label={`Buat ${label}`}
            className={`bg-[var(--surface-header)] hover:bg-[var(--surface-header-hover)] ${className ?? ''}`}
        >
            <Plus className="mr-2 h-4 w-4" />
            {label}
        </Button>
    );
}
{
    /* <button
    onClick={onClick}
    className="flex items-center gap-2 rounded-lg bg-[var(--surface-header)] px-4 py-2 text-sm font-medium text-[var(--text-light)] transition-all hover:bg-[var(--surface-header-hover)]"
>
    <Plus className="h-4 w-4" aria-hidden="true" />
    {label}
</button>; */
}
