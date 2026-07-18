import { Breadcrumbs } from '@/components';
import { Button, Sheet, SheetContent, SheetTrigger } from '@/components/ui';
import { useInitials } from '@/hooks';
import { type BreadcrumbItem, type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Menu } from 'lucide-react';

const mainNavItems: NavItem[] = [
    {
        title: 'Beranda',
        routeName: 'home',
    },
    {
        title: 'Layanan',
        routeName: 'service.index',
    },
    {
        title: 'Artikel',
        routeName: 'artikel.index',
    },
    {
        title: 'FAQ',
        routeName: 'faq',
    },
    {
        title: 'Hubungi Kami',
        routeName: 'contact-us.index',
    },
];

interface AppHeaderProps {
    breadcrumbs?: BreadcrumbItem[];
}

export function AppHeader({ breadcrumbs = [] }: AppHeaderProps) {
    const page = usePage<SharedData>();
    const { auth } = page.props;

    const getInitials = useInitials();

    const isActive = (routeName: string) => {
        if (!routeName) return false;

        return route().current(routeName);
    };

    const getHref = (item: NavItem) => {
        if (item.routeName) {
            return route(item.routeName);
        }

        return item.url ?? '#';
    };

    return (
        <>
            <div className="sticky top-0 z-50 mx-auto w-full max-w-7xl px-8 pt-4 md:px-16">
                <div className="flex h-16 w-full items-center justify-between rounded-full bg-[#F2F3F5] px-5 shadow-sm lg:px-15 dark:border dark:border-[var(--border-strong)] dark:bg-[var(--primary-900)]">
                    <div className="flex items-center gap-4">
                        {/* MOBILE MENU */}
                        <div className="lg:hidden">
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="icon" className="dark:text-[var(--neutral-white)] dark:hover:bg-white/10">
                                        <Menu className="h-5 w-5" />
                                    </Button>
                                </SheetTrigger>

                                <SheetContent
                                    side="left"
                                    className="w-1/2 dark:border-[var(--border-strong)] dark:bg-[var(--primary-900)] dark:text-[var(--neutral-white)]"
                                >
                                    <div className="z-100 mt-6 flex h-full flex-col space-y-4">
                                        <div className="flex flex-col space-y-4 text-sm">
                                            {mainNavItems.map((item) => (
                                                <Link
                                                    key={item.title}
                                                    href={getHref(item)}
                                                    className={`font-medium transition-colors ${
                                                        isActive(item.routeName)
                                                            ? 'font-semibold text-[#253342] dark:text-[var(--neutral-white)]'
                                                            : 'hover:text-slate-600 dark:text-slate-400 dark:hover:text-[var(--neutral-white)]'
                                                    }`}
                                                >
                                                    {item.title}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>

                        {/* LOGO */}
                        <Link href={route('home')} className="flex items-center">
                            <img
                                src="/assets/landing-page/logo.png"
                                alt="POSAVE"
                                className="ml-5 h-[34px] w-auto scale-350 dark:brightness-0 dark:invert"
                            />
                        </Link>
                    </div>

                    {/* CENTER MENU */}
                    <div className="ml-25 hidden items-center gap-10 lg:flex">
                        {mainNavItems.map((item) => (
                            <Link
                                key={item.title}
                                href={getHref(item)}
                                className={`transition-colors ${
                                    isActive(item.routeName)
                                        ? 'font-semibold text-[#253342] dark:text-[var(--neutral-white)]'
                                        : 'text-slate-700 hover:text-slate-500 dark:text-slate-400 dark:hover:text-[var(--neutral-white)]'
                                }`}
                            >
                                {item.title}
                            </Link>
                        ))}
                    </div>

                    {/* RIGHT BUTTON */}
                    <div className="hidden items-center space-x-4 lg:flex">
                        {auth?.user ? (
                            <>
                                <Button
                                    variant="outline"
                                    className="h-[44px] rounded-[10px] border-[#233246] px-6 text-[15px] font-semibold text-[#233246] dark:border-[var(--neutral-white)] dark:text-[var(--neutral-white)] dark:hover:bg-[var(--neutral-white)] dark:hover:text-[#233246]"
                                    asChild
                                >
                                    <Link href={route('dashboard.index')}>Dashboard</Link>
                                </Button>

                                <Button
                                    className="h-[44px] rounded-[10px] bg-[#233246] px-6 text-[15px] font-semibold text-white hover:bg-[#1b2736] dark:bg-[var(--neutral-white)] dark:text-[#233246] dark:hover:bg-slate-200"
                                    asChild
                                >
                                    <Link href={route('logout')} method="post">
                                        Logout
                                    </Link>
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button>
                                    <Link href={route('login')}>Masuk</Link>
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* BREADCRUMBS */}
            {breadcrumbs.length > 1 && (
                <div className="border-sidebar-border/70 mt-4 border-b dark:border-[var(--border-strong)]">
                    <div className="mx-auto flex h-12 w-full items-center px-4 text-neutral-500 md:max-w-7xl dark:text-neutral-400">
                        <Breadcrumbs breadcrumbs={breadcrumbs} />
                    </div>
                </div>
            )}
        </>
    );
}
