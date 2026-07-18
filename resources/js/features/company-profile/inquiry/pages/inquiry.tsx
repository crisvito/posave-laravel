import { Button } from '@/components';
import { useLanguage } from '@/hooks';
import { AppLayout } from '@/layouts';
import { Head } from '@inertiajs/react';
import { ArrowRight, Clock, Headphones, HelpCircle, Mail, MapPin, PhoneCall } from 'lucide-react';
import { ContactForm } from '../components';

export default function Inquiry() {
    const { t } = useLanguage();

    return (
        <AppLayout>
            <Head title={t('companyProfile.inquiry.pageTitle')} />
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
                            {t('companyProfile.inquiry.heroTitleLine1')} <br />
                            <span className="text-[var(--foreground)]">{t('companyProfile.inquiry.heroTitleLine2')}</span>
                        </h1>
                        <p className="mt-4 text-[var(--muted-foreground)]">
                            {t('companyProfile.inquiry.heroSubtitleLine1')} <br />
                            {t('companyProfile.inquiry.heroSubtitleLine2')}
                        </p>
                        <div className="mt-8 flex flex-wrap gap-4">
                            <Button className="rounded-full bg-[var(--secondary-600)] px-8 text-white hover:bg-[var(--secondary-700)]">
                                <PhoneCall className="mr-2 h-4 w-4" /> {t('companyProfile.inquiry.contactButton')}
                            </Button>
                            <Button
                                variant="outline"
                                className="rounded-full border-[var(--secondary-600)] px-8 text-[var(--secondary-600)] hover:bg-[var(--secondary-600)]/10"
                            >
                                <HelpCircle className="mr-2 h-4 w-4" /> {t('companyProfile.inquiry.faqButton')}
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
                            <h3 className="text-lg font-bold text-[var(--foreground)]">{t('companyProfile.inquiry.faqBannerTitle')}</h3>
                            <p className="mt-1 text-sm text-[var(--muted-foreground)]">{t('companyProfile.inquiry.faqBannerSubtitle')}</p>
                        </div>
                    </div>
                    <Button className="mt-6 w-full rounded-full bg-[var(--secondary-600)] px-8 text-white hover:bg-[var(--secondary-700)] md:mt-0 md:w-auto">
                        {t('companyProfile.inquiry.faqBannerButton')} <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-8">
                    <div className="flex flex-col justify-center">
                        <h2 className="text-3xl font-bold text-[var(--foreground)]">{t('companyProfile.inquiry.contactSectionTitle')}</h2>
                        <div className="mt-2 h-1 w-12 bg-[var(--secondary-600)]"></div>
                        <p className="mt-6 text-[var(--muted-foreground)]">{t('companyProfile.inquiry.contactSectionBodyLine1')}</p>
                        <p className="mt-4 mb-8 text-[var(--muted-foreground)]">{t('companyProfile.inquiry.contactSectionBodyLine2')}</p>
                        <div className="flex flex-col gap-6">
                            <div className="flex items-start gap-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--secondary-600)]/10 text-[var(--secondary-600)]">
                                    <Clock className="h-5 w-5" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-[var(--foreground)]">{t('companyProfile.inquiry.hoursTitle')}</h4>
                                    <p className="text-sm text-[var(--muted-foreground)]">
                                        {t('companyProfile.inquiry.hoursValueLine1')}
                                        <br />
                                        {t('companyProfile.inquiry.hoursValueLine2')}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--secondary-600)]/10 text-[var(--secondary-600)]">
                                    <Mail className="h-5 w-5" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-[var(--foreground)]">{t('companyProfile.inquiry.emailTitle')}</h4>
                                    <p className="text-sm text-[var(--muted-foreground)]">support@posave.com</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--secondary-600)]/10 text-[var(--secondary-600)]">
                                    <PhoneCall className="h-5 w-5" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-[var(--foreground)]">{t('companyProfile.inquiry.phoneTitle')}</h4>
                                    <p className="text-sm text-[var(--muted-foreground)]">+62 811 2345 567</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--secondary-600)]/10 text-[var(--secondary-600)]">
                                    <MapPin className="h-5 w-5" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-[var(--foreground)]">{t('companyProfile.inquiry.addressTitle')}</h4>
                                    <p className="text-sm text-[var(--muted-foreground)]">{t('companyProfile.inquiry.addressValue')}</p>
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
                            <h3 className="text-xl font-bold text-[var(--foreground)]">{t('companyProfile.inquiry.helpBannerTitle')}</h3>
                            <p className="mt-1 text-[var(--muted-foreground)]">{t('companyProfile.inquiry.helpBannerSubtitle')}</p>
                        </div>
                    </div>
                    <Button className="mt-6 h-12 w-full rounded-full bg-[var(--secondary-600)] px-8 text-white hover:bg-[var(--secondary-700)] md:mt-0 md:w-auto">
                        <Headphones className="mr-2 h-4 w-4" /> {t('companyProfile.inquiry.helpBannerButton')}
                    </Button>
                </div>
            </div>
        </AppLayout>
    );
}
