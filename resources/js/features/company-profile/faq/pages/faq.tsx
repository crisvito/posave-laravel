import { useLanguage } from '@/hooks';
import { AppLayout } from '@/layouts';
import { pickLocale } from '@/lib/i18n/pick';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

// Pastikan lokasi import disesuaikan dengan foldermu
import { Reveal } from '../../components';
import { useSmoothScroll } from '../../lib/use-smooth-scroll';

interface FaqCategory {
    id: number;
    name: string;
    name_en: string | null;
    slug: string;
    sort_order: number;
}

interface FaqItem {
    id: number;
    faq_category_id: number;
    question: string;
    question_en: string | null;
    answer: string;
    answer_en: string | null;
    sort_order: number;
}

interface Props {
    categories: FaqCategory[];
    faqs: FaqItem[];
}

// --- Komponen Accordion Item (Kartu Tanya Jawab) ---
function AccordionItem({ faq, isOpen, onToggle }: { faq: FaqItem; isOpen: boolean; onToggle: () => void }) {
    const { locale } = useLanguage();

    return (
        <div
            className={`overflow-hidden rounded-2xl border transition-all duration-300 ${isOpen ? 'border-[var(--secondary-600)] bg-[var(--card)] shadow-md' : 'border-[var(--border-strong)] bg-[var(--card)] hover:shadow-sm'}`}
        >
            <button
                onClick={onToggle}
                className="flex w-full items-center justify-between px-6 py-5 text-left transition-colors hover:bg-[var(--secondary-600)]/5"
            >
                <span className={`pr-4 text-base font-semibold md:text-lg ${isOpen ? 'text-[var(--secondary-600)]' : 'text-[var(--foreground)]'}`}>
                    {pickLocale(locale, faq, 'question')}
                </span>
                <span
                    className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full transition-transform duration-300 ${isOpen ? 'rotate-180 bg-[var(--secondary-600)] text-white' : 'bg-[var(--second-accent)] text-[var(--grey-text)]'}`}
                >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </svg>
                </span>
            </button>

            <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                <div className="overflow-hidden">
                    <div className="px-6 pt-2 pb-6">
                        <p className="text-base leading-relaxed text-[var(--muted-foreground)]">{pickLocale(locale, faq, 'answer')}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function Faq({ categories, faqs }: Props) {
    const { locale, t } = useLanguage();
    const [activeCategory, setActiveCategory] = useState<number>(categories[0]?.id ?? 0);
    const [openItem, setOpenItem] = useState<number | null>(null);

    // Mengaktifkan smooth scroll
    useSmoothScroll();

    const filteredFaqs = faqs.filter((f) => f.faq_category_id === activeCategory);

    const handleCategoryChange = (id: number) => {
        setActiveCategory(id);
        setOpenItem(null); // Tutup accordion yang terbuka saat ganti kategori
    };

    const handleToggle = (id: number) => {
        setOpenItem((prev) => (prev === id ? null : id));
    };

    return (
        <AppLayout>
            <Head title="FAQ - Posave" />

            {/* Pembungkus utama agar rapi di tengah dengan padding yang konsisten */}
            <div className="py-8 md:py-12">
                {/* --- 1. HERO SECTION (Persis seperti Halaman Blog & Services) --- */}
                <div className="mx-auto max-w-6xl">
                    <Reveal y={40}>
                        <div className="relative flex min-h-[400px] w-full items-center justify-center overflow-hidden rounded-[2rem] shadow-2xl md:min-h-[400px] md:rounded-[3rem]">
                            <img
                                src="assets/faq/faq_hero.png"
                                alt="FAQ Hero"
                                className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-1000 hover:scale-105"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                }}
                            />

                            {/* Overlay gelap rata murni tanpa gradasi */}
                            <div className="absolute inset-0 bg-black/40"></div>

                            <div className="relative z-10 flex flex-col items-center px-6 text-center">
                                <h1 className="mb-4 max-w-3xl text-4xl leading-tight font-bold tracking-tight text-white md:text-5xl">
                                    {t('companyProfile.faq.heroTitleLine1')}
                                    <br className="hidden md:block" /> {t('companyProfile.faq.heroTitleLine2')}
                                </h1>
                            </div>
                        </div>
                    </Reveal>
                </div>

                {/* --- 2. FAQ CONTENT SECTION --- */}
                <div className="mx-auto max-w-6xl px-6 py-20 md:py-32">
                    <Reveal className="mb-16 text-center md:mb-20">
                        <h2 className="mb-4 text-3xl font-bold text-[var(--foreground)] md:text-5xl">{t('companyProfile.faq.sectionTitle')}</h2>
                        <p className="mx-auto max-w-2xl text-lg text-[var(--muted-foreground)] md:text-xl">
                            {t('companyProfile.faq.sectionSubtitle')}
                        </p>
                    </Reveal>

                    <div className="flex flex-col gap-10 lg:flex-row lg:gap-16">
                        {/* Kategori Sidebar */}
                        <div className="flex flex-row overflow-x-auto pb-4 lg:w-1/4 lg:flex-col lg:overflow-visible lg:pb-0">
                            <Reveal delay={0.1} className="flex w-full gap-3 lg:flex-col">
                                {categories.map((cat) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => handleCategoryChange(cat.id)}
                                        className={`rounded-xl px-6 py-4 text-left text-base font-semibold whitespace-nowrap transition-all duration-300 ${
                                            activeCategory === cat.id
                                                ? 'bg-[var(--secondary-600)] text-white shadow-md lg:translate-x-2'
                                                : 'border border-[var(--border-strong)] bg-[var(--card)] text-[var(--grey-text)] hover:border-[var(--secondary-600)] hover:text-[var(--secondary-600)]'
                                        }`}
                                    >
                                        {pickLocale(locale, cat, 'name')}
                                    </button>
                                ))}
                            </Reveal>
                        </div>

                        {/* List Accordion */}
                        <div className="flex flex-1 flex-col gap-4">
                            <Reveal delay={0.2} className="flex flex-col gap-4">
                                {filteredFaqs.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--border-strong)] py-20 text-center">
                                        <svg
                                            className="mb-4 h-12 w-12 text-[var(--grey-text-muted)] opacity-50"
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
                                        <p className="text-lg font-medium text-[var(--muted-foreground)]">{t('faq.emptyCategory')}</p>
                                    </div>
                                ) : (
                                    filteredFaqs.map((faq) => (
                                        <AccordionItem key={faq.id} faq={faq} isOpen={openItem === faq.id} onToggle={() => handleToggle(faq.id)} />
                                    ))
                                )}
                            </Reveal>
                        </div>
                    </div>
                </div>

                {/* --- 3. CALL TO ACTION (CTA) --- */}
                <div className="mx-auto pb-20">
                    <Reveal>
                        <div className="relative overflow-hidden rounded-[2.5rem] bg-[var(--primary-900)] p-12 text-center shadow-2xl md:rounded-[3rem] md:p-20">
                            {/* Dekorasi blur di background CTA */}
                            <div className="absolute -top-10 -right-10 h-48 w-48 rounded-full bg-white/10 blur-3xl"></div>
                            <div className="absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-white/10 blur-3xl"></div>

                            <div className="relative z-10">
                                <h3 className="mb-4 text-3xl leading-tight font-bold text-white md:text-5xl">{t('companyProfile.faq.ctaTitle')}</h3>
                                <p className="mb-10 text-lg text-white/80 md:text-xl">{t('companyProfile.faq.ctaSubtitle')}</p>
                                <Link
                                    href="/hubungi-kami"
                                    className="inline-block rounded-full bg-[var(--secondary-600)] px-10 py-4 text-lg font-bold text-white shadow-lg transition-transform hover:-translate-y-1 hover:bg-[var(--secondary-700)]"
                                >
                                    {t('companyProfile.faq.ctaButton')}
                                </Link>
                            </div>
                        </div>
                    </Reveal>
                </div>
            </div>
        </AppLayout>
    );
}
