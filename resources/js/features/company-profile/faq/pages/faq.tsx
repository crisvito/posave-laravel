import { AppLayout } from '@/layouts';
import { Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

// Types

interface FaqCategory {
    id: number;
    name_id: string;
    name_en: string;
    slug: string;
    sort_order: number;
}

interface FaqItem {
    id: number;
    faq_category_id: number;

    question_id: string;
    question_en: string;

    answer_id: string;
    answer_en: string;

    sort_order: number;
}

interface Props {
    categories: FaqCategory[];
    faqs: FaqItem[];
}

// AccordionItem

function AccordionItem({
    faq,
    isOpen,
    onToggle,
    locale,
}: {
    faq: FaqItem;
    isOpen: boolean;
    onToggle: () => void;
    locale: 'id' | 'en';
}) {
    return (
        <div className="border-primary overflow-hidden rounded-xl border">
            <button
                onClick={onToggle}
                className="bg-primary hover:bg-accent flex w-full items-center justify-between px-5 py-4 text-left text-white transition-colors"
            >
                <span className="pr-4 text-sm font-medium">{locale === 'id' ? faq.question_id : faq.question_en}</span>
                <svg
                    className={`h-5 w-5 flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Smooth accordion animation pakai CSS grid trick */}
            <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                <div className="overflow-hidden">
                    <p className="bg-primary px-5 py-4 text-sm leading-relaxed text-white">{locale === 'id' ? faq.answer_id : faq.answer_en}</p>
                </div>
            </div>
        </div>
    );
}

// Main Page

export default function Faq({ categories, faqs }: Props) {
    const { translations, locale } = usePage().props as any;
    const t = translations['company-profile/faq'];
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
            <Head title="FAQ" />

            {/* Hero */}
            <section className="via-primary relative mt-6 min-h-[280px] overflow-hidden rounded-t-2xl bg-gradient-to-br from-gray-900 to-gray-900 p-8">
                {/* Overlay putih dari bawah supaya teks tetap terbaca */}
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-white to-transparent to-50%" />{' '}
                {/* ↓ FOTO HERO — ganti src dengan path foto kamu */}
                <img
                    src="assets/faq/faq_hero.png"
                    alt="FAQ Hero"
                    className="absolute inset-0 h-full w-full object-cover object-top opacity-60"
                    onError={(e) => {
                        // Kalau foto belum ada, sembunyikan img supaya tidak broken
                        (e.target as HTMLImageElement).style.display = 'none';
                    }}
                />
                {/* Teks hero */}
                <div className="relative z-20 flex min-h-[280px] items-center px-8 py-16 md:px-16">
                    <div>
                        <h1 className="max-w-xl text-3xl leading-tight font-medium text-white md:text-4xl">
                            {t.hero_title}
                            <br />
                            <span className="font-bold">{t.hero_subtitle}</span>
                        </h1>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="mt-8">
                <div className="mx-auto max-w-5xl">
                    {/* Heading */}
                    <div className="mb-12 text-center">
                        <h2 className="text-3xl font-bold text-black dark:text-white">{t.section_title}</h2>
                        <p className="text-med mt-2 text-gray-500 dark:text-gray-400">{t.section_subtitle}</p>
                    </div>

                    <div className="flex flex-col gap-4 md:flex-row">
                        {/* Category sidebar  */}
                        <div className="flex flex-row flex-wrap gap-2 rounded-xl p-3 md:w-45 md:flex-col md:flex-nowrap bg-[var(--second-accent)]">
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => handleCategoryChange(cat.id)}
                                    className={`rounded-lg px-4 py-2.5 text-left text-sm font-medium transition-all duration-200 ${
                                        activeCategory === cat.id
                                            ? 'bg-[var(--accent-700)] text-white shadow-sm'
                                            : 'bg-[var(--primary-900)] text-white hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                                    }`}
                                >
                                    {locale === 'id' ? cat.name_id : cat.name_en}
                                </button>
                            ))}
                        </div>

                        {/* Accordion */}
                        <div className="flex flex-1 flex-col gap-3 pt-3 bg-[var(--second-accent)] rounded-xl p-3 md:pt-0">
                            {filteredFaqs.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-20 text-center bg-[var(--secondary-900)]">
                                    <svg className="mb-4 h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.5}
                                            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                    <p className="text-sm text-white">{t.empty_state}</p>
                                </div>
                            ) : (
                                filteredFaqs.map((faq) => (
                                    <AccordionItem key={faq.id} faq={faq} locale={locale} isOpen={openItem === faq.id} onToggle={() => handleToggle(faq.id)} />
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="px-8 py-8">
                <div className="mx-auto max-w-2xl">
                    <div className="rounded-full bg-gray-900 px-24 py-12 text-center dark:bg-slate-800">
                        <h3 className="text-2xl font-semibold text-white">{t.cta_title}</h3>
                        <p className="text-med mt-2 text-gray-300">{t.cta_subtitle}</p>
                        <Link
                            href="/contact"
                            className="text-accent-900 mt-8 inline-block rounded-full bg-white px-8 py-2.5 text-sm font-medium transition-colors hover:bg-gray-200"
                        >
                            {t.cta_button}
                        </Link>
                    </div>
                </div>
            </section>
        </AppLayout>
    );
}
