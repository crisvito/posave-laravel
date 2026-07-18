import { AppContent, AppFooter, AppHeader, AppShell } from '@/components';
import { type BreadcrumbItem } from '@/types';

interface AppHeaderLayoutProps {
    children: React.ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export function AppHeaderLayout({ children, breadcrumbs }: AppHeaderLayoutProps) {
    return (
        <AppShell>
            {/* Wrapper flexbox agar layout penuh satu layar */}
            <div className="flex min-h-screen flex-col">
                {/* 1. Header di paling atas */}
                <AppHeader breadcrumbs={breadcrumbs} />

                {/* 2. Konten utama (flex-1 akan mendorong footer ke bawah) */}
                <main className="flex-1">
                    <AppContent>{children}</AppContent>
                </main>

                {/* 3. Footer di paling bawah */}
                <AppFooter />
            </div>
        </AppShell>
    );
}
