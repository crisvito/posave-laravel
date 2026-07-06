import { Badge } from '@/components/ui/badge';
import { AppLayout } from '@/layouts';
import { Link, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    Calendar,
    Clock,
    Facebook,
    Link as LinkIcon,
    Twitter,
} from 'lucide-react';

export default function ArticleDetail({ articleId }: { articleId: string }) {
    const { translations, locale } = usePage().props as any;

    // SAFE locale handling (FIX ERROR UTAMA)
    const currentLocale = String(locale ?? 'id').toLowerCase();
    const isEn = currentLocale.startsWith('en');

    const t = translations['company-profile/blog'];

    // MOCK DB
    const articlesDb = [
        {
            id: '1',
            category_id: 'Tips Bisnis',
            category_en: 'Business Tips',
            title_id: 'Cara Mengelola Toko Kecil Agar Lebih Efisien',
            title_en: 'How to Manage a Small Store More Efficiently',
            date_id: '21 April 2026',
            date_en: 'April 21, 2026',
            readTime_id: '5 Menit Baca',
            readTime_en: '5 Min Read',
            image: '/assets/blog/thumb-tips-bisnis-1.png',
            content_id:
                'Tips praktis untuk membantu toko kecil Anda lebih efisien dalam operasional sehari-hari...',
            content_en:
                'Practical tips to help your small store operate more efficiently in daily operations...',
        },
        {
            id: '2',
            category_id: 'Manajemen Toko',
            category_en: 'Store Management',
            title_id: 'Tips Mengatur Stok Barang untuk UMKM',
            title_en: 'Tips for Managing Inventory for MSMEs',
            date_id: '21 April 2026',
            date_en: 'April 21, 2026',
            readTime_id: '4 Menit Baca',
            readTime_en: '4 Min Read',
            image: '/assets/blog/thumb-stok-barang-1.png',
            content_id: 'Mengelola stok barang seringkali menjadi tantangan...',
            content_en: 'Managing inventory is often the biggest challenge...',
        },
        {
            id: '3',
            category_id: 'Tips Bisnis',
            category_en: 'Business Tips',
            title_id: 'Cara Meningkatkan Penjualan di Toko Kecil',
            title_en: 'How to Increase Sales in a Small Store',
            date_id: '14 April 2026',
            date_en: 'April 14, 2026',
            readTime_id: '6 Menit Baca',
            readTime_en: '6 Min Read',
            image: '/assets/blog/thumb-tips-bisnis-2.png',
            content_id: 'Strategi sederhana untuk meningkatkan penjualan...',
            content_en: 'Simple strategies to increase sales...',
        },
        {
            id: '4',
            category_id: 'Keuangan',
            category_en: 'Finance',
            title_id: 'Pentingnya Laporan Keuangan untuk Bisnis',
            title_en: 'The Importance of Financial Statements for Business',
            date_id: '9 April 2026',
            date_en: 'April 9, 2026',
            readTime_id: '5 Menit Baca',
            readTime_en: '5 Min Read',
            image: '/assets/blog/thumb-keuangan-1.png',
            content_id: 'Kenali manfaat laporan keuangan...',
            content_en: 'Understand the benefits of financial reports...',
        },
        {
            id: '5',
            category_id: 'Teknologi',
            category_en: 'Technology',
            title_id: 'Kenapa POS Berbasis Cloud Lebih Menguntungkan',
            title_en: 'Why Cloud-Based POS is More Beneficial',
            date_id: '7 April 2026',
            date_en: 'April 7, 2026',
            readTime_id: '4 Menit Baca',
            readTime_en: '4 Min Read',
            image: '/assets/blog/thumb-teknologi-1.png',
            content_id: 'Temukan keuntungan menggunakan sistem POS cloud...',
            content_en: 'Discover benefits of cloud POS systems...',
        },
    ];

    const article = articlesDb.find((a) => a.id === String(articleId));

    if (!article) {
        return (
            <AppLayout>
                <div className="py-32 text-center">
                    <h1 className="mb-4 text-3xl font-bold text-slate-900">
                        {t.article_not_found}
                    </h1>
                    <Link href="/artikel" className="text-[#1A2B4C] hover:underline">
                        {t.back_to_blog}
                    </Link>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <div className="mx-auto max-w-4xl px-4 py-12 font-sans sm:px-6 lg:px-8">

                {/* BACK */}
                <Link
                    href="/artikel"
                    className="group mb-8 flex w-fit items-center font-medium text-slate-500 hover:text-[#1A2B4C]"
                >
                    <ArrowLeft className="mr-2 h-5 w-5" />
                    <span>{t.back_to_blog}</span>
                </Link>

                {/* HEADER */}
                <header className="mb-10 text-center md:text-left">
                    <Badge className="mb-6 rounded-full bg-[#EAF3FA] text-[#1A2B4C]">
                        {isEn ? article.category_en : article.category_id}
                    </Badge>

                    <h1 className="mb-6 text-4xl font-extrabold text-slate-900 md:text-5xl">
                        {isEn ? article.title_en : article.title_id}
                    </h1>

                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-y py-5">
                        <div className="flex items-center space-x-6 text-sm text-slate-500">
                            <div className="flex items-center space-x-2">
                                <Calendar className="h-4 w-4" />
                                <span>
                                    {isEn ? article.date_en : article.date_id}
                                </span>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Clock className="h-4 w-4" />
                                <span>
                                    {isEn ? article.readTime_en : article.readTime_id}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <span className="text-sm text-slate-500">
                                {isEn ? 'Share:' : 'Bagikan:'}
                            </span>

                            <button className="p-2.5 bg-slate-100 rounded-full">
                                <Facebook className="h-4 w-4" />
                            </button>
                            <button className="p-2.5 bg-slate-100 rounded-full">
                                <Twitter className="h-4 w-4" />
                            </button>
                            <button className="p-2.5 bg-slate-100 rounded-full">
                                <LinkIcon className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </header>

                {/* IMAGE */}
                <div className="mb-12 h-64 w-full overflow-hidden rounded-[2rem] md:h-[450px]">
                    <img
                        src={article.image}
                        className="h-full w-full object-cover"
                    />
                </div>

                {/* CONTENT */}
                <article className="prose prose-slate mx-auto max-w-3xl text-slate-700">
                    <p className="font-medium">
                        {isEn ? article.content_en : article.content_id}
                    </p>
                </article>
            </div>
        </AppLayout>
    );
}