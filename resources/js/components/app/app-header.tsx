import { Breadcrumbs } from '@/components';
import { Button, Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui';
import { useInitials } from '@/hooks';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Menu, ChevronDown } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

// Menggunakan tipe any[] agar VS Code tidak memunculkan garis merah bergelombang lagi
const mainNavItems: any[] = [
    {
        title_id: 'Tentang Kami',
        title_en: 'About Us',
        routeName: 'home',
    },
    {
        title_id: 'Layanan',
        title_en: 'Services',
        routeName: 'service.index',
    },
    {
        title_id: 'Artikel',
        title_en: 'Articles',
        routeName: 'artikel.index',
    },
    {
        title_id: 'FAQ',
        title_en: 'FAQ',
        routeName: 'faq',
    },
    {
        title_id: 'Hubungi Kami',
        title_en: 'Contact Us',
        routeName: 'contact-us.index',
    },
];

interface AppHeaderProps {
    breadcrumbs?: BreadcrumbItem[];
}

export function AppHeader({ breadcrumbs = [] }: AppHeaderProps) {
    const page = usePage<SharedData>();
    const { auth, locale } = page.props;

    const getInitials = useInitials();
    
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const isActive = (routeName: string) => {
        if (!routeName) return false;
        return route().current(routeName);
    };

    const getHref = (item: any) => {
        if (item.routeName) {
            return route(item.routeName);
        }
        return item.url ?? '#';
    };

    return (
        <>
            <div className="sticky top-0 z-100 mx-auto w-full max-w px-8 pt-4 md:px-16">
                <div className="flex h-16 w-full items-center justify-between rounded-full bg-[#F2F3F5] px-6 shadow-sm border border-gray-200/20">
                    <div className="flex items-center gap-4">
                        {/* MOBILE MENU */}
                        <div className="lg:hidden">
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="icon" className="rounded-full">
                                        <Menu className="h-5 w-5" />
                                    </Button>
                                </SheetTrigger>

                                <SheetContent side="left" className="rounded-r-2xl">
                                    <SheetHeader>
                                        <SheetTitle>Menu</SheetTitle>
                                    </SheetHeader>

                                    <div className="mt-6 flex h-full flex-col space-y-4">
                                        <div className="flex flex-col space-y-4 text-sm">
                                            {mainNavItems.map((item) => (
                                                <Link
                                                    key={item.routeName}
                                                    href={getHref(item)}
                                                    className={`font-medium transition-colors py-1 px-2 rounded-lg ${
                                                        isActive(item.routeName) 
                                                            ? 'font-semibold bg-[#253342]/10 text-[#253342]' 
                                                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                                                    }`}
                                                >
                                                    {locale === 'en' ? item.title_en : item.title_id}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>

                        {/* LOGO */}
                        <Link href={route('home')} className="flex items-center h-8 min-w-[120px] relative">
                            <img 
                                src="/assets/landing-page/logo.png" 
                                alt="POSAVE" 
                                className="h-7 w-auto object-contain scale-500 pl-4.5" 
                            />
                        </Link>
                    </div>

                    {/* CENTER MENU */}
                    <div className="ml-25 hidden items-center gap-8 xl:gap-16 lg:flex">
                        {mainNavItems.map((item) => (
                            <Link
                                key={item.routeName}
                                href={getHref(item)}
                                className={`transition-all duration-200 text-[15px] relative py-1 ${
                                    isActive(item.routeName)
                                        ? 'font-bold text-[#253342]'
                                        : 'text-slate-600 font-medium hover:text-[#253342]'
                                }`}
                            >
                                {locale === 'en' ? item.title_en : item.title_id}
                            </Link>
                        ))}
                    </div>

                    {/* RIGHT ACTION BUTTONS & LANGUAGE SWITCH */}
                    <div className="hidden items-center space-x-4 lg:flex pr-5">
                        
                        {/* LANGUAGE SWITCH BUTTON (Sekarang berdampingan dengan tombol aksi) */}
                        <div className="relative inline-block text-left mr-5" ref={dropdownRef}>
                            <button
                                type="button"
                                onClick={() => setIsOpen(!isOpen)}
                                className="flex h-8 w-[86px] items-center justify-between rounded-full border border-gray-300 bg-white pl-2.5 pr-3 py-1 shadow-sm text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none"
                            >
                                <div className="flex items-center gap-1.5">
                                    <img 
                                        src={locale === 'id' ? "https://flagcdn.com/w40/id.png" : "https://flagcdn.com/w40/gb.png"} 
                                        alt={locale?.toUpperCase()} 
                                        className="h-3.5 w-5 rounded-xs object-cover border border-gray-100 shrink-0 shadow-xs"
                                    />
                                    <span className="uppercase text-[13px] text-[#253342]">{locale}</span>
                                </div>
                                <ChevronDown className="h-3 w-3 text-gray-400 shrink-0 transition-transform duration-200" />
                            </button>

                            {/* POPUP MENU LAYANG */}
                            {isOpen && (
                                <div className="absolute right-0 mt-1.5 w-28 origin-top-right rounded-xl border border-gray-200 bg-white p-1 shadow-xl ring-1 ring-black/5 focus:outline-none z-[9999]">
                                    <Link
                                        href={route('language.switch', 'id')}
                                        preserveScroll
                                        onClick={() => setIsOpen(false)}
                                        className={`flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-xs font-semibold transition-colors ${
                                            locale === 'id' 
                                                ? 'bg-[#233246]/10 text-[#233246] font-bold' 
                                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                        }`}
                                    >
                                        <img src="https://flagcdn.com/w40/id.png" alt="ID" className="h-3.5 w-5 object-cover rounded-xs border border-gray-100" />
                                        <span className="text-[13px]">ID</span>
                                    </Link>
                                    <Link
                                        href={route('language.switch', 'en')}
                                        preserveScroll
                                        onClick={() => setIsOpen(false)}
                                        className={`flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-xs font-semibold transition-colors ${
                                            locale === 'en' 
                                                ? 'bg-[#233246]/10 text-[#233246] font-bold' 
                                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                        }`}
                                    >
                                        <img src="https://flagcdn.com/w40/gb.png" alt="EN" className="h-3.5 w-5 object-cover rounded-xs border border-gray-100" />
                                        <span className="text-[13px]">EN</span>
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* TOMBOL REGISTRASI / AKSI UTAMA */}
                        {auth.user ? (
                            <>
                                <div className="flex items-center gap-3">
                                    <Button
                                        className="h-[42px] w-[140px] rounded-[12px] bg-[var(--primary-900)] text-white font-semibold shadow-sm transition-colors hover:bg-[var(--primary-800)]"
                                        asChild
                                    >
                                        <Link href={route('dashboard.index')}>
                                            Dashboard
                                        </Link>
                                    </Button>

                                    <Button
                                        variant="outline"
                                        className="h-[42px] w-[140px] rounded-[12px] border border-gray-300 bg-white text-[var(--primary-900)] font-semibold shadow-sm transition-colors hover:bg-gray-100"
                                        asChild
                                    >
                                        <Link href={route('logout')} method="post">
                                            Logout
                                        </Link>
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <Button
                                className="h-[42px] px-10 rounded-[12px] bg-[#233246] text-[14px] font-semibold text-white hover:bg-[#1b2736] shadow-sm transition-colors"
                                asChild
                            >
                                <Link href={route('register')}>
                                    {locale === 'en' ? 'Register' : 'Daftar'}
                                </Link>
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* BREADCRUMBS */}
            {breadcrumbs.length > 1 && (
                <div className="border-sidebar-border/70 mt-4 border-b">
                    <div className="mx-auto flex h-12 w-full items-center px-8 text-neutral-500 md:max-w-7xl">
                        <Breadcrumbs breadcrumbs={breadcrumbs} />
                    </div>
                </div>
            )}
        </>
    );
}