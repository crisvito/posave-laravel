import { Breadcrumbs } from '@/components';
import {
    Button,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    Sheet,
    SheetContent,
    SheetDescription,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui';
import { AppearanceToggle } from '@/features/company-profile/components';
import { useInitials, useLanguage } from '@/hooks';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Check, Globe, Menu } from 'lucide-react';

interface CompanyNavItem {
    key: string;
    routeName: string;
}

const mainNavItems: CompanyNavItem[] = [
    { key: 'shared.nav.home', routeName: 'home' },
    { key: 'shared.nav.services', routeName: 'service.index' },
    { key: 'shared.nav.articles', routeName: 'artikel.index' },
    { key: 'shared.nav.faq', routeName: 'faq' },
    { key: 'shared.nav.contact', routeName: 'contact-us.index' },
];

interface AppHeaderProps {
    breadcrumbs?: BreadcrumbItem[];
}

export function AppHeader({ breadcrumbs = [] }: AppHeaderProps) {
    const page = usePage<SharedData>();
    const { auth } = page.props;

    const getInitials = useInitials();
    const { locale, setLocale, t } = useLanguage();

    const isActive = (routeName: string) => {
        if (!routeName) return false;

        return route().current(routeName);
    };

    const getHref = (item: CompanyNavItem) => route(item.routeName);

    const LanguageSwitcher = () => (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="h-10 cursor-pointer gap-1.5 rounded-full px-3 text-sm font-medium text-[var(--grey-text)] hover:bg-[var(--secondary-600)]/10 hover:text-[var(--secondary-600)]"
                >
                    <Globe className="h-4 w-4" />
                    {locale.toUpperCase()}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-40">
                <DropdownMenuItem onClick={() => setLocale('id')} className="flex cursor-pointer items-center justify-between gap-2">
                    {t('shared.language.id')}
                    {locale === 'id' && <Check className="h-4 w-4 text-[var(--secondary-600)]" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLocale('en')} className="flex cursor-pointer items-center justify-between gap-2">
                    {t('shared.language.en')}
                    {locale === 'en' && <Check className="h-4 w-4 text-[var(--secondary-600)]" />}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );

    return (
        <>
            <div className="sticky top-0 z-50 mx-auto w-full max-w-7xl px-8 pt-4 md:px-16">
                <div className="flex h-16 w-full items-center justify-between rounded-full border border-[var(--border-strong)] bg-[var(--card)] px-5 shadow-sm lg:px-15">
                    <div className="flex items-center gap-4">
                        <div className="lg:hidden">
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="icon" className="text-[var(--foreground)] hover:bg-[var(--second-accent)]">
                                        <Menu className="h-5 w-5" />
                                    </Button>
                                </SheetTrigger>

                                <SheetContent
                                    side="left"
                                    className="w-1/2 max-w-[50vw] border-[var(--border-strong)] bg-[var(--card)] text-[var(--foreground)]"
                                >
                                    <SheetTitle className="sr-only">{t('shared.nav.home')}</SheetTitle>
                                    <SheetDescription className="sr-only">Navigation menu</SheetDescription>
                                    <div className="z-100 mt-6 flex h-full flex-col space-y-6">
                                        <div className="flex flex-col space-y-4 text-sm">
                                            {mainNavItems.map((item) => (
                                                <Link
                                                    key={item.key}
                                                    href={getHref(item)}
                                                    className={`font-medium transition-colors ${
                                                        isActive(item.routeName)
                                                            ? 'font-semibold text-[var(--secondary-600)]'
                                                            : 'text-[var(--grey-text)] hover:text-[var(--secondary-600)]'
                                                    }`}
                                                >
                                                    {t(item.key)}
                                                </Link>
                                            ))}
                                            <Button
                                                variant="outline"
                                                className="h-[44px] rounded-[10px] border-[var(--secondary-600)] px-6 text-[15px] font-semibold text-[var(--secondary-600)] hover:bg-[var(--secondary-600)]/10"
                                                asChild
                                            >
                                                <Link href={route('dashboard.index')}>{t('shared.nav.dashboard')}</Link>
                                            </Button>
                                        </div>

                                        <div className="jlg:flex flex flex-col items-start gap-2 border-t border-[var(--border-strong)] pt-4 lg:items-center">
                                            <LanguageSwitcher />
                                            <AppearanceToggle />
                                        </div>
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>

                        <Link href={route('home')} className="flex items-center">
                            <img
                                src="/assets/landing-page/logo.png"
                                alt="POSAVE"
                                className="ml-5 h-3 w-auto scale-350 dark:brightness-0 dark:invert"
                            />
                        </Link>
                    </div>

                    <div className="ml-25 hidden items-center gap-10 lg:flex">
                        {mainNavItems.map((item) => (
                            <Link
                                key={item.key}
                                href={getHref(item)}
                                className={`transition-colors ${
                                    isActive(item.routeName)
                                        ? 'font-semibold text-[var(--secondary-600)]'
                                        : 'text-[var(--grey-text)] hover:text-[var(--secondary-600)]'
                                }`}
                            >
                                {t(item.key)}
                            </Link>
                        ))}
                    </div>

                    <div className="hidden items-center gap-3 lg:flex">
                        <AppearanceToggle />
                        <LanguageSwitcher />

                        {auth?.user ? (
                            <>
                                <Button
                                    variant="outline"
                                    className="h-[44px] rounded-[10px] border-[var(--secondary-600)] px-6 text-[15px] font-semibold text-[var(--secondary-600)] hover:bg-[var(--secondary-600)]/10"
                                    asChild
                                >
                                    <Link href={route('dashboard.index')}>{t('shared.nav.dashboard')}</Link>
                                </Button>
                            </>
                        ) : (
                            <Button
                                className="h-[44px] rounded-[10px] bg-[var(--secondary-600)] px-6 text-[15px] font-semibold text-white hover:bg-[var(--secondary-700)]"
                                asChild
                            >
                                <Link href={route('login')}>{t('shared.nav.login')}</Link>
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {breadcrumbs.length > 1 && (
                <div className="mt-4 border-b border-[var(--border-strong)]">
                    <div className="mx-auto flex h-12 w-full items-center px-4 text-[var(--grey-text-muted)] md:max-w-7xl">
                        <Breadcrumbs breadcrumbs={breadcrumbs} />
                    </div>
                </div>
            )}
        </>
    );
}
