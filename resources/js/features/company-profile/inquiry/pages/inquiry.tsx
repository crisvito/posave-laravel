import { Button } from '@/components';
import { AppLayout } from '@/layouts';
import { Head } from '@inertiajs/react';
import { ArrowRight, Clock, Headphones, HelpCircle, Mail, MapPin, PhoneCall } from 'lucide-react';
import { ContactForm } from '../components';

export default function Inquiry() {
    return (
        <AppLayout>
            <Head title="Hubungi Kami" />
            <div className="flex flex-col gap-8 py-8">
                <div className="flex flex-col overflow-hidden rounded-3xl border border-[var(--border-strong)] bg-[var(--card)] md:flex-row">
                    <div className="p-5 md:w-1/2">
                        <img
                            src="/assets/contact-us/banner1.png"
                            alt="Customer Service"
                            className="h-full min-h-[300px] w-full rounded-2xl object-cover"
                        />
                    </div>
                    <div className="flex flex-col justify-center p-8 md:w-1/2 md:p-12 lg:p-16">
                        <h1 className="text-4xl font-bold text-[var(--foreground)]">
                            Butuh Bantuan? <br />
                            <span className="text-[var(--foreground)]">Kami Ada Disini</span>
                        </h1>
                        <p className="mt-4 text-[var(--muted-foreground)]">
                            Punya pertanyaan tentang POSAVE? <br />
                            Tim kami selalu siap untuk membantu Anda!
                        </p>
                        <div className="mt-8 flex flex-wrap gap-4">
                            <Button className="rounded-full bg-[var(--secondary-600)] px-8 text-white hover:bg-[var(--secondary-700)]">
                                <PhoneCall className="mr-2 h-4 w-4" /> Hubungi Kami
                            </Button>
                            <Button
                                variant="outline"
                                className="rounded-full border-[var(--secondary-600)] px-8 text-[var(--secondary-600)] hover:bg-[var(--secondary-600)]/10"
                            >
                                <HelpCircle className="mr-2 h-4 w-4" /> FAQ
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-center justify-between rounded-2xl border border-[var(--border-strong)] bg-[var(--card)] p-6 shadow-sm md:flex-row md:px-12">
                    <div className="flex flex-col items-center gap-6 sm:flex-row">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--secondary-600)]/10 text-[var(--secondary-600)]">
                            <HelpCircle className="h-8 w-8" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-[var(--foreground)]">Kami sudah menjawab pertanyaanmu!</h3>
                            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                                Pergi ke halaman FAQ kami untuk jawaban pertanyaan umum dengan cepat.
                            </p>
                        </div>
                    </div>
                    <Button className="mt-6 w-full rounded-full bg-[var(--secondary-600)] px-8 text-white hover:bg-[var(--secondary-700)] md:mt-0 md:w-auto">
                        Buka FAQ <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-8">
                    <div className="flex flex-col justify-center">
                        <h2 className="text-3xl font-bold text-[var(--foreground)]">Hubungi Kami!</h2>
                        <div className="mt-2 h-1 w-12 bg-[var(--secondary-600)]"></div>
                        <p className="mt-6 text-[var(--muted-foreground)]">Anda memiliki pertanyaan? Tim kami siap menjawab dalam 24 jam.</p>
                        <p className="mt-4 mb-8 text-[var(--muted-foreground)]">
                            Tuliskan berbagai pertanyaan atau kendala yang anda rasakan di formulir tersebut.
                        </p>
                        <div className="flex flex-col gap-6">
                            <div className="flex items-start gap-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--secondary-600)]/10 text-[var(--secondary-600)]">
                                    <Clock className="h-5 w-5" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-[var(--foreground)]">Jam Operasional</h4>
                                    <p className="text-sm text-[var(--muted-foreground)]">
                                        Senin - Minggu
                                        <br />
                                        08:00 - 22:00 WIB
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--secondary-600)]/10 text-[var(--secondary-600)]">
                                    <Mail className="h-5 w-5" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-[var(--foreground)]">Email</h4>
                                    <p className="text-sm text-[var(--muted-foreground)]">support@posave.com</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--secondary-600)]/10 text-[var(--secondary-600)]">
                                    <PhoneCall className="h-5 w-5" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-[var(--foreground)]">Nomor Telepon</h4>
                                    <p className="text-sm text-[var(--muted-foreground)]">+62 811 2345 567</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--secondary-600)]/10 text-[var(--secondary-600)]">
                                    <MapPin className="h-5 w-5" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-[var(--foreground)]">Alamat</h4>
                                    <p className="text-sm text-[var(--muted-foreground)]">Indonesia</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <ContactForm />
                    </div>
                </div>

                <div className="mt-8 flex flex-col items-center justify-between rounded-2xl border border-[var(--border-strong)] bg-[var(--card)] p-8 md:flex-row md:px-12">
                    <div className="flex flex-col items-center gap-6 sm:flex-row">
                        <Headphones className="h-10 w-10 text-[var(--secondary-600)]" />
                        <div>
                            <h3 className="text-xl font-bold text-[var(--foreground)]">Masih butuh bantuan?</h3>
                            <p className="mt-1 text-[var(--muted-foreground)]">Tim support kami siap membantu Anda kapan saja.</p>
                        </div>
                    </div>
                    <Button className="mt-6 h-12 w-full rounded-full bg-[var(--secondary-600)] px-8 text-white hover:bg-[var(--secondary-700)] md:mt-0 md:w-auto">
                        <Headphones className="mr-2 h-4 w-4" /> Hubungi Sekarang
                    </Button>
                </div>
            </div>
        </AppLayout>
    );
}
