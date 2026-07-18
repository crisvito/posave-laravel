import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/hooks';
import { AppLayout } from '@/layouts';
import { pickLocale } from '@/lib/i18n/pick';
import { Head, Link } from '@inertiajs/react';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import { useState } from 'react';

interface ArticleCategoryProp {
    id: number;
    name: string;
    name_en: string | null;
    slug: string;
}

interface ArticleProp {
    id: number;
    title: string;
    title_en: string | null;
    excerpt: string;
    excerpt_en: string | null;
    image: string | null;
    read_time_minutes: number;
    published_at: string | null;
    category: ArticleCategoryProp;
}

interface BlogProps {
    featured: ArticleProp | null;
    articles: ArticleProp[];
    categories: ArticleCategoryProp[];
}

export default function Blog({ featured, articles, categories }: BlogProps) {
    const { locale, t } = useLanguage();
    const [activeCategory, setActiveCategory] = useState<number | null>(null);
    const filteredArticles = activeCategory === null ? articles : articles.filter((article) => article.category.id === activeCategory);

    const formatDate = (value: string | null) => {
        if (!value) return '';
        return new Date(value).toLocaleDateString(locale === 'en' ? 'en-US' : 'id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    return (
        <AppLayout>
            <Head title={t('companyProfile.blog.pageTitle')} />
            <div className="mx-auto space-y-16 py-10 font-sans">
                <section className="relative flex min-h-[350px] w-full items-center overflow-hidden rounded-[2.5rem] border border-[var(--border-strong)] bg-[var(--card)]">
                    <div className="absolute top-0 right-0 z-0 flex h-full w-full justify-end md:w-[95%]">
                        <img
                            src="/assets/blog/hero-blog.png"
                            alt="Cerita dan Tips Bisnis POSAVE"
                            className="h-full w-full object-cover object-left"
                        />
                        <div className="absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[var(--card)] to-transparent md:w-32"></div>
                    </div>

                    <div className="relative z-20 w-full space-y-3 p-12 sm:p-12 md:w-[60%]">
                        <h1 className="text-3xl leading-[1.25] font-extrabold tracking-tight text-[var(--foreground)] md:text-4xl lg:text-[42px]">
                            {t('companyProfile.blog.heroTitle')} <br className="hidden md:block" /> {t('companyProfile.blog.heroTitleLine2')}
                        </h1>
                        <p className="mt-3 max-w-sm text-base text-[var(--muted-foreground)] md:text-lg">{t('companyProfile.blog.heroSubtitle')}</p>
                    </div>
                </section>

                {featured && (
                    <section>
                        <Card className="flex flex-col overflow-hidden rounded-3xl border border-[var(--border-strong)] bg-[var(--card)] shadow-md md:flex-row">
                            <div className="relative h-64 w-full overflow-hidden md:h-auto md:w-1/2">
                                <Link href={`/artikel/${featured.id}`}>
                                    <img
                                        src={featured.image ?? undefined}
                                        alt={pickLocale(locale, featured, 'title')}
                                        className="absolute inset-0 h-110 w-full object-cover object-center transition-transform duration-500 hover:scale-105"
                                    />
                                </Link>
                            </div>
                            <div className="flex flex-col justify-center p-8 md:w-1/2 md:p-12">
                                <Badge className="mb-4 w-fit bg-[var(--secondary-600)]/10 text-sm text-[var(--secondary-600)] hover:bg-[var(--secondary-600)]/10">
                                    {pickLocale(locale, featured.category, 'name')}
                                </Badge>
                                <h2 className="mb-4 text-3xl font-bold text-[var(--foreground)]">{pickLocale(locale, featured, 'title')}</h2>
                                <p className="mb-6 line-clamp-3 text-[var(--muted-foreground)]">{pickLocale(locale, featured, 'excerpt')}</p>
                                <div className="mb-8 flex items-center space-x-6 text-sm text-[var(--grey-text-muted)]">
                                    <div className="flex items-center space-x-2">
                                        <Calendar className="h-4 w-4" />
                                        <span>{formatDate(featured.published_at)}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Clock className="h-4 w-4" />
                                        <span>
                                            {featured.read_time_minutes} {t('companyProfile.blog.readTimeUnit')}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <Link href={`/artikel/${featured.id}`}>
                                        <Button className="rounded-full bg-[var(--secondary-600)] px-8 text-white transition-transform hover:-translate-y-0.5 hover:bg-[var(--secondary-700)]">
                                            {t('companyProfile.blog.readMore')}
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </Card>
                    </section>
                )}

                <section className="flex flex-wrap items-center justify-center gap-3">
                    <button
                        onClick={() => setActiveCategory(null)}
                        className={`rounded-full border px-5 py-2.5 text-sm transition-all duration-300 ${
                            activeCategory === null
                                ? 'border-[var(--secondary-600)] bg-[var(--secondary-600)] font-semibold text-white shadow-sm'
                                : 'border-[var(--border-strong)] bg-[var(--card)] font-medium text-[var(--grey-text)] hover:border-[var(--secondary-600)] hover:bg-[var(--secondary-600)]/10 hover:text-[var(--secondary-600)]'
                        }`}
                    >
                        {t('companyProfile.blog.all')}
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={`rounded-full border px-5 py-2.5 text-sm transition-all duration-300 ${
                                activeCategory === cat.id
                                    ? 'border-[var(--secondary-600)] bg-[var(--secondary-600)] font-semibold text-white shadow-sm'
                                    : 'border-[var(--border-strong)] bg-[var(--card)] font-medium text-[var(--grey-text)] hover:border-[var(--secondary-600)] hover:bg-[var(--secondary-600)]/10 hover:text-[var(--secondary-600)]'
                            }`}
                        >
                            {pickLocale(locale, cat, 'name')}
                        </button>
                    ))}
                </section>

                <section className="space-y-8">
                    <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-bold text-[var(--foreground)]">{t('companyProfile.blog.latestArticles')}</h3>
                        <Link
                            href="/artikel/semua"
                            className="group flex items-center text-sm font-semibold text-[var(--grey-text)] hover:text-[var(--secondary-600)]"
                        >
                            {t('companyProfile.blog.viewAllArticles')}
                            <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                        {filteredArticles.map((article) => (
                            <Link href={`/artikel/${article.id}`} key={article.id} className="group block">
                                <Card className="flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--border-strong)] bg-[var(--card)] shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-md">
                                    <div className="h-48 w-full overflow-hidden bg-[var(--second-accent)]">
                                        <img
                                            src={article.image ?? undefined}
                                            alt={pickLocale(locale, article, 'title')}
                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    </div>

                                    <CardContent className="flex flex-grow flex-col p-5 pt-5">
                                        <Badge className="mb-3 w-fit border-none bg-[var(--secondary-600)]/10 text-[var(--secondary-600)] hover:bg-[var(--secondary-600)]/10">
                                            {pickLocale(locale, article.category, 'name')}
                                        </Badge>
                                        <h4 className="mb-2 line-clamp-2 text-lg leading-snug font-bold text-[var(--foreground)] transition-colors group-hover:text-[var(--secondary-600)]">
                                            {pickLocale(locale, article, 'title')}
                                        </h4>
                                        <p className="mb-4 line-clamp-3 flex-grow text-sm leading-relaxed text-[var(--grey-text-muted)]">
                                            {pickLocale(locale, article, 'excerpt')}
                                        </p>
                                        <div className="mt-auto flex items-center space-x-4 border-t border-[var(--border-strong)] pt-4 text-xs font-medium text-[var(--grey-text-muted)]">
                                            <div className="flex items-center space-x-1.5">
                                                <Calendar className="h-3.5 w-3.5" />
                                                <span>{formatDate(article.published_at)}</span>
                                            </div>
                                            <div className="flex items-center space-x-1.5">
                                                <Clock className="h-3.5 w-3.5" />
                                                <span>
                                                    {article.read_time_minutes} {t('companyProfile.blog.readTimeUnit')}
                                                </span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>

                    {filteredArticles.length === 0 && (
                        <div className="py-12 text-center">
                            <p className="text-[var(--grey-text-muted)]">{t('companyProfile.blog.emptyCategory')}</p>
                        </div>
                    )}
                </section>

                <section className="mt-16 mb-8 flex flex-col items-center justify-between gap-8 md:flex-row md:gap-12">
                    <div className="flex w-full shrink-0 justify-center md:w-2/5">
                        <img src="/assets/blog/ill-toko-posave.png" alt="Ilustrasi Toko POSAVE" className="w-64 max-w-[380px] md:w-full" />
                    </div>

                    <div className="flex w-full flex-col justify-center rounded-[24px] border border-[var(--border-strong)] bg-[var(--card)] p-8 text-center shadow-md md:w-3/5 md:p-12 md:text-left">
                        <h2 className="mb-4 text-3xl leading-tight font-bold tracking-tight text-[var(--foreground)] md:text-4xl">
                            {t('companyProfile.blog.ctaTitle')}
                        </h2>
                        <p className="mx-auto mb-8 max-w-lg text-lg text-[var(--muted-foreground)] md:mx-0">{t('companyProfile.blog.ctaSubtitle')}</p>
                        <div>
                            <Link href="/register">
                                <Button className="rounded-full bg-[var(--secondary-600)] px-8 py-6 text-base font-medium text-white shadow-sm transition-transform hover:-translate-y-1 hover:bg-[var(--secondary-700)]">
                                    {t('companyProfile.blog.ctaButton')}
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>
            </div>
        </AppLayout>
    );
}
