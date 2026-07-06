import React from 'react';
import { AppLayout } from '@/layouts';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link, usePage } from '@inertiajs/react';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';

export default function AllArticles() {
    const { translations, locale } = usePage().props as any;

    const isEn = locale === 'en';
    const t = translations['company-profile/blog'];

    const allArticlesDb = [
        {
            id: '1',
            category_id: 'Tips Bisnis',
            category_en: 'Business Tips',
            title_id: 'Cara Mengelola Toko Kecil Agar Lebih Efisien',
            title_en: 'How to Manage a Small Store More Efficiently',
            date_id: '25 April 2026',
            date_en: 'April 25, 2026',
            readTime_id: '5 Menit Baca',
            readTime_en: '5 Min Read',
            desc_id: 'Tips praktis untuk membantu toko kecil Anda lebih efisien dalam operasional...',
            desc_en:
                'Practical tips to help your small store operate more efficiently in daily operations...',
            image: '/assets/blog/thumb-tips-bisnis-1.png',
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
            desc_id: 'Mengelola stok barang seringkali menjadi tantangan terbesar bagi pelaku UMKM...',
            desc_en:
                'Managing inventory is often the biggest challenge for MSME owners...',
            image: '/assets/blog/thumb-stok-barang-1.png',
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
            desc_id: 'Strategi sederhana yang bisa Anda terapkan untuk meningkatkan penjualan...',
            desc_en:
                'Simple strategies you can implement to boost your sales...',
            image: '/assets/blog/thumb-tips-bisnis-2.png',
        },
        {
            id: '4',
            category_id: 'Keuangan',
            category_en: 'Finance',
            title_id: 'Pentingnya Laporan Keuangan untuk Bisnis',
            title_en: 'The Importance of Financial Reports for Business',
            date_id: '9 April 2026',
            date_en: 'April 9, 2026',
            readTime_id: '5 Menit Baca',
            readTime_en: '5 Min Read',
            desc_id: 'Kenali manfaat laporan keuangan dan bagaimana data dapat membantu...',
            desc_en:
                'Understand the benefits of financial reports and how data can help...',
            image: '/assets/blog/thumb-keuangan-1.png',
        },
        {
            id: '5',
            category_id: 'Teknologi',
            category_en: 'Technology',
            title_id: 'Kenapa POS Berbasis Cloud Lebih Menguntungkan',
            title_en: 'Why Cloud-Based POS Systems Are More Profitable',
            date_id: '7 April 2026',
            date_en: 'April 7, 2026',
            readTime_id: '4 Menit Baca',
            readTime_en: '4 Min Read',
            desc_id: 'Temukan keuntungan menggunakan sistem POS cloud untuk bisnis modern...',
            desc_en:
                'Discover the benefits of using cloud-based POS systems for modern businesses...',
            image: '/assets/blog/thumb-teknologi-1.png',
        },
    ];

    const get = (article: any, field: string) =>
        isEn
            ? article[`${field}_en`] ?? article[`${field}_id`]
            : article[`${field}_id`] ?? article[`${field}_en`];

    return (
        <AppLayout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-sans">

                <Link
                    href="/artikel"
                    className="flex items-center w-fit text-slate-500 hover:text-[#1A2B4C] transition-colors mb-8 group font-medium"
                >
                    <ArrowLeft className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" />
                    <span>{t.back_to_main_blog}</span>
                </Link>

                <div className="mb-12 text-center md:text-left">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
                        {t.all_articles}
                    </h1>

                    <p className="text-lg text-slate-600 max-w-2xl">
                        {t.all_articles_description}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {allArticlesDb.map((article) => (
                        <Link
                            href={`/artikel/${article.id}`}
                            key={article.id}
                            className="block group h-full"
                        >
                            <Card className="overflow-hidden flex flex-col h-full border-none shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:-translate-y-1 rounded-2xl">

                                <div className="h-56 w-full overflow-hidden bg-slate-100">
                                    <img
                                        src={article.image}
                                        alt={get(article, 'title')}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                </div>

                                <CardContent className="p-6 pt-6 flex flex-col flex-grow bg-white">

                                    <Badge className="w-fit mb-4 bg-[#EAF3FA] text-[#1A2B4C] hover:bg-[#EAF3FA] border-none">
                                        {get(article, 'category')}
                                    </Badge>

                                    <h4 className="font-bold text-xl text-slate-900 mb-3 line-clamp-2 leading-snug group-hover:text-[#1A2B4C] transition-colors">
                                        {get(article, 'title')}
                                    </h4>

                                    <p className="text-base text-slate-500 mb-6 line-clamp-3 flex-grow leading-relaxed">
                                        {get(article, 'desc')}
                                    </p>

                                    <div className="flex items-center space-x-4 text-sm text-slate-500 mt-auto pt-5 border-t border-slate-100 font-medium">
                                        <div className="flex items-center space-x-1.5">
                                            <Calendar className="w-4 h-4" />
                                            <span>{get(article, 'date')}</span>
                                        </div>

                                        <div className="flex items-center space-x-1.5">
                                            <Clock className="w-4 h-4" />
                                            <span>{get(article, 'readTime')}</span>
                                        </div>
                                    </div>

                                </CardContent>

                            </Card>
                        </Link>
                    ))}
                </div>

            </div>
        </AppLayout>
    );
}