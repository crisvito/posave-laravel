import { useLanguage } from '@/hooks';
import { pickLocale } from '@/lib/i18n/pick';
import { usePage } from '@inertiajs/react';
import { useRef } from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Autoplay, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

export function TestimoniSection() {
    const { testimonials } = usePage().props as any;
    const { locale, t } = useLanguage();
    const swiperRef = useRef<any>(null);

    return (
        <>
            <div className="flex justify-center overflow-hidden px-8 md:px-16">
                <div className="max-w-6xl overflow-hidden rounded-[42px] border border-[var(--border-strong)] bg-[var(--card)] px-4 py-6">
                    <div className="mt-5 mb-5 flex justify-center px-4">
                        <div className="flex flex-wrap items-center justify-center gap-y-4 text-center">
                            <h2 className="text-[20px] leading-tight font-medium tracking-[-0.05em] text-[var(--foreground)] sm:text-[28px] md:text-[36px] lg:text-[44px]">
                                {t('companyProfile.welcome.testimoni.titleLine1')}
                            </h2>

                            <div className="mx-8 md:mx-14 lg:mx-20">
                                <img
                                    src="assets/landing-page/logo.png"
                                    alt="POSAVE"
                                    className="h-[28px] w-auto shrink-0 scale-400 object-contain sm:h-[38px] md:h-[48px] lg:h-[58px] dark:brightness-0 dark:invert"
                                />
                            </div>

                            <h2 className="text-[20px] leading-tight font-medium tracking-[-0.05em] text-[var(--foreground)] sm:text-[28px] md:text-[36px] lg:text-[44px]">
                                {t('companyProfile.welcome.testimoni.titleLine2')}
                            </h2>
                        </div>
                    </div>

                    <Swiper
                        className="testimonial-swiper overflow-hidden"
                        modules={[Pagination, Autoplay]}
                        slidesPerView={1.08}
                        centeredSlides={true}
                        spaceBetween={26}
                        loop={false}
                        rewind={true}
                        loopAdditionalSlides={3}
                        grabCursor={true}
                        autoplay={{
                            delay: 4500,
                            disableOnInteraction: false,
                        }}
                        onSwiper={(swiper) => {
                            swiperRef.current = swiper;
                        }}
                        pagination={{
                            clickable: true,
                            el: '.testimonial-dots',
                            bulletClass: 'custom-dot',
                            bulletActiveClass: 'custom-dot-active',
                        }}
                        breakpoints={{
                            0: {
                                slidesPerView: 1,
                            },
                            1024: {
                                slidesPerView: 1.08,
                            },
                        }}
                    >
                        {testimonials.map((item: any) => (
                            <SwiperSlide key={item.id}>
                                <div className="mx-auto flex h-[350px] max-w-[950px] flex-col overflow-hidden rounded-[36px] bg-[var(--second-accent)] lg:flex-row">
                                    <div className="h-[200px] w-full shrink-0 p-0 lg:h-full lg:w-[38%]">
                                        <img src={item.photo} alt={item.name} className="h-full w-full rounded-[32px] object-cover" />
                                    </div>

                                    <div className="flex flex-1 flex-col justify-center px-8 py-8 lg:px-10 lg:py-10">
                                        <div>
                                            <h2 className="text-[24px] leading-tight font-bold tracking-[-0.04em] text-[var(--foreground)] md:text-[26px] lg:text-[28px]">
                                                {item.name}
                                            </h2>

                                            <p className="mt-1 text-[15px] font-medium text-[var(--grey-text)] md:text-[16px]">
                                                {item.position} {item.company}
                                            </p>

                                            <div className="mt-6">
                                                <img src={item.logo} alt="logo" className="h-auto w-[80px] object-contain" />
                                            </div>
                                        </div>

                                        <div className="mt-3">
                                            <p className="max-w-[520px] text-[15px] leading-[1.7] text-[var(--foreground)]">
                                                "{pickLocale(locale, item, 'message')}"
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    <div className="mt-5 flex items-center justify-center gap-4">
                        <button
                            type="button"
                            onClick={() => swiperRef.current?.slidePrev()}
                            className="flex items-center justify-center text-[42px] leading-none text-[var(--secondary-600)] transition-all hover:scale-110"
                        >
                            ‹
                        </button>

                        <div className="testimonial-dots flex !w-auto items-center justify-center gap-2" />

                        <button
                            type="button"
                            onClick={() => swiperRef.current?.slideNext()}
                            className="flex items-center justify-center text-[42px] leading-none text-[var(--secondary-600)] transition-all hover:scale-110"
                        >
                            ›
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
