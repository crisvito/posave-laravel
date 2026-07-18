import { AppLayout } from '@/layouts';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

interface FaqCategory {
    id: number;
    name: string;
    slug: string;
    sort_order: number;
}

interface FaqItem {
    id: number;
    faq_category_id: number;
    question: string;
    answer: string;
    sort_order: number;
}

interface Props {
    categories: FaqCategory[];
    faqs: FaqItem[];
}

function AccordionItem({ faq, isOpen, onToggle }: { faq: FaqItem; isOpen: boolean; onToggle: () => void }) {
    return (
        <div className="overflow-hidden rounded-xl border border-[var(--border-strong)]">
            <button
                onClick={onToggle}
                className="flex w-full items-center justify-between bg-[var(--primary-900)] px-5 py-4 text-left text-white transition-colors hover:bg-[var(--secondary-700)]"
            >
                <span className="pr-4 text-sm font-medium">{faq.question}</span>
                <svg
                    className={`h-5 w-5 flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                <div className="overflow-hidden">
                    <p className="bg-[var(--primary-900)]/95 px-5 py-4 text-sm leading-relaxed text-white/90">{faq.answer}</p>
                </div>
            </div>
        </div>
    );
}

export default function Faq({ categories, faqs }: Props) {
    const [activeCategory, setActiveCategory] = useState<number>(categories[0]?.id ?? 0);
    const [openItem, setOpenItem] = useState<number | null>(null);

    const filteredFaqs = faqs.filter((f) => f.faq_category_id === activeCategory);

    const handleCategoryChange = (id: number) => {
        setActiveCategory(id);
        setOpenItem(null);
    };

    const handleToggle = (id: number) => {
        setOpenItem((prev) => (prev === id ? null : id));
    };

    return (
        <AppLayout>
            <Head title="FAQ - Posave" />

            <section className="relative mt-6 min-h-[280px] overflow-hidden rounded-t-2xl bg-[var(--primary-900)] p-8">
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-[var(--background)] to-transparent to-50%" />
                <img
                    src="assets/faq/faq_hero.png"
                    alt="FAQ Hero"
                    className="absolute inset-0 h-full w-full object-cover object-top opacity-60"
                    onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                    }}
                />
                <div className="relative z-20 flex min-h-[280px] items-center px-8 py-16 md:px-16">
                    <div>
                        <h1 className="max-w-xl text-3xl leading-tight font-medium text-white md:text-4xl">
                            Anda Punya Pertanyaan,
                            <br />
                            <span className="font-bold">Kami Punya Jawaban</span>
                        </h1>
                    </div>
                </div>
            </section>

            <section className="mt-8">
                <div className="mx-auto max-w-5xl">
                    <div className="mb-12 text-center">
                        <h2 className="text-3xl font-bold text-[var(--foreground)]">Frequently Asked Question</h2>
                        <p className="text-med mt-2 text-[var(--muted-foreground)]">Pertanyaan yang sudah terjawab</p>
                    </div>

                    <div className="flex flex-col gap-4 md:flex-row">
                        <div className="flex flex-row flex-wrap gap-2 rounded-xl p-3 md:w-45 md:flex-col md:flex-nowrap">
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => handleCategoryChange(cat.id)}
                                    className={`rounded-lg px-4 py-2.5 text-left text-sm font-medium transition-all duration-200 ${
                                        activeCategory === cat.id
                                            ? 'bg-[var(--secondary-600)] text-white shadow-sm'
                                            : 'bg-[var(--second-accent)] text-[var(--grey-text)] hover:bg-[var(--surface-badge)]'
                                    }`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>

                        <div className="flex flex-1 flex-col gap-3 pt-3">
                            {filteredFaqs.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-16 text-center">
                                    <svg
                                        className="mb-4 h-10 w-10 text-[var(--grey-text-muted)]"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.5}
                                            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                    <p className="text-sm text-[var(--grey-text-muted)]">Belum ada pertanyaan untuk kategori ini.</p>
                                </div>
                            ) : (
                                filteredFaqs.map((faq) => (
                                    <AccordionItem key={faq.id} faq={faq} isOpen={openItem === faq.id} onToggle={() => handleToggle(faq.id)} />
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <section className="px-8 py-8">
                <div className="mx-auto max-w-2xl">
                    <div className="rounded-full bg-[var(--primary-900)] px-24 py-12 text-center">
                        <h3 className="text-2xl font-semibold text-white">Pertanyaanmu belum terjawab?</h3>
                        <p className="text-med mt-2 text-white/80">Kontak kami melalui tombol dibawah ini</p>
                        <Link
                            href="/contact"
                            className="mt-8 inline-block rounded-full bg-[var(--secondary-600)] px-8 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[var(--secondary-700)]"
                        >
                            Hubungi Kami
                        </Link>
                    </div>
                </div>
            </section>
        </AppLayout>
    );
}
