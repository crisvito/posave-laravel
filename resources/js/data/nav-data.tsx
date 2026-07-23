import type { NavItem } from '@/types';
import {
    BookOpen,
    Building,
    ClipboardList,
    Folder,
    Group,
    LayoutGrid,
    MessageCircle,
    Package,
    ReceiptPoundSterling,
    ShoppingCart,
} from 'lucide-react';

export const mainNavItems: NavItem[] = [
    {
        title: 'dashboardAdvance.sidebar.dashboard',
        routeName: 'dashboard.index',
        icon: LayoutGrid,
    },
    {
        title: 'dashboardAdvance.sidebar.storage',
        url: '#',
        icon: Package,
        routeName: '',
        children: [
            {
                title: 'dashboardAdvance.sidebar.itemsList',
                routeName: 'dashboard.inventory.items.index',
            },
            {
                title: 'dashboardAdvance.sidebar.suppliers',
                routeName: 'dashboard.inventory.suppliers.index',
            },
            {
                title: 'dashboardAdvance.sidebar.purchaseOrders',
                routeName: 'dashboard.inventory.purchase-orders.index',
            },
            {
                title: 'dashboardAdvance.sidebar.transfers',
                routeName: 'dashboard.inventory.transfers.index',
            },
            {
                title: 'dashboardAdvance.sidebar.adjustments',
                routeName: 'dashboard.inventory.adjustments.index',
            },
            {
                title: 'dashboardAdvance.sidebar.categories',
                routeName: 'dashboard.inventory.categories.index',
            },
        ],
    },
    {
        title: 'dashboardAdvance.sidebar.employees',
        icon: Group,
        routeName: 'dashboard.employees.index',
    },
    {
        title: 'dashboardAdvance.sidebar.reports',
        routeName: 'dashboard.reports.index',
        icon: ReceiptPoundSterling,
    },
    {
        title: 'dashboardAdvance.sidebar.messages',
        routeName: 'messaging.index',
        icon: MessageCircle,
    },
    {
        title: 'dashboardAdvance.sidebar.settings',
        routeName: '',
        icon: Building,
        children: [
            {
                title: 'dashboardAdvance.sidebar.settingsCompany',
                routeName: 'settings.company-profile',
            },
            {
                title: 'dashboardAdvance.sidebar.settingsReceipt',
                routeName: 'settings.receipt',
            },
            {
                title: 'dashboardAdvance.sidebar.settingsBranches',
                routeName: 'settings.branches',
            },
        ],
    },
];

export const branchManagerNavItems: NavItem[] = [
    {
        title: 'dashboardAdvance.sidebar.dashboard',
        routeName: 'dashboard.index',
        icon: LayoutGrid,
    },
    {
        title: 'dashboardAdvance.sidebar.storage',
        url: '#',
        icon: Package,
        routeName: '',
        children: [
            {
                title: 'dashboardAdvance.sidebar.itemsList',
                routeName: 'dashboard.inventory.items.index',
            },
            {
                title: 'dashboardAdvance.sidebar.purchaseOrders',
                routeName: 'dashboard.inventory.purchase-orders.index',
            },
            {
                title: 'dashboardAdvance.sidebar.transfers',
                routeName: 'dashboard.inventory.transfers.index',
            },
            {
                title: 'dashboardAdvance.sidebar.adjustments',
                routeName: 'dashboard.inventory.adjustments.index',
            },
        ],
    },
    {
        title: 'dashboardAdvance.sidebar.employees',
        icon: Group,
        routeName: 'dashboard.employees.index',
    },
    {
        title: 'dashboardAdvance.sidebar.reports',
        routeName: 'dashboard.reports.index',
        icon: ReceiptPoundSterling,
    },
    {
        title: 'dashboardAdvance.sidebar.messages',
        routeName: 'messaging.index',
        icon: MessageCircle,
    },
];

export const cashierNavItems: NavItem[] = [
    {
        title: 'cashier.sidebar.orders',
        routeName: 'cashier.order.index',
        icon: ShoppingCart,
    },
    {
        title: 'cashier.sidebar.orderHistory',
        routeName: 'cashier.history.index',
        icon: ClipboardList,
    },
    {
        title: 'cashier.sidebar.messages',
        routeName: 'messaging.index',
        icon: MessageCircle,
    },
];

export const liteNavItems: NavItem[] = [
    {
        title: 'dashboardLite.sidebar.dashboard',
        routeName: 'dashboard.index',
        icon: LayoutGrid,
    },
    {
        title: 'dashboardLite.sidebar.storage',
        url: '#',
        icon: Package,
        routeName: '',
        children: [
            { title: 'dashboardLite.sidebar.itemsList', routeName: 'lite.inventory.items.index' },
            { title: 'dashboardLite.sidebar.adjustments', routeName: 'lite.inventory.adjustments.index' },
            { title: 'dashboardLite.sidebar.categories', routeName: 'lite.inventory.categories.index' },
        ],
    },
    {
        title: 'dashboardLite.sidebar.orders',
        routeName: 'lite.order.index',
        icon: ShoppingCart,
    },
    {
        title: 'dashboardLite.sidebar.orderHistory',
        routeName: 'lite.history.index',
        icon: ClipboardList,
    },
    {
        title: 'dashboardLite.sidebar.settings',
        url: '#',
        icon: Building,
        routeName: '',
        children: [
            { title: 'dashboardLite.sidebar.settingsProfile', routeName: 'lite.settings.profile.index' },
            { title: 'dashboardLite.sidebar.settingsReceipt', routeName: 'lite.settings.receipt.index' },
        ],
    },
];

export const footerNavItems: NavItem[] = [
    {
        title: 'shared.sidebarFooter.repository',
        url: 'https://github.com/laravel/react-starter-kit',
        routeName: '',
        icon: Folder,
    },
    {
        title: 'shared.sidebarFooter.documentation',
        url: 'https://laravel.com/docs/starter-kits',
        routeName: '',
        icon: BookOpen,
    },
];
