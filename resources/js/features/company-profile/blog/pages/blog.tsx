import React, { useState } from 'react';
import { AppLayout } from '@/layouts';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import { Link, usePage } from '@inertiajs/react';

// --------------------
// helper i18n
// --------------------
const getText = (item: any, field: string, locale: string) => {
    if (locale === 'en') return item[`${field}_en`] ?? item[`${field}_id`];
    return item[`${field}_id`] ?? item[`${field}_en`];
};

// --------------------
// MOCK DATA
// --------------------
const recentArticles = [
    {
        id: 2,
        title_id: 'Tips Mengatur Stok Barang untuk UMKM',
        title_en: 'Tips for Managing Inventory for SMEs',
        desc_id: 'Pelajari cara mengatur stok barang agar tidak kehabisan atau menumpuk di gudang.',
        desc_en: 'Learn how to manage inventory to avoid stockouts or overstocking in your warehouse.',
        category_id: 'Manajemen Toko',
        category_en: 'Store Management',
        date_id: '21 April 2026',
        date_en: 'April 21, 2026',
        readTime_id: '4 Menit Baca',
        readTime_en: '4 Min Read',
        image: '/assets/blog/thumb-stok-barang-1.png'
    },
    {
        id: 3,
        title_id: 'Cara Meningkatkan Penjualan di Toko Kecil',
        title_en: 'How to Increase Sales in a Small Store',
        desc_id: 'Strategi sederhana yang bisa Anda terapkan untuk meningkatkan penjualan setiap hari.',
        desc_en: 'Simple strategies you can implement to boost sales every day.',
        category_id: 'Tips Bisnis',
        category_en: 'Business Tips',
        date_id: '14 April 2026',
        date_en: 'April 14, 2026',
        readTime_id: '6 Menit Baca',
        readTime_en: '6 Min Read',
        image: '/assets/blog/thumb-tips-bisnis-2.png'
    },
    {
        id: 4,
        title_id: 'Pentingnya Laporan Keuangan untuk Bisnis',
        title_en: 'The Importance of Financial Reports for Business',
        desc_id: 'Kenali manfaat laporan keuangan dan bagaimana data dapat membantu pengambilan keputusan.',
        desc_en: 'Understand the benefits of financial reports and how data can assist in decision-making.',
        category_id: 'Keuangan',
        category_en: 'Finance',
        date_id: '9 April 2026',
        date_en: 'April 9, 2026',
        readTime_id: '5 Menit Baca',
        readTime_en: '5 Min Read',
        image: '/assets/blog/thumb-keuangan-1.png'
    },
    {
        id: 5,
        title_id: 'Kenapa POS Berbasis Cloud Lebih Menguntungkan?',
        title_en: 'Why Cloud-Based POS Systems Are More Profitable?',
        desc_id: 'Temukan keuntungan menggunakan sistem POS cloud untuk bisnis modern.',
        desc_en: 'Discover the benefits of using cloud-based POS systems for modern businesses.',
        category_id: 'Teknologi',
        category_en: 'Technology',
        date_id: '7 April 2026',
        date_en: 'April 7, 2026',
        readTime_id: '4 Menit Baca',
        readTime_en: '4 Min Read',
        image: '/assets/blog/thumb-teknologi-1.png'
    }
];

export default function Blog() {
    const { locale = 'id', translations } = usePage().props as any;

    // --------------------
    // categories bilingual
    // --------------------
    const categories =
        locale === 'en'
            ? ['All', 'Business Tips', 'Finance', 'Technology', 'Store Management']
            : ['Semua', 'Tips Bisnis', 'Keuangan', 'Teknologi', 'Manajemen Toko'];

    // --------------------
    // state active category
    // --------------------
    const [activeCategory, setActiveCategory] = useState(
        locale === 'en' ? 'All' : 'Semua'
    );

    // --------------------
    // featured article
    // --------------------
    const featuredArticle = recentArticles[0];

    // --------------------
    // filter logic
    // --------------------
    const filteredArticles =
        activeCategory === (locale === 'en' ? 'All' : 'Semua')
            ? recentArticles
            : recentArticles.filter((article) => {
                  const category =
                      locale === 'en'
                          ? article.category_en
                          : article.category_id;

                  return category === activeCategory;
              });

    return (
        <AppLayout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16 font-sans">

                {/* HERO SECTION */}
                <section className="relative w-full rounded-[2.5rem] overflow-hidden min-h-[350px] flex items-center bg-[#F0F5F9]">
                    <div className="absolute top-0 right-0 w-full md:w-[95%] h-full z-0 flex justify-end">
                        <img
                            src="/assets/blog/hero-blog.png"
                            alt="Cerita dan Tips Bisnis POSAVE"
                            className="w-full h-full object-cover object-left"
                        />
                        <div className="absolute inset-y-0 left-0 w-24 md:w-32 bg-gradient-to-r from-[#F0F5F9] to-transparent z-10"></div>
                    </div>

                    <div className="relative z-20 w-full md:w-[60%] p-12 space-y-3">
                        <h1 className="text-3xl md:text-4xl lg:text-[42px] font-extrabold text-[#0F172A]">
                            {locale === 'en'
                                ? 'Stories & Tips for Your Business'
                                : 'Cerita & Tips untuk Bisnis Anda'}
                        </h1>

                        <p className="text-base md:text-lg text-slate-600 max-w-sm">
                            {locale === 'en'
                                ? 'Insights and tips to grow your business'
                                : 'Insight dan tips untuk mengembangkan bisnis anda'}
                        </p>
                    </div>
                </section>

                {/* FEATURED ARTICLE */}
                <section>
                    <Card className="flex flex-col md:flex-row overflow-hidden border-none shadow-md rounded-3xl">

                        {/* IMAGE */}
                        <div className="relative w-full md:w-1/2 h-64 md:h-auto overflow-hidden">
                            <Link
                                href={`/artikel/${featuredArticle.id}`}
                                className="block group"
                            >
                                <img
                                    src={featuredArticle.image}
                                    alt={getText(featuredArticle, 'title', locale)}
                                    className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-500 hover:scale-105"
                                />
                            </Link>
                        </div>

                        {/* CONTENT */}
                        <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white">
                            <Badge className="w-fit mb-4 bg-[#EAF3FA] text-[#1A2B4C] text-sm">
                                {getText(featuredArticle, 'category', locale)}
                            </Badge>

                            <h2 className="text-3xl font-bold text-slate-900 mb-4">
                                {getText(featuredArticle, 'title', locale)}
                            </h2>

                            <p className="text-slate-600 mb-6">
                                {getText(featuredArticle, 'desc', locale)}
                            </p>

                            <div className="flex items-center space-x-6 text-sm text-slate-500 mb-8">
                                <div className="flex items-center space-x-2">
                                    <Calendar className="w-4 h-4" />
                                    <span>
                                        {locale === 'en'
                                            ? featuredArticle.date_en
                                            : featuredArticle.date_id}
                                    </span>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Clock className="w-4 h-4" />
                                    <span>
                                        {locale === 'en'
                                            ? featuredArticle.readTime_en
                                            : featuredArticle.readTime_id}
                                    </span>
                                </div>
                            </div>

                            <Link href={`/artikel/${featuredArticle.id}`}>
                                <Button className="bg-[#1A2B4C] hover:bg-[#1A2B4C]/90 rounded-full px-8">
                                    {locale === 'en' ? 'Read More' : 'Baca Selengkapnya'}
                                </Button>
                            </Link>
                        </div>
                    </Card>
                </section>

                {/* CATEGORY FILTER */}
                <section className="flex flex-wrap items-center justify-center gap-3">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-5 py-2.5 rounded-full text-sm border transition-all ${
                                activeCategory === cat
                                    ? 'bg-[#EAF3FA] text-[#1A2B4C] border-[#EAF3FA] font-semibold'
                                    : 'bg-white text-slate-500 border-slate-400'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </section>

                {/* ARTICLES */}
                <section className="space-y-8">
                    <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-bold text-slate-900">
                            {locale === 'en' ? 'Latest Articles' : 'Artikel Terbaru'}
                        </h3>

                        <Link
                            href="/artikel/semua"
                            className="text-sm font-semibold text-slate-600 hover:text-slate-900 flex items-center group"
                        >
                            {locale === 'en' ? 'See All Articles' : 'Lihat Semua Artikel'}

                            <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {filteredArticles.map((article) => (
                            <Link
                                key={article.id}
                                href={`/artikel/${article.id}`}
                                className="block group"
                            >
                                <Card className="overflow-hidden border-none shadow-sm group-hover:shadow-md transition-all rounded-2xl">

                                    <div className="h-48 w-full overflow-hidden">
                                        <img
                                            src={article.image}
                                            alt={getText(article, 'title', locale)}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                        />
                                    </div>

                                    <CardContent className="p-5 flex flex-col flex-grow">
                                        <Badge className="w-fit mb-3 bg-[#EAF3FA] text-[#1A2B4C]">
                                            {locale === 'en'
                                                ? article.category_en
                                                : article.category_id}
                                        </Badge>

                                        <h4 className="font-bold text-lg mb-2">
                                            {getText(article, 'title', locale)}
                                        </h4>

                                        <p className="text-sm text-slate-500 mb-4">
                                            {getText(article, 'desc', locale)}
                                        </p>

                                        <div className="flex items-center space-x-4 text-xs text-slate-500 mt-auto pt-4 border-t">
                                            <Calendar className="w-3.5 h-3.5" />
                                            <span>
                                                {locale === 'en'
                                                    ? article.date_en
                                                    : article.date_id}
                                            </span>

                                            <Clock className="w-3.5 h-3.5 ml-3" />
                                            <span>
                                                {locale === 'en'
                                                    ? article.readTime_en
                                                    : article.readTime_id}
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>

                    {filteredArticles.length === 0 && (
                        <div className="text-center py-12 text-slate-500">
                            {locale === 'en'
                                ? 'No articles found.'
                                : 'Belum ada artikel.'}
                        </div>
                    )}
                </section>

            </div>
        </AppLayout>
    );
}