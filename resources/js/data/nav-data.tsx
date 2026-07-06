import type { NavItem } from '@/types';
import { BookOpen, Folder, Group, LayoutGrid, MessageCircle, Package, ReceiptPoundSterling, Settings } from 'lucide-react';

export const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        routeName: 'dashboard.index',
        icon: LayoutGrid,
    },
    {
        title: 'Penyimpanan',
        url: '#',
        icon: Package,
        routeName: '',
        children: [
            {
                title: 'Daftar Barang',
                routeName: 'dashboard.inventory.items.index',
            },
            {
                title: 'Pemasok',
                routeName: 'dashboard.inventory.suppliers.index',
            },
            {
                title: 'Pembelian',
                routeName: 'dashboard.inventory.purchase-orders.index',
            },
            {
                title: 'Kiriman',
                routeName: 'dashboard.inventory.transfers.index',
            },
            {
                title: 'Perubahan',
                routeName: 'dashboard.inventory.adjustments.index',
            },
            {
                title: 'Kategori',
                routeName: 'dashboard.inventory.categories.index',
            },
        ],
    },
    {
        title: 'Karyawan',
        icon: Group,
        routeName: '',
        children: [
            {
                title: 'Daftar Karyawan',
                routeName: '',
            },
            {
                title: 'Akses Karyawan',
                routeName: '',
            },
        ],
    },
    {
        title: 'Laporan',
        routeName: '',
        icon: ReceiptPoundSterling,
    },
    {
        title: 'Pesan',
        routeName: '',
        icon: MessageCircle,
    },
    {
        title: 'Pengaturan',
        icon: Settings,
        routeName: '',
        children: [
            {
                title: 'Profil',
                routeName: 'settings.profile.edit',
            },
            {
                title: 'Bukti Bayar',
                routeName: 'dashboard.settings.receipt', // dashboard.settings.receipt
            },
            {
                title: 'Toko',
                routeName: 'dashboard.settings.store', // dashboard.settings.store
            },
        ],
    },
];

export const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        url: 'https://github.com/laravel/react-starter-kit',
        routeName: '',
        icon: Folder,
    },
    {
        title: 'Documentation',
        url: 'https://laravel.com/docs/starter-kits',
        routeName: '',
        icon: BookOpen,
    },
];
