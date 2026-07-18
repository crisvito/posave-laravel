import { useLanguage } from '@/hooks';
import { AppLayout } from '@/layouts';
import { Head } from '@inertiajs/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { AboutSection, CtaSection, FeaturesSection, PartnerSection, TestimoniSection, WelcomeSection, WhySection } from '../components';

export default function Welcome() {
    const { t } = useLanguage();

    return (
        <AppLayout>
            <Head title={t('companyProfile.welcome.pageTitle')} />

            <div>
                <div className="mt-8">
                    <WelcomeSection />
                    <FeaturesSection />
                    <AboutSection />
                </div>

                <div className="relative right-1/2 left-1/2 w-screen -translate-x-1/2 bg-[var(--accent-700)] px-8 py-24 sm:px-6 md:px-16 lg:px-16 dark:bg-[var(--primary-900)]">
                    <WhySection />
                </div>

                <div className="relative right-1/2 left-1/2 -mx-[50vw] w-[100vw] max-w-[100vw] overflow-x-hidden bg-[var(--background)] py-10">
                    <TestimoniSection />
                </div>

                <section className="relative right-1/2 left-1/2 w-screen -translate-x-1/2 overflow-hidden bg-[linear-gradient(90deg,var(--second-accent)_0%,var(--primary-900)_100%)] py-18 lg:py-14">
                    <PartnerSection />
                </section>

                <div className="relative right-1/2 left-1/2 mt-10 mb-15 w-screen -translate-x-1/2 px-8 lg:px-16">
                    <CtaSection />
                </div>
            </div>
        </AppLayout>
    );
}
