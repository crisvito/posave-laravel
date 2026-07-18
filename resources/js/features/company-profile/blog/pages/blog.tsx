import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AppLayout } from '@/layouts';
import { Link } from '@inertiajs/react';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import { useState } from 'react';

const categories = ['Semua', 'Tips Bisnis', 'Keuangan', 'Teknologi', 'Manajemen Toko'];

const recentArticles = [
    {
        id: 2,
        title: 'Tips Mengatur Stok Barang untuk UMKM',
        desc: 'Pelajari cara mengatur stok barang agar tidak kehabisan atau menumpuk di gudang.',
        category: 'Manajemen Toko',
        date: '21 April 2026',
        readTime: '4 Menit Baca',
        image: '/assets/blog/thumb-stok-barang-1.png',
    },
    {
        id: 3,
        title: 'Cara Meningkatkan Penjualan di Toko Kecil',
        desc: 'Strategi sederhana yang bisa Anda terapkan untuk meningkatkan penjualan setiap hari.',
        category: 'Tips Bisnis',
        date: '14 April 2026',
        readTime: '6 Menit Baca',
        image: '/assets/blog/thumb-tips-bisnis-2.png',
    },
    {
        id: 4,
        title: 'Pentingnya Laporan Keuangan untuk Bisnis',
        desc: 'Kenali manfaat laporan keuangan dan bagaimana data dapat membantu pengambilan keputusan.',
        category: 'Keuangan',
        date: '9 April 2026',
        readTime: '5 Menit Baca',
        image: '/assets/blog/thumb-keuangan-1.png',
    },
    {
        id: 5,
        title: 'Kenapa POS Berbasis Cloud Lebih Menguntungkan?',
        desc: 'Temukan keuntungan menggunakan sistem POS cloud untuk bisnis modern.',
        category: 'Teknologi',
        date: '7 April 2026',
        readTime: '4 Menit Baca',
        image: '/assets/blog/thumb-teknologi-1.png',
    },
];

export default function Blog() {
    const [activeCategory, setActiveCategory] = useState('Semua');
    const filteredArticles = activeCategory === 'Semua' ? recentArticles : recentArticles.filter((article) => article.category === activeCategory);

    return (
        <AppLayout>
            <div className="mx-auto space-y-16 py-10 font-sans">
                <section className="relative flex min-h-[350px] w-full items-center overflow-hidden rounded-[2.5rem] border border-[var(--border-strong)] bg-[var(--card)]">
                    <div className="absolute top-0 right-0 z-0 flex h-full w-full justify-end md:w-[95%]">
                        <img
                            src="/assets/blog/hero-blog.png"
                            alt="Cerita dan Tips Bisnis POSAVE"
                            className="h-full w-full object-cover object-left"
                        />
                        <div className="absolute inset-y-0 left-0 z-10 w-30 bg-gradient-to-r from-[var(--card)] to-transparent md:w-5xl"></div>
                    </div>

                    <div className="relative z-20 w-full space-y-3 p-12 sm:p-12 md:w-[60%]">
                        <h1 className="text-3xl leading-[1.25] font-extrabold tracking-tight text-[var(--foreground)] md:text-4xl lg:text-[42px]">
                            Cerita & Tips untuk <br className="hidden md:block" /> Bisnis Anda
                        </h1>
                        <p className="mt-3 max-w-sm text-base text-[var(--muted-foreground)] md:text-lg">
                            Insight dan tips untuk mengembangkan bisnis anda
                        </p>
                    </div>
                </section>

                <section>
                    <Card className="flex flex-col overflow-hidden rounded-3xl border border-[var(--border-strong)] bg-[var(--card)] shadow-md md:flex-row">
                        <div className="relative h-64 w-full overflow-hidden md:h-auto md:w-1/2">
                            <Link href="/artikel/1">
                                <img
                                    src="/assets/blog/thumb-tips-bisnis-1.png"
                                    alt="Cara Mengelola Toko Kecil"
                                    className="absolute inset-0 h-110 w-full object-cover object-center transition-transform duration-500 hover:scale-105"
                                />
                            </Link>
                        </div>
                        <div className="flex flex-col justify-center p-8 md:w-1/2 md:p-12">
                            <Badge className="mb-4 w-fit bg-[var(--secondary-600)]/10 text-sm text-[var(--secondary-600)] hover:bg-[var(--secondary-600)]/10">
                                Tips Bisnis
                            </Badge>
                            <h2 className="mb-4 text-3xl font-bold text-[var(--foreground)]">Cara Mengelola Toko Kecil Agar Lebih Efisien</h2>
                            <p className="mb-6 line-clamp-3 text-[var(--muted-foreground)]">
                                Tips praktis untuk membantu toko kecil Anda lebih efisien dalam operasional sehari-hari dan meningkatkan penjualan.
                            </p>
                            <div className="mb-8 flex items-center space-x-6 text-sm text-[var(--grey-text-muted)]">
                                <div className="flex items-center space-x-2">
                                    <Calendar className="h-4 w-4" />
                                    <span>25 April 2026</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Clock className="h-4 w-4" />
                                    <span>5 Menit Baca</span>
                                </div>
                            </div>
                            <div>
                                <Link href="/artikel/1">
                                    <Button className="rounded-full bg-[var(--secondary-600)] px-8 text-white transition-transform hover:-translate-y-0.5 hover:bg-[var(--secondary-700)]">
                                        Baca Selengkapnya
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </Card>
                </section>

                <section className="flex flex-wrap items-center justify-center gap-3">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`rounded-full border px-5 py-2.5 text-sm transition-all duration-300 ${
                                activeCategory === cat
                                    ? 'border-[var(--secondary-600)] bg-[var(--secondary-600)] font-semibold text-white shadow-sm'
                                    : 'border-[var(--border-strong)] bg-[var(--card)] font-medium text-[var(--grey-text)] hover:border-[var(--secondary-600)] hover:bg-[var(--secondary-600)]/10 hover:text-[var(--secondary-600)]'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </section>

                <section className="space-y-8">
                    <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-bold text-[var(--foreground)]">Artikel Terbaru</h3>
                        <Link
                            href="/artikel/semua"
                            className="group flex items-center text-sm font-semibold text-[var(--grey-text)] hover:text-[var(--secondary-600)]"
                        >
                            Lihat Semua Artikel
                            <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                        {filteredArticles.map((article) => (
                            <Link href={`/artikel/${article.id}`} key={article.id} className="group block">
                                <Card className="flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--border-strong)] bg-[var(--card)] shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-md">
                                    <div className="h-48 w-full overflow-hidden bg-[var(--second-accent)]">
                                        <img
                                            src={article.image}
                                            alt={article.title}
                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    </div>

                                    <CardContent className="flex flex-grow flex-col p-5 pt-5">
                                        <Badge className="mb-3 w-fit border-none bg-[var(--secondary-600)]/10 text-[var(--secondary-600)] hover:bg-[var(--secondary-600)]/10">
                                            {article.category}
                                        </Badge>
                                        <h4 className="mb-2 line-clamp-2 text-lg leading-snug font-bold text-[var(--foreground)] transition-colors group-hover:text-[var(--secondary-600)]">
                                            {article.title}
                                        </h4>
                                        <p className="mb-4 line-clamp-3 flex-grow text-sm leading-relaxed text-[var(--grey-text-muted)]">
                                            {article.desc}
                                        </p>
                                        <div className="mt-auto flex items-center space-x-4 border-t border-[var(--border-strong)] pt-4 text-xs font-medium text-[var(--grey-text-muted)]">
                                            <div className="flex items-center space-x-1.5">
                                                <Calendar className="h-3.5 w-3.5" />
                                                <span>{article.date}</span>
                                            </div>
                                            <div className="flex items-center space-x-1.5">
                                                <Clock className="h-3.5 w-3.5" />
                                                <span>{article.readTime}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>

                    {filteredArticles.length === 0 && (
                        <div className="py-12 text-center">
                            <p className="text-[var(--grey-text-muted)]">Belum ada artikel untuk kategori ini.</p>
                        </div>
                    )}
                </section>

                <section className="mt-16 mb-8 flex flex-col items-center justify-between gap-8 md:flex-row md:gap-12">
                    <div className="flex w-full shrink-0 justify-center md:w-2/5">
                        <img src="/assets/blog/ill-toko-posave.png" alt="Ilustrasi Toko POSAVE" className="w-64 max-w-[380px] md:w-full" />
                    </div>

                    <div className="flex w-full flex-col justify-center rounded-[24px] border border-[var(--border-strong)] bg-[var(--card)] p-8 text-center shadow-md md:w-3/5 md:p-12 md:text-left">
                        <h2 className="mb-4 text-3xl leading-tight font-bold tracking-tight text-[var(--foreground)] md:text-4xl">
                            Kelola Toko Lebih Mudah dengan POSAVE
                        </h2>
                        <p className="mx-auto mb-8 max-w-lg text-lg text-[var(--muted-foreground)] md:mx-0">
                            Semua fitur yang Anda butuhkan untuk mengembangkan bisnis, dalam satu platform.
                        </p>
                        <div>
                            <Link href="/register">
                                <Button className="rounded-full bg-[var(--secondary-600)] px-8 py-6 text-base font-medium text-white shadow-sm transition-transform hover:-translate-y-1 hover:bg-[var(--secondary-700)]">
                                    Coba POSAVE Sekarang
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>
            </div>
        </AppLayout>
    );
}
