import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User | null;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    routeName: string;
    url?: string;
    icon?: LucideIcon;

    children?: {
        title: string;
        routeName: string;
        url?: string;
    }[];
}
export interface SharedData {
    name: string;
    quote: {
        message: string;
        author: string;
    };

    auth: Auth;

    locale: 'id' | 'en';

    translations: Record<string, Record<string, string>>;

    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}
