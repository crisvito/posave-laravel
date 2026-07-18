import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/hooks';
import { AppLayout } from '@/layouts';
import { pickLocale } from '@/lib/i18n/pick';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';

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

interface AllArticlesProps {
    articles: ArticleProp[];
}

export default function AllArticles({ articles }: AllArticlesProps) {
    const { locale, t } = useLanguage();

    const formatDate = (value: string | null) => {
        if (!value) return '';
        return new Date(value).toLocaleDateString(locale === 'en' ? 'en-US' : 'id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    return (
        <AppLayout>
            <Head title={t('companyProfile.blog.pageTitle')} />
            <div className="mx-auto max-w-7xl px-4 py-12 font-sans sm:px-6 lg:px-8">
                <Link
                    href="/artikel"
                    className="group mb-8 flex w-fit items-center font-medium text-[var(--grey-text)] transition-colors hover:text-[var(--secondary-600)]"
                >
                    <ArrowLeft className="mr-2 h-5 w-5 transition-transform group-hover:-translate-x-1" />
                    <span>{t('companyProfile.blog.backToBlogFull')}</span>
                </Link>

                <div className="mb-12 text-center md:text-left">
                    <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-[var(--foreground)] md:text-5xl">
                        {t('companyProfile.blog.allArticlesTitle')}
                    </h1>
                    <p className="max-w-2xl text-lg text-[var(--muted-foreground)]">{t('companyProfile.blog.allArticlesSubtitle')}</p>
                </div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {articles.map((article) => (
                        <Link href={`/artikel/${article.id}`} key={article.id} className="group block h-full">
                            <Card className="flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--border-strong)] bg-[var(--card)] shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-md">
                                <div className="h-56 w-full overflow-hidden bg-[var(--second-accent)]">
                                    <img
                                        src={article.image ?? undefined}
                                        alt={pickLocale(locale, article, 'title')}
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                </div>

                                <CardContent className="flex flex-grow flex-col p-6 pt-6">
                                    <Badge className="mb-4 w-fit border-none bg-[var(--secondary-600)]/10 text-[var(--secondary-600)] hover:bg-[var(--secondary-600)]/10">
                                        {pickLocale(locale, article.category, 'name')}
                                    </Badge>
                                    <h4 className="mb-3 line-clamp-2 text-xl leading-snug font-bold text-[var(--foreground)] transition-colors group-hover:text-[var(--secondary-600)]">
                                        {pickLocale(locale, article, 'title')}
                                    </h4>
                                    <p className="mb-6 line-clamp-3 flex-grow text-base leading-relaxed text-[var(--grey-text-muted)]">
                                        {pickLocale(locale, article, 'excerpt')}
                                    </p>
                                    <div className="mt-auto flex items-center space-x-4 border-t border-[var(--border-strong)] pt-5 text-sm font-medium text-[var(--grey-text-muted)]">
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
                    ))}
                </div>

                {articles.length === 0 && (
                    <div className="py-12 text-center">
                        <p className="text-[var(--grey-text-muted)]">{t('companyProfile.blog.emptyAll')}</p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
