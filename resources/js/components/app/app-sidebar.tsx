import { AppLogo, NavMain, NavUser } from '@/components';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { mainNavItems } from '@/data';
import type { NavItem } from '@/types';
import { Link } from '@inertiajs/react';

interface AppSidebarProps {
    items?: NavItem[];
}

export function AppSidebar({ items = mainNavItems }: AppSidebarProps) {
    return (
        <Sidebar collapsible="icon" variant="inset" className="bg-[var(--sidebar)] text-[var(--white)] dark:border-r-1 dark:border-(--background)">
            <SidebarHeader className="border-b-0 bg-[var(--sidebar)] text-[var(--white)]">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            size="lg"
                            className="text-[var(--white)] hover:bg-transparent hover:text-[var(--white)] data-[active=true]:bg-transparent data-[active=true]:text-[var(--white)]"
                        >
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="bg-[var(--sidebar)] text-[var(--white)]">
                <NavMain items={items} />
            </SidebarContent>

            <SidebarFooter className="border-t border-white/10 bg-[var(--sidebar)] text-[var(--white)]">
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
