import { cn } from '@/lib/utils';
import * as React from 'react';

interface SocialLoginButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    provider: 'google' | 'facebook';
    icon: React.ReactNode;
}

export function SocialLoginButton({ provider, icon, className, children, ...props }: SocialLoginButtonProps) {
    return (
        <a
            href={route(`auth.${provider}.redirect`)}
            className={cn(
                'flex w-full items-center justify-center gap-2 rounded-md border border-[var(--border-strong)] bg-transparent px-4 py-2 text-sm font-medium text-[var(--subheading)] transition-colors hover:bg-[var(--second-accent)] dark:text-[var(--neutral-white)] dark:hover:bg-white/10',
                className,
            )}
            {...props}
        >
            {icon}
            {children}
        </a>
    );
}
