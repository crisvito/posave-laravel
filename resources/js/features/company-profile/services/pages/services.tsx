import { Head, Link, usePage } from '@inertiajs/react';
import { AppLayout } from "@/layouts";
import { FeatureCard } from "../components/featureCard";
import { AnimatedLink } from '../components/animatedLink';

export default function Services() {
    const { translations, locale } = usePage().props as any;

    const t = translations['company-profile/services'];
    const isEn = locale === 'en';
    return (
        <AppLayout>
            <Head title={t.page_title} />
            
            <div className="py-4 md:py-8">
                
                <div className="relative h-[350px] md:h-[450px] rounded-[30px] md:rounded-[50px] flex items-center justify-center bg-[var(--black)] overflow-hidden mx-4 md:mx-0">
                    <img 
                        src="assets/services/services-banner.png" 
                        alt="Pemilik Toko"
                        className="absolute inset-0 w-full h-full object-cover opacity-80"
                    />
                    
                    <div className="absolute inset-0 bg-[var(--black)] opacity-20 md:bg-transparent"></div>

                    <div className="relative z-10 flex flex-col items-center text-center px-6">
                        
                        <h1 className="text-3xl md:text-[63px] font-semibold text-[var(--white)] drop-shadow-[2px_6px_10px_rgba(0,0,0,0.7)] tracking-wide mt-10 md:mt-12 lg:mt-25 leading-tight">
                            {t.hero_title}
                        </h1>
                        
                        <p className="text-base md:text-[26px] text-[var(--second-accent)] mt-3 mb-10 md:mb-12 lg:mb-20 drop-shadow-[1px_3px_5px_rgba(0,0,0,0.7)]">
                            {t.hero_subtitle}
                        </p>
                        
                        <AnimatedLink 
                            href="/register" 
                            className="bg-[var(--primary-900)] text-lg md:text-[22px] text-[var(--text-light)] font-medium px-8 md:px-10 py-2.5 md:py-2 rounded-full shadow-lg"
                            hoverBgClass="bg-[var(--secondary-900)]"
                        >
                            {t.try_now}
                        </AnimatedLink>
                    </div>
                </div>

                <div className="mt-16 md:mt-24 mb-16 md:mb-20 px-6 md:px-20 lg:px-28">
                    <h2 className="text-center text-3xl md:text-[48px] font-semibold text-[var(--black)] mb-8 md:mb-12">
                        {t.section_title}
                    </h2>
                    
                    <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-10 md:gap-0">
                        <div className="md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left">
                            <h3 className="text-2xl md:text-[28px] font-medium text-[var(--black)] mb-3 md:mb-4">
                                {t.chat_title}
                            </h3>
                            <p className="text-[var(--black)] mb-8 leading-relaxed text-base md:text-[20px]">
                                {t.chat_description}
                            </p>
                            <AnimatedLink 
                                href="#" 
                                className="bg-[#243447] text-[var(--text-light)] px-8 py-3 md:py-2.5 rounded-full text-base md:text-[20px] font-regular shadow-sm"
                                hoverBgClass="bg-[#1a2634]"
                            >
                                {t.see_how_it_works}
                            </AnimatedLink>
                        </div>
                        
                        <div className="md:w-1/2 flex justify-center md:justify-end">
                            <img 
                                src="assets/services/chat-toko.png" 
                                alt="Chat Toko" 
                                className="w-full max-w-[240px] md:max-w-[320px] object-contain" 
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-[var(--second-accent)] rounded-[30px] md:rounded-[40px] py-12 md:py-16 px-5 md:px-12 mx-4 md:mx-0 mb-10">
                    
                    <div className="mb-16 md:mb-20">
                        <h2 className="text-center text-3xl md:text-[48px] font-semibold text-[var(--black)] mb-8 md:mb-10">
                            {t.main_features}
                        </h2>
                        <FeatureCard /> 
                    </div>

                    <div className="mb-16 md:mb-20">
                        <h2 className="text-center text-3xl md:text-[48px] font-semibold text-[var(--black)] mb-8 md:mb-10">
                            {t.how_it_works}
                        </h2>
                        <div className="flex flex-wrap justify-center gap-4 md:gap-7">
                            <span className="bg-[var(--primary-900)] text-[var(--text-light)] px-6 md:px-8 py-3 md:py-4 rounded-full text-base md:text-[24px] font-semibold text-center w-full sm:w-auto">
                                {t.step_1}
                            </span>
                            <span className="bg-[var(--primary-900)] text-[var(--text-light)] px-6 md:px-8 py-3 md:py-4 rounded-full text-base md:text-[24px] font-semibold text-center w-full sm:w-auto">
                                {t.step_2}
                            </span>
                            <span className="bg-[var(--primary-900)] text-[var(--text-light)] px-6 md:px-8 py-3 md:py-4 rounded-full text-base md:text-[24px] font-semibold text-center w-full sm:w-auto">
                                {t.step_3}
                            </span>
                        </div>
                    </div>

                    <div className="bg-[var(--accent-700)] rounded-[24px] lg:rounded-[30px] p-6 md:p-8 lg:p-12 flex flex-col md:flex-row items-center justify-between shadow-sm gap-8 lg:gap-0 text-center md:text-left">
                        
                        <div className="md:w-[55%] lg:w-[60%] flex flex-col items-center md:items-start w-full">
                            
                            <h2 className="text-2xl sm:text-3xl md:text-3xl lg:text-[44px] font-semibold text-gray-900 mb-3 md:mb-6 leading-snug">
                                {t.cta_title}
                            </h2>
                            
                            <p className="text-[15px] sm:text-base md:text-lg lg:text-[20px] text-gray-800 mb-6 md:mb-8 px-2 md:px-0">
                                {t.cta_description}
                            </p>
                            
                            <AnimatedLink 
                                href="/register" 
                                className="bg-[#243447] text-[var(--text-light)] px-6 lg:px-8 py-3 lg:py-3.5 rounded-full text-base sm:text-lg lg:text-[24px] font-medium inline-block shadow-md"
                                hoverBgClass="bg-[#1a2634]"
                            >
                                {t.start_now}
                            </AnimatedLink>
                        </div>
                        
                        <div className="md:w-[45%] lg:w-[40%] flex justify-center md:justify-end w-full mt-2 md:mt-0">
                            <img 
                                src="assets/services/mulai-sekarang.png" 
                                alt="Mulai Sekarang" 
                                className="w-full max-w-[260px] md:max-w-[300px] lg:max-w-[380px] rounded-2xl object-cover" 
                            />
                        </div>
                        
                    </div>

                </div>

            </div>
        </AppLayout>
    );
}