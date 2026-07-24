import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/hooks';
import { AppLayout } from '@/layouts';
import { pickLocale } from '@/lib/i18n/pick';
import { Head, Link } from '@inertiajs/react';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import { useState } from 'react';

import { Reveal } from '../../components';
import { useSmoothScroll } from '../../lib/use-smooth-scroll';

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

    // Mengaktifkan smooth scroll
    useSmoothScroll();

    const formatDate = (value: string | null) => {
        if (!value) return '';
        return new Date(value).toLocaleDateString(locale === 'en' ? 'en-US' : 'id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    return (
        <AppLayout>
            <Head title={t('companyProfile.blog.pageTitle')} />

            {/* Bungkus utama menggunakan max-w-6xl agar ukurannya konsisten dan rapi di tengah */}
            <div className="mx-auto max-w-6xl space-y-20 py-5 font-sans md:py-10">
                {/* --- 1. HERO SECTION --- */}
                <div className="mx-auto max-w-6xl">
                    <Reveal y={40}>
                        <div className="relative flex min-h-[450px] w-full items-center justify-center overflow-hidden rounded-[2rem] shadow-2xl md:rounded-[3rem]">
                            <img
                                src="/assets/blog/hero-blog.png"
                                alt="Cerita dan Tips Bisnis POSAVE"
                                className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 hover:scale-105"
                            />

                            {/* Overlay gelap yang rata (tanpa gradasi) agar teks putih tetap terbaca */}
                            <div className="absolute inset-0 bg-black/60"></div>

                            <div className="relative z-10 flex flex-col items-center px-6 text-center">
                                <h1 className="mb-4 text-4xl leading-tight font-bold tracking-tight text-white md:text-6xl lg:text-[72px]">
                                    {t('companyProfile.blog.heroTitle')}
                                    <br className="hidden md:block" /> {t('companyProfile.blog.heroTitleLine2')}
                                </h1>

                                <p className="max-w-2xl text-lg text-white/90 md:text-2xl">{t('companyProfile.blog.heroSubtitle')}</p>
                            </div>
                        </div>
                    </Reveal>
                </div>

                {/* --- FEATURED ARTICLE --- */}
                {featured && (
                    <Reveal delay={0.1}>
                        <section>
                            <Card className="flex flex-col overflow-hidden rounded-[2rem] border border-[var(--border-strong)] bg-[var(--card)] shadow-md transition-shadow hover:shadow-lg md:flex-row">
                                <div className="relative h-72 w-full overflow-hidden md:h-auto md:w-1/2">
                                    <Link href={`/artikel/${featured.id}`}>
                                        <img
                                            src={featured.image ?? undefined}
                                            alt={pickLocale(locale, featured, 'title')}
                                            className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 hover:scale-105"
                                        />
                                    </Link>
                                </div>
                                <div className="flex flex-col justify-center p-8 md:w-1/2 md:p-12 lg:p-16">
                                    <Badge className="mb-4 w-fit bg-[var(--secondary-600)]/10 px-3 py-1 text-sm font-semibold text-[var(--secondary-600)] hover:bg-[var(--secondary-600)]/20">
                                        {pickLocale(locale, featured.category, 'name')}
                                    </Badge>
                                    <h2 className="mb-4 text-3xl leading-snug font-bold text-[var(--foreground)] md:text-4xl">
                                        {pickLocale(locale, featured, 'title')}
                                    </h2>
                                    <p className="mb-8 line-clamp-3 text-base text-[var(--muted-foreground)] md:text-lg">
                                        {pickLocale(locale, featured, 'excerpt')}
                                    </p>

                                    <div className="mb-8 flex flex-wrap items-center gap-6 text-sm font-medium text-[var(--grey-text-muted)]">
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
                                            <Button className="rounded-full bg-[var(--secondary-600)] px-8 py-6 text-base font-semibold text-white shadow-md transition-transform hover:-translate-y-1 hover:bg-[var(--secondary-700)]">
                                                {t('companyProfile.blog.readMore')}
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </Card>
                        </section>
                    </Reveal>
                )}

                {/* --- CATEGORY FILTER --- */}
                <Reveal delay={0.2} y={20}>
                    <section className="flex flex-wrap items-center justify-center gap-3">
                        <button
                            onClick={() => setActiveCategory(null)}
                            className={`rounded-full border px-6 py-2.5 text-sm transition-all duration-300 ${
                                activeCategory === null
                                    ? 'border-[var(--secondary-600)] bg-[var(--secondary-600)] font-semibold text-white shadow-md'
                                    : 'border-[var(--border-strong)] bg-[var(--card)] font-medium text-[var(--grey-text)] hover:border-[var(--secondary-600)] hover:bg-[var(--secondary-600)]/10 hover:text-[var(--secondary-600)]'
                            }`}
                        >
                            {t('companyProfile.blog.all')}
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`rounded-full border px-6 py-2.5 text-sm transition-all duration-300 ${
                                    activeCategory === cat.id
                                        ? 'border-[var(--secondary-600)] bg-[var(--secondary-600)] font-semibold text-white shadow-md'
                                        : 'border-[var(--border-strong)] bg-[var(--card)] font-medium text-[var(--grey-text)] hover:border-[var(--secondary-600)] hover:bg-[var(--secondary-600)]/10 hover:text-[var(--secondary-600)]'
                                }`}
                            >
                                {pickLocale(locale, cat, 'name')}
                            </button>
                        ))}
                    </section>
                </Reveal>

                {/* --- ARTICLES GRID --- */}
                <section className="space-y-10">
                    <Reveal>
                        <div className="flex items-center justify-between border-b border-[var(--border-strong)] pb-4">
                            <h3 className="text-2xl font-bold text-[var(--foreground)] md:text-3xl">{t('companyProfile.blog.latestArticles')}</h3>
                            <Link
                                href="/artikel/semua"
                                className="group flex items-center text-sm font-semibold text-[var(--secondary-600)] hover:text-[var(--secondary-700)] md:text-base"
                            >
                                {t('companyProfile.blog.viewAllArticles')}
                                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </div>
                    </Reveal>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredArticles.map((article, index) => (
                            <Reveal key={article.id} delay={index * 0.1}>
                                <Link href={`/artikel/${article.id}`} className="group block h-full">
                                    <Card className="flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--border-strong)] bg-[var(--card)] shadow-sm transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-xl">
                                        <div className="relative h-56 w-full overflow-hidden bg-[var(--second-accent)]">
                                            <img
                                                src={article.image ?? undefined}
                                                alt={pickLocale(locale, article, 'title')}
                                                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                        </div>

                                        <CardContent className="flex flex-grow flex-col p-6">
                                            <Badge className="mb-4 w-fit border-none bg-[var(--secondary-600)]/10 px-3 py-1 font-semibold text-[var(--secondary-600)] group-hover:bg-[var(--secondary-600)]/20">
                                                {pickLocale(locale, article.category, 'name')}
                                            </Badge>
                                            <h4 className="mb-3 line-clamp-2 text-xl leading-snug font-bold text-[var(--foreground)] transition-colors group-hover:text-[var(--secondary-600)]">
                                                {pickLocale(locale, article, 'title')}
                                            </h4>
                                            <p className="mb-6 line-clamp-3 flex-grow text-sm leading-relaxed text-[var(--muted-foreground)]">
                                                {pickLocale(locale, article, 'excerpt')}
                                            </p>

                                            <div className="mt-auto flex items-center justify-between border-t border-[var(--border-strong)] pt-4 text-xs font-medium text-[var(--grey-text-muted)]">
                                                <div className="flex items-center space-x-1.5">
                                                    <Calendar className="h-4 w-4" />
                                                    <span>{formatDate(article.published_at)}</span>
                                                </div>
                                                <div className="flex items-center space-x-1.5">
                                                    <Clock className="h-4 w-4" />
                                                    <span>
                                                        {article.read_time_minutes} {t('companyProfile.blog.readTimeUnit')}
                                                    </span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            </Reveal>
                        ))}
                    </div>

                    {filteredArticles.length === 0 && (
                        <Reveal>
                            <div className="rounded-2xl border border-dashed border-[var(--border-strong)] py-20 text-center">
                                <p className="text-lg font-medium text-[var(--muted-foreground)]">{t('companyProfile.blog.emptyCategory')}</p>
                            </div>
                        </Reveal>
                    )}
                </section>

                {/* --- CALL TO ACTION --- */}
                <Reveal>
                    <section className="flex flex-col items-center justify-between gap-10 rounded-[2.5rem] bg-[var(--card)] p-10 shadow-sm ring-1 ring-[var(--border)] md:flex-row md:p-14 lg:p-20">
                        <div className="flex w-full shrink-0 justify-center md:w-2/5">
                            <img
                                src="/assets/blog/ill-toko-posave.png"
                                alt="Ilustrasi Toko POSAVE"
                                className="w-full max-w-[320px] transition-transform duration-500 hover:scale-105 rounded-2xl"
                            />
                        </div>

                        <div className="flex w-full flex-col justify-center text-center md:w-3/5 md:text-left">
                            <h2 className="mb-4 text-3xl leading-tight font-bold text-[var(--foreground)] md:text-4xl lg:text-5xl">
                                {t('companyProfile.blog.ctaTitle')}
                            </h2>
                            <p className="mx-auto mb-8 max-w-lg text-lg text-[var(--muted-foreground)] md:mx-0">
                                {t('companyProfile.blog.ctaSubtitle')}
                            </p>
                            <div>
                                <Link href="/register">
                                    <Button className="rounded-full bg-[var(--secondary-600)] px-10 py-6 text-lg font-semibold text-white shadow-md transition-transform hover:-translate-y-1 hover:bg-[var(--secondary-700)]">
                                        {t('companyProfile.blog.ctaButton')}
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </section>
                </Reveal>
            </div>
        </AppLayout>
    );
}
