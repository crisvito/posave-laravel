import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
    {
        variants: {
            variant: {
                default: 'bg-[var(--primary-900)] text-white hover:opacity-90 dark:border dark:border-[var(--border-strong)] dark:bg-[var(--card)] dark:text-white dark:hover:bg-[var(--second-accent)]',
                destructive: 'bg-[var(--danger)] text-white hover:opacity-90',
                outline: 'border border-[var(--border-strong)] bg-transparent text-[var(--subheading)] hover:bg-[var(--surface-badge)] dark:border-[var(--border-strong)] dark:text-white dark:hover:bg-[var(--second-accent)]',
                secondary: 'border border-transparent bg-[var(--second-accent)] text-[var(--subheading)] shadow-sm hover:bg-[var(--surface-badge)] dark:border-[var(--border-strong)] dark:bg-[var(--card)] dark:text-white dark:hover:bg-[var(--second-accent)]',
                ghost: 'text-[var(--subheading)] hover:bg-[var(--surface-badge)] dark:text-white dark:hover:bg-[var(--second-accent)]',
                link: 'text-[var(--secondary-600)] underline-offset-4 hover:underline',
            },
            size: {
                default: 'h-10 px-4 py-2',
                sm: 'h-9 rounded-md px-3',
                lg: 'h-11 rounded-md px-8',
                icon: 'h-10 w-10',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    }
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
});
Button.displayName = 'Button';

export { Button, buttonVariants };