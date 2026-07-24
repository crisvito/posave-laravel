import { useLanguage } from '@/hooks';
import { pickLocale } from '@/lib/i18n/pick';
import { usePage } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
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
        <div className="mx-auto max-w-7xl px-6 py-20 sm:py-24 lg:px-8 lg:py-28">
            <div className="mx-auto mb-14 max-w-2xl text-center">
                <h2 className="text-3xl leading-[1.2] font-semibold tracking-tight text-[var(--foreground)] sm:text-4xl">
                    {t('companyProfile.welcome.testimoni.titleLine1')}{' '}
                    <span className="text-[var(--secondary-600)]">{t('companyProfile.welcome.testimoni.titleLine2')}</span>
                </h2>
            </div>

            <Swiper
                className="testimonial-swiper"
                modules={[Pagination, Autoplay]}
                slidesPerView={1.08}
                centeredSlides
                spaceBetween={24}
                loop={false}
                rewind
                grabCursor
                autoplay={{ delay: 4500, disableOnInteraction: false }}
                onSwiper={(swiper) => {
                    swiperRef.current = swiper;
                }}
                pagination={{ clickable: true, el: '.testimonial-dots', bulletClass: 'custom-dot', bulletActiveClass: 'custom-dot-active' }}
                breakpoints={{ 0: { slidesPerView: 1 }, 1024: { slidesPerView: 1.08 } }}
            >
                {testimonials.map((item: any) => (
                    <SwiperSlide key={item.id}>
                        <div className="mx-auto flex h-auto max-w-[920px] flex-col overflow-hidden rounded-[28px] border border-[var(--border-strong)] bg-[var(--card)] shadow-[0_20px_50px_-25px_rgba(15,23,42,0.3)] lg:h-[320px] lg:flex-row dark:shadow-[0_20px_50px_-25px_rgba(0,0,0,0.6)]">
                            <div className="h-[220px] w-full shrink-0 lg:h-full lg:w-[36%]">
                                <img src={item.photo} alt={item.name} className="h-full w-full object-cover" />
                            </div>

                            <div className="flex flex-1 flex-col justify-center px-8 py-8 lg:px-10">
                                <Quote className="mb-4 h-6 w-6 text-[var(--secondary-600)]/50" strokeWidth={1.5} />

                                <p className="mb-6 max-w-[480px] text-[15px] leading-[1.7] text-[var(--foreground)]">
                                    {pickLocale(locale, item, 'message')}
                                </p>

                                <div className="mt-auto flex items-center justify-between gap-4">
                                    <div>
                                        <h3 className="text-base font-semibold text-[var(--foreground)]">{item.name}</h3>
                                        <p className="text-sm text-[var(--grey-text)]">
                                            {item.position} · {item.company}
                                        </p>
                                    </div>
                                    <img src={item.logo} alt="logo" className="h-6 w-auto shrink-0 object-contain" />
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            <div className="mt-8 flex items-center justify-center gap-5">
                <button
                    type="button"
                    onClick={() => swiperRef.current?.slidePrev()}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border-strong)] text-[var(--foreground)] transition-colors hover:border-[var(--secondary-600)] hover:text-[var(--secondary-600)]"
                >
                    <ChevronLeft className="h-4 w-4" strokeWidth={2} />
                </button>

                <div className="testimonial-dots flex !w-auto items-center justify-center gap-2" />

                <button
                    type="button"
                    onClick={() => swiperRef.current?.slideNext()}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border-strong)] text-[var(--foreground)] transition-colors hover:border-[var(--secondary-600)] hover:text-[var(--secondary-600)]"
                >
                    <ChevronRight className="h-4 w-4" strokeWidth={2} />
                </button>
            </div>
        </div>
    );
}
