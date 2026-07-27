import { useLanguage } from '@/hooks';
import { AppLayout } from '@/layouts';
import { Head } from '@inertiajs/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useSmoothScroll } from '../../lib/use-smooth-scroll';
import { AboutSection, CtaSection, FeaturesSection, PartnerSection, TestimoniSection, WelcomeSection, WhySection } from '../components';

const FULL_BLEED = 'relative left-1/2 w-screen -translate-x-1/2';

export default function Welcome() {
    const { t } = useLanguage();
    useSmoothScroll();

    return (
        <AppLayout>
            <Head title={t('companyProfile.welcome.pageTitle')} />

            <div className="bg-[var(--background)]">
                <WelcomeSection />

                <div className={`${FULL_BLEED} bg-[var(--primary-900)]`}>
                    <FeaturesSection />
                </div>

                <AboutSection />

                <div className={`${FULL_BLEED} bg-[var(--primary-900)]`}>
                    <WhySection />
                </div>

                <TestimoniSection />

                <div className={`${FULL_BLEED} bg-[var(--primary-900)]`}>
                    <PartnerSection />
                </div>

                <div className={`${FULL_BLEED} px-6 py-10 sm:px-10 lg:px-16 `}>
                    <CtaSection />
                </div>
            </div>
        </AppLayout>
    );
}
