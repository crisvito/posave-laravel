import { Reveal } from '@/features/company-profile/components';
import { useLanguage } from '@/hooks';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Instagram, Linkedin, Mail, Phone, Youtube } from 'lucide-react';

const TiktokIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" className={className}>
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
);

export function AppFooter() {
    const { t } = useLanguage();

    const socialLinks = [
        { icon: Instagram, label: '@Posave', href: '#' },
        { icon: TiktokIcon, label: '@Posave', href: '#' },
        { icon: Youtube, label: '@Posave', href: '#' },
        { icon: Linkedin, label: '@Posave', href: '#' },
    ];

    return (
        <footer className="w-full bg-[var(--primary-900)] text-white">
            <div className="mx-auto w-full max-w-7xl px-8 py-14 md:px-16">
                <div className="flex flex-col justify-between gap-12 lg:flex-row">
                    <Reveal className="flex flex-col space-y-6 lg:max-w-[380px]">
                        <div>
                            <img src="full-logo.png" alt="POSAVE" className="h-10 w-auto object-contain brightness-0 invert" />
                        </div>
                        <p className="pr-4 text-sm leading-relaxed text-white/80">{t('shared.footer.tagline')}</p>
                        <div className="flex flex-col space-y-4 pt-2">
                            <a href="mailto:support@posave.com" className="group flex items-center gap-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[var(--primary-900)] transition-transform group-hover:scale-110">
                                    <Mail className="h-4 w-4" />
                                </div>
                                <span className="text-sm text-white/90 group-hover:text-white">support@posave.com</span>
                            </a>
                            <a href="tel:+62811234567" className="group flex items-center gap-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[var(--primary-900)] transition-transform group-hover:scale-110">
                                    <Phone className="h-4 w-4" />
                                </div>
                                <span className="text-sm text-white/90 group-hover:text-white">+62 811 2345 567</span>
                            </a>
                        </div>
                    </Reveal>

                    <div className="flex flex-col gap-12 sm:flex-row sm:gap-16 lg:gap-20">
                        <Reveal delay={0.1} className="flex flex-col">
                            <h3 className="mb-6 text-lg font-semibold">{t('shared.footer.exploreTitle')}</h3>
                            <ul className="flex flex-col space-y-4 text-sm text-white/80">
                                <li>
                                    <Link href="/" className="whitespace-nowrap transition-colors hover:text-white hover:underline">
                                        {t('shared.footer.exploreHome')}
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/tentang-kami" className="whitespace-nowrap transition-colors hover:text-white hover:underline">
                                        {t('shared.footer.exploreAbout')}
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/layanan" className="whitespace-nowrap transition-colors hover:text-white hover:underline">
                                        {t('shared.footer.exploreServices')}
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/artikel" className="whitespace-nowrap transition-colors hover:text-white hover:underline">
                                        {t('shared.footer.exploreBlog')}
                                    </Link>
                                </li>
                            </ul>
                        </Reveal>

                        <Reveal delay={0.2} className="flex flex-col">
                            <h3 className="mb-6 text-lg font-semibold">{t('shared.footer.linksTitle')}</h3>
                            <ul className="flex flex-col space-y-4 text-sm text-white/80">
                                <li>
                                    <Link href="/faq" className="whitespace-nowrap transition-colors hover:text-white hover:underline">
                                        {t('shared.footer.linksFaq')}
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/hubungi-kami" className="whitespace-nowrap transition-colors hover:text-white hover:underline">
                                        {t('shared.footer.linksContact')}
                                    </Link>
                                </li>
                                {/* <li>
                                    <Link href="/mitra" className="whitespace-nowrap transition-colors hover:text-white hover:underline">
                                        {t('shared.footer.linksPartner')}
                                    </Link>
                                </li> */}
                            </ul>
                        </Reveal>

                        <Reveal delay={0.3} className="flex flex-col">
                            <h3 className="mb-6 text-lg font-semibold">{t('shared.footer.followTitle')}</h3>
                            <div className="flex flex-col space-y-4 text-sm text-white/80">
                                {socialLinks.map((social, index) => (
                                    <a key={index} href={social.href} className="group flex items-center gap-3">
                                        <motion.div
                                            whileHover={{ scale: 1.12 }}
                                            className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[var(--primary-900)]"
                                        >
                                            <social.icon className="h-4 w-4" />
                                        </motion.div>
                                        <span className="whitespace-nowrap group-hover:text-white">{social.label}</span>
                                    </a>
                                ))}
                            </div>
                        </Reveal>
                    </div>
                </div>

                <div className="mt-12 border-t border-white/15 pt-6">
                    <div className="flex flex-col items-center justify-between gap-4 text-sm text-white/70 md:flex-row md:gap-0">
                        <p>{t('shared.footer.copyright')}</p>
                        <p>Jl. Pakuan No. 3, Kabupaten Bogor, Jawa Barat 16810</p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
