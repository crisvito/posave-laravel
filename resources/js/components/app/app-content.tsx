import { SidebarInset } from '@/components/ui/sidebar';
import * as React from 'react';

interface AppContentProps extends React.ComponentProps<'div'> {
    variant?: 'header' | 'sidebar';
}

export function AppContent({ variant = 'header', children, className = '', ...props }: AppContentProps) {
    if (variant === 'sidebar') {
        return (
            <SidebarInset className={`min-w-0 ${className}`} {...props}>
                {children}
            </SidebarInset>
        );
    }

    return (
        <main className={`mx-auto flex w-full max-w-7xl flex-col gap-8 px-8 md:px-16 ${className}`} {...props}>
            {children}
        </main>
    );
}
