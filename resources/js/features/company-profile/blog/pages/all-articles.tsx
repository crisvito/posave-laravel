import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { AppLayout } from '@/layouts';
import { Link } from '@inertiajs/react';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';

export default function AllArticles() {
    const allArticlesDb = [
        {
            id: '1',
            category: 'Tips Bisnis',
            title: 'Cara Mengelola Toko Kecil Agar Lebih Efisien',
            date: '25 April 2026',
            readTime: '5 Menit Baca',
            desc: 'Tips praktis untuk membantu toko kecil Anda lebih efisien dalam operasional...',
            image: '/assets/blog/thumb-tips-bisnis-1.png',
        },
        {
            id: '2',
            category: 'Manajemen Toko',
            title: 'Tips Mengatur Stok Barang untuk UMKM',
            date: '21 April 2026',
            readTime: '4 Menit Baca',
            desc: 'Mengelola stok barang seringkali menjadi tantangan terbesar bagi pelaku UMKM...',
            image: '/assets/blog/thumb-stok-barang-1.png',
        },
        {
            id: '3',
            category: 'Tips Bisnis',
            title: 'Cara Meningkatkan Penjualan di Toko Kecil',
            date: '14 April 2026',
            readTime: '6 Menit Baca',
            desc: 'Strategi sederhana yang bisa Anda terapkan untuk meningkatkan penjualan...',
            image: '/assets/blog/thumb-tips-bisnis-2.png',
        },
        {
            id: '4',
            category: 'Keuangan',
            title: 'Pentingnya Laporan Keuangan untuk Bisnis',
            date: '9 April 2026',
            readTime: '5 Menit Baca',
            desc: 'Kenali manfaat laporan keuangan dan bagaimana data dapat membantu...',
            image: '/assets/blog/thumb-keuangan-1.png',
        },
        {
            id: '5',
            category: 'Teknologi',
            title: 'Kenapa POS Berbasis Cloud Lebih Menguntungkan',
            date: '7 April 2026',
            readTime: '4 Menit Baca',
            desc: 'Temukan keuntungan menggunakan sistem POS cloud untuk bisnis modern...',
            image: '/assets/blog/thumb-teknologi-1.png',
        },
    ];

    return (
        <AppLayout>
            <div className="mx-auto max-w-7xl px-4 py-12 font-sans sm:px-6 lg:px-8">
                <Link
                    href="/artikel"
                    className="group mb-8 flex w-fit items-center font-medium text-[var(--grey-text)] transition-colors hover:text-[var(--secondary-600)]"
                >
                    <ArrowLeft className="mr-2 h-5 w-5 transition-transform group-hover:-translate-x-1" />
                    <span>Kembali ke Blog Utama</span>
                </Link>

                <div className="mb-12 text-center md:text-left">
                    <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-[var(--foreground)] md:text-5xl">Semua Artikel</h1>
                    <p className="max-w-2xl text-lg text-[var(--muted-foreground)]">
                        Eksplorasi seluruh insight, cerita, dan tips praktis untuk membantu mengembangkan bisnis Anda ke level selanjutnya.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {allArticlesDb.map((article) => (
                        <Link href={`/artikel/${article.id}`} key={article.id} className="group block h-full">
                            <Card className="flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--border-strong)] bg-[var(--card)] shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-md">
                                <div className="h-56 w-full overflow-hidden bg-[var(--second-accent)]">
                                    <img
                                        src={article.image}
                                        alt={article.title}
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                </div>

                                <CardContent className="flex flex-grow flex-col p-6 pt-6">
                                    <Badge className="mb-4 w-fit border-none bg-[var(--secondary-600)]/10 text-[var(--secondary-600)] hover:bg-[var(--secondary-600)]/10">
                                        {article.category}
                                    </Badge>
                                    <h4 className="mb-3 line-clamp-2 text-xl leading-snug font-bold text-[var(--foreground)] transition-colors group-hover:text-[var(--secondary-600)]">
                                        {article.title}
                                    </h4>
                                    <p className="mb-6 line-clamp-3 flex-grow text-base leading-relaxed text-[var(--grey-text-muted)]">
                                        {article.desc}
                                    </p>
                                    <div className="mt-auto flex items-center space-x-4 border-t border-[var(--border-strong)] pt-5 text-sm font-medium text-[var(--grey-text-muted)]">
                                        <div className="flex items-center space-x-1.5">
                                            <Calendar className="h-4 w-4" />
                                            <span>{article.date}</span>
                                        </div>
                                        <div className="flex items-center space-x-1.5">
                                            <Clock className="h-4 w-4" />
                                            <span>{article.readTime}</span>
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
