import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    NotificationBadge,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

import { useLanguage } from '@/hooks';
import { type NavItem } from '@/types';

import { useMessagingNotifications } from '@/features/messaging/notifications-context';
import { Link } from '@inertiajs/react';
import { ChevronDown } from 'lucide-react';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const { state, isMobile } = useSidebar();
    const { t } = useLanguage();
    const { unreadCount } = useMessagingNotifications();
    const isCollapsed = state === 'collapsed' && !isMobile;

    const isItemActive = (item: NavItem) => {
        if (!item.routeName) return false;

        return route().current(item.routeName);
    };

    const getHref = (item: NavItem) => {
        if (item.routeName) {
            return route(item.routeName);
        }

        return item.url ?? '#';
    };

    const getBadgeCount = (item: NavItem) => (item.routeName === 'messaging.index' ? unreadCount : 0);

    return (
        <SidebarGroup>
            <SidebarGroupContent>
                <SidebarMenu className="gap-3">
                    {items.map((item) => {
                        const isActive = isItemActive(item);

                        const hasActiveChild = item.children?.some((child) => isItemActive(child)) ?? false;

                        if (item.children && isCollapsed) {
                            return (
                                <SidebarMenuItem key={item.title}>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <SidebarMenuButton
                                                tooltip={t(item.title)}
                                                isActive={hasActiveChild}
                                                className="!text-[var(--white)] hover:!bg-[var(--primary-700)] data-[active=true]:!bg-[var(--neutral-white)] data-[active=true]:!text-[var(--primary-900)] [&_svg]:!text-[var(--white)] data-[active=true]:[&_svg]:!text-[var(--primary-900)]"
                                            >
                                                {item.icon && <item.icon />}
                                            </SidebarMenuButton>
                                        </DropdownMenuTrigger>

                                        <DropdownMenuContent side="right" align="start" className="w-56">
                                            <div className="px-2 py-1.5 text-sm font-semibold">{t(item.title)}</div>

                                            <DropdownMenuSeparator />

                                            {item.children.map((child) => {
                                                const isChildActive = isItemActive(child);

                                                return (
                                                    <DropdownMenuItem
                                                        key={child.title}
                                                        asChild
                                                        className={
                                                            isChildActive
                                                                ? 'cursor-pointer !bg-[var(--neutral-white)] font-medium !text-[var(--primary-900)]'
                                                                : ''
                                                        }
                                                    >
                                                        <Link href={getHref(child)}>{t(child.title)}</Link>
                                                    </DropdownMenuItem>
                                                );
                                            })}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </SidebarMenuItem>
                            );
                        }

                        if (item.children) {
                            return (
                                <Collapsible key={item.title} defaultOpen={hasActiveChild}>
                                    <SidebarMenuItem>
                                        <CollapsibleTrigger asChild className="cursor-pointer">
                                            <SidebarMenuButton
                                                tooltip={t(item.title)}
                                                isActive={hasActiveChild}
                                                className="!text-[var(--white)] hover:!bg-[var(--primary-700)] data-[active=true]:!bg-[var(--neutral-white)] data-[active=true]:!text-[var(--primary-900)] [&_svg]:!text-[var(--white)] data-[active=true]:[&_svg]:!text-[var(--primary-900)]"
                                            >
                                                {item.icon && <item.icon />}

                                                <span>{t(item.title)}</span>

                                                <ChevronDown className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
                                            </SidebarMenuButton>
                                        </CollapsibleTrigger>

                                        <CollapsibleContent>
                                            <div className="mt-1 ml-8 flex flex-col gap-1 border-l border-white/10 pl-4">
                                                {item.children.map((child) => {
                                                    const isChildActive = isItemActive(child);

                                                    return (
                                                        <Link
                                                            key={child.title}
                                                            href={getHref(child)}
                                                            className={`block rounded-md px-3 py-2 text-sm transition ${
                                                                isChildActive
                                                                    ? 'cursor-pointer !bg-[var(--neutral-white)] font-medium !text-[var(--primary-900)]'
                                                                    : '!text-[var(--white)] hover:!bg-[var(--primary-700)]'
                                                            }`}
                                                        >
                                                            {t(child.title)}
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        </CollapsibleContent>
                                    </SidebarMenuItem>
                                </Collapsible>
                            );
                        }

                        const badgeCount = getBadgeCount(item);

                        return (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton
                                    asChild
                                    isActive={isActive}
                                    tooltip={t(item.title)}
                                    className="!text-[var(--white)] hover:!bg-[var(--primary-700)] data-[active=true]:!bg-[var(--neutral-white)] data-[active=true]:!text-[var(--primary-900)] [&_svg]:!text-[var(--white)] data-[active=true]:[&_svg]:!text-[var(--primary-900)]"
                                >
                                    <Link href={getHref(item)} className="relative flex w-full items-center gap-2 !text-[var(--white)]">
                                        {item.icon && <item.icon />}

                                        <span>{t(item.title)}</span>

                                        {badgeCount > 0 && (
                                            <NotificationBadge
                                                count={badgeCount}
                                                className={isCollapsed ? 'absolute -top-1.5 -right-1.5 h-4 min-w-4 px-1 text-[9px]' : 'ml-auto'}
                                            />
                                        )}
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        );
                    })}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
}
