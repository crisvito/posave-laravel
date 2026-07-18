import { Link } from '@inertiajs/react';
import { Instagram, Linkedin, Mail, Phone, Youtube } from 'lucide-react';

const TiktokIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" className={className}>
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
);

export function AppFooter() {
    return (
        <footer className="w-full bg-[#346280] text-white dark:bg-[var(--primary-900)]">
            <div className="mx-auto w-full max-w-7xl px-8 py-12 md:px-16">
                <div className="flex flex-col justify-between gap-12 lg:flex-row">
                    <div className="flex flex-col space-y-6 lg:max-w-[400px]">
                        <h2 className="text-2xl font-bold tracking-wide">POSAVE</h2>
                        <p className="pr-4 text-sm leading-relaxed text-white/90">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam semper id lorem eu euismod. Nullam velit massa, finibus nec
                            sollicitudin vel.
                        </p>
                        <div className="flex flex-col space-y-4 pt-2">
                            <div className="flex items-center space-x-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#346280]">
                                    <Mail className="h-4 w-4" />
                                </div>
                                <span className="text-sm">support@posave.com</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#346280]">
                                    <Phone className="h-4 w-4" />
                                </div>
                                <span className="text-sm">+62 811 2345 567</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-12 sm:flex-row sm:gap-16 lg:gap-20">
                        <div className="flex flex-col">
                            <h3 className="mb-6 text-lg font-semibold">Explore Us</h3>
                            <ul className="flex flex-col space-y-4 text-sm text-white/90">
                                <li>
                                    <Link href="/" className="whitespace-nowrap transition-colors hover:text-white hover:underline">
                                        Home
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/tentang-kami" className="whitespace-nowrap transition-colors hover:text-white hover:underline">
                                        About Us
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/layanan" className="whitespace-nowrap transition-colors hover:text-white hover:underline">
                                        Services
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/artikel" className="whitespace-nowrap transition-colors hover:text-white hover:underline">
                                        Blog
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div className="flex flex-col">
                            <h3 className="mb-6 text-lg font-semibold">Important Links</h3>
                            <ul className="flex flex-col space-y-4 text-sm text-white/90">
                                <li>
                                    <Link href="/faq" className="whitespace-nowrap transition-colors hover:text-white hover:underline">
                                        FAQ
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/hubungi-kami" className="whitespace-nowrap transition-colors hover:text-white hover:underline">
                                        Contact Us
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/mitra" className="whitespace-nowrap transition-colors hover:text-white hover:underline">
                                        Become A Partner
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Kolom 4: Follow Us */}
                        <div className="flex flex-col">
                            <h3 className="mb-6 text-lg font-semibold">Follow Us</h3>
                            <div className="flex flex-col space-y-4 text-sm text-white/90">
                                <a href="#" className="group flex items-center space-x-3 transition-colors hover:text-white">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#346280] transition-transform group-hover:scale-110">
                                        <Instagram className="h-4 w-4" />
                                    </div>
                                    <span className="whitespace-nowrap">@Posave</span>
                                </a>
                                <a href="#" className="group flex items-center space-x-3 transition-colors hover:text-white">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#346280] transition-transform group-hover:scale-110">
                                        <TiktokIcon className="h-4 w-4" />
                                    </div>
                                    <span className="whitespace-nowrap">@Posave</span>
                                </a>
                                <a href="#" className="group flex items-center space-x-3 transition-colors hover:text-white">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#346280] transition-transform group-hover:scale-110">
                                        <Youtube className="h-4 w-4" />
                                    </div>
                                    <span className="whitespace-nowrap">@Posave</span>
                                </a>
                                <a href="#" className="group flex items-center space-x-3 transition-colors hover:text-white">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#346280] transition-transform group-hover:scale-110">
                                        <Linkedin className="h-4 w-4" />
                                    </div>
                                    <span className="whitespace-nowrap">@Posave</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-12 border-t border-white/30 pt-6">
                    <div className="flex flex-col items-center justify-between space-y-4 text-sm text-white/90 md:flex-row md:space-y-0">
                        <p>SAV3 International Ltd. © All rights reserved, 2026</p>
                        <p>Jl. Pakuan No. 3, Kabupaten Bogor, Jawa Barat 16810</p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
