import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/hooks';
import { AppLayout } from '@/layouts';
import { pickLocale } from '@/lib/i18n/pick';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Calendar, Clock, Facebook, Link as LinkIcon, Twitter } from 'lucide-react';

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
    content: string;
    content_en: string | null;
    image: string | null;
    read_time_minutes: number;
    published_at: string | null;
    category: ArticleCategoryProp;
}

interface ArticleDetailProps {
    article: ArticleProp | null;
}

export default function ArticleDetail({ article }: ArticleDetailProps) {
    const { locale, t } = useLanguage();

    const formatDate = (value: string | null) => {
        if (!value) return '';
        return new Date(value).toLocaleDateString(locale === 'en' ? 'en-US' : 'id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    if (!article) {
        return (
            <AppLayout>
                <div className="py-32 text-center">
                    <h1 className="mb-4 text-3xl font-bold text-[var(--foreground)]">{t('companyProfile.blog.notFoundTitle')}</h1>
                    <Link href="/artikel" className="text-[var(--secondary-600)] hover:underline">
                        {t('companyProfile.blog.backToBlog')}
                    </Link>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <Head title={t('companyProfile.blog.pageTitle')} />
            <div className="mx-auto max-w-4xl px-4 py-12 font-sans sm:px-6 lg:px-8">
                <Link
                    href="/artikel"
                    className="group mb-8 flex w-fit items-center font-medium text-[var(--grey-text)] transition-colors hover:text-[var(--secondary-600)]"
                >
                    <ArrowLeft className="mr-2 h-5 w-5 transition-transform group-hover:-translate-x-1" />
                    <span>{t('companyProfile.blog.backToBlog')}</span>
                </Link>

                <header className="mb-10 text-center md:text-left">
                    <Badge className="mb-6 rounded-full border-none bg-[var(--secondary-600)]/10 px-4 py-1.5 text-sm font-medium text-[var(--secondary-600)] hover:bg-[var(--secondary-600)]/10">
                        {pickLocale(locale, article.category, 'name')}
                    </Badge>

                    <h1 className="mb-6 text-4xl leading-[1.15] font-extrabold tracking-tight text-[var(--foreground)] md:text-5xl">
                        {pickLocale(locale, article, 'title')}
                    </h1>

                    <div className="flex flex-col items-center justify-between gap-4 border-y border-[var(--border-strong)] py-5 md:flex-row">
                        <div className="flex items-center space-x-6 text-sm font-medium text-[var(--grey-text)]">
                            <div className="flex items-center space-x-2">
                                <Calendar className="h-4 w-4" />
                                <span>{formatDate(article.published_at)}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Clock className="h-4 w-4" />
                                <span>
                                    {article.read_time_minutes} {t('companyProfile.blog.readTimeUnit')}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <span className="mr-2 text-sm font-medium text-[var(--grey-text)]">{t('companyProfile.blog.share')}</span>
                            <button
                                aria-label="Facebook"
                                className="rounded-full bg-[var(--second-accent)] p-2.5 text-[var(--grey-text)] transition-all hover:-translate-y-0.5 hover:bg-[var(--secondary-600)] hover:text-white"
                            >
                                <Facebook className="h-4 w-4" />
                            </button>
                            <button
                                aria-label="Twitter"
                                className="rounded-full bg-[var(--second-accent)] p-2.5 text-[var(--grey-text)] transition-all hover:-translate-y-0.5 hover:bg-[var(--secondary-600)] hover:text-white"
                            >
                                <Twitter className="h-4 w-4" />
                            </button>
                            <button
                                aria-label="Copy Link"
                                className="rounded-full bg-[var(--second-accent)] p-2.5 text-[var(--grey-text)] transition-all hover:-translate-y-0.5 hover:bg-[var(--secondary-600)] hover:text-white"
                            >
                                <LinkIcon className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </header>

                <div className="mb-12 h-64 w-full overflow-hidden rounded-[2rem] bg-[var(--second-accent)] shadow-sm md:h-[450px]">
                    <img src={article.image ?? undefined} alt={pickLocale(locale, article, 'title')} className="h-full w-full object-cover" />
                </div>

                <article className="prose prose-lg md:prose-xl dark:prose-invert mx-auto max-w-3xl leading-relaxed text-[var(--muted-foreground)]">
                    <p className="lead font-medium text-[var(--foreground)]">{pickLocale(locale, article, 'content')}</p>

                    <h2 className="mt-12 mb-6 text-3xl font-bold tracking-tight text-[var(--foreground)]">
                        {t('companyProfile.blog.nextStepsTitle')}
                    </h2>
                    <p>{t('companyProfile.blog.nextStepsBody')}</p>
                </article>
            </div>
        </AppLayout>
    );
}
