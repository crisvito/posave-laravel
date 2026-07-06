import { Button } from '@/components';
import { AppLayout } from '@/layouts';
import { Head, usePage, Link } from '@inertiajs/react';
import { ArrowRight, Clock, Headphones, HelpCircle, Mail, MapPin, PhoneCall } from 'lucide-react';
import { ContactForm } from '../components';

export default function Inquiry() {
    const { translations } = usePage().props as any;
    console.log(translations);
    const t = translations['company-profile/inquiry'];
    return (
        <AppLayout>
            <Head title={t.page_title} />
            <div className="flex flex-col gap-8 py-8">
                {/* 1. BAGIAN HERO (Atas) */}
                <div className="flex flex-col overflow-hidden rounded-3xl bg-[var(--accent-900)] md:flex-row">
                    {/* Gambar */}
                    <div className="p-5 md:w-1/2">
                        <img
                            src="/assets/contact-us/banner1.png"
                            alt={t.hero_alt}
                            className="h-full min-h-[300px] w-full rounded-2xl object-cover"
                        />
                    </div>
                    {/* Teks Hero */}
                    <div className="flex flex-col justify-center p-8 md:w-1/2 md:p-12 lg:p-16">
                        <h1 className="text-4xl font-bold text-slate-800">
                            {t.hero_title} <br />
                            <span className="text-[#22303F]">{t.hero_subtitle}</span>
                        </h1>
                        <p className="mt-4 text-slate-600">
                            {t.hero_description} <br />
                            {t.hero_description_2}
                        </p>
                        <div className="mt-8 flex flex-wrap gap-4">
                            <Button className="rounded-full bg-[#22303F] px-8 hover:bg-[#002266]">
                                <PhoneCall className="mr-2 h-4 w-4" /> {t.contact_button}
                            </Button>
                            <Button variant="outline" className="rounded-full border-[#22303F] px-8 text-[#22303F] hover:bg-blue-50">
                                <HelpCircle className="mr-2 h-4 w-4" /> {t.faq_button}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* 2. BANNER FAQ (Tengah) */}
                <div className="flex flex-col items-center justify-between rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm md:flex-row md:px-12">
                    <div className="flex flex-col items-center gap-6 sm:flex-row">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-[#22303F]">
                            <HelpCircle className="h-8 w-8" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-800">{t.faq_banner_title}</h3>
                            <p className="mt-1 text-sm text-slate-500">{t.faq_banner_description}</p>
                        </div>
                    </div>
                    <Button className="mt-6 w-full rounded-full bg-[#22303F] px-8 hover:bg-[#002266] md:mt-0 md:w-auto">
                        {t.faq_banner_button} <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>

                {/* 3. BAGIAN KONTAK (Bawah Kiri: Info, Bawah Kanan: Form) */}
                <div className="mt-4 grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-8">
                    {/* Kiri: Informasi Kontak */}
                    <div className="flex flex-col justify-center">
                        <h2 className="text-3xl font-bold text-slate-800">{t.contact_title}</h2>
                        <div className="mt-2 h-1 w-12 bg-[#22303F]"></div> {/* Garis biru kecil */}
                        <p className="mt-6 text-slate-600">{t.contact_description}</p>
                        <p className="mt-4 mb-8 text-slate-600">{t.contact_description_2}</p>
                        {/* List Info Kontak */}
                        <div className="flex flex-col gap-6">
                            <div className="flex items-start gap-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[#22303F]">
                                    <Clock className="h-5 w-5" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-slate-800">{t.operating_hours}</h4>
                                    <p className="text-sm text-slate-600">
                                        {t.operating_days}
                                        <br />
                                        {t.operating_time}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[#22303F]">
                                    <Mail className="h-5 w-5" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-slate-800">{t.email}</h4>
                                    <p className="text-sm text-slate-600">support@posave.com</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[#22303F]">
                                    <PhoneCall className="h-5 w-5" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-slate-800">{t.phone}</h4>
                                    <p className="text-sm text-slate-600">+62 811 2345 567</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[#22303F]">
                                    <MapPin className="h-5 w-5" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-slate-800">{t.address}</h4>
                                    <p className="text-sm text-slate-600">Indonesia</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Kanan: Form Kontak (Memanggil komponen lokal yang kita buat) */}
                    <div>
                        <ContactForm />
                    </div>
                </div>

                {/* 4. BANNER BAWAH (Masih Butuh Bantuan) */}
                <div className="mt-8 flex flex-col items-center justify-between rounded-2xl bg-blue-50/50 p-8 md:flex-row md:px-12">
                    <div className="flex flex-col items-center gap-6 sm:flex-row">
                        <Headphones className="h-10 w-10 text-[#22303F]" />
                        <div>
                            <h3 className="text-xl font-bold text-slate-800">{t.support_title}</h3>
                            <p className="mt-1 text-slate-600">{t.support_description}</p>
                        </div>
                    </div>
                    <Button className="mt-6 h-12 w-full rounded-md bg-[#22303F] px-8 hover:bg-[#002266] md:mt-0 md:w-auto">
                        <Headphones className="mr-2 h-4 w-4" /> {t.support_button}
                    </Button>
                </div>
            </div>
        </AppLayout>
    );
}
