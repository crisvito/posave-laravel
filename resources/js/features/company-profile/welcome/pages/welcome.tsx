import { AppLayout } from '@/layouts';
import { type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { useRef } from "react";
import 'swiper/css';
import "swiper/css/navigation";
import "swiper/css/pagination";

const features = [
    {
        title: {
            id: 'Mode Lite & Advanced',
            en: 'Lite & Advanced Mode',
        },
        desc: {
            id: 'Dapat memenuhi kebutuhan pemula dan kebutuhan profesional',
            en: 'Designed to meet the needs of both beginners and professionals.',
        },
        image: 'fitur1.png',
        icon: (
            <svg viewBox="0 0 24 24" width={52} height={52} fill="none" stroke="#C9E1F0" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a5 5 0 0 1 5 5c0 2-1 3.5-2.5 4.5M7 7a5 5 0 0 0 5 5" />
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                <path d="M9 9l6-6M15 9l-6-6" />
            </svg>
        ),
    },
    {
        title: {
            id: 'Asisten Personal A.I.',
            en: 'Personal A.I. Assistant',
        },
        desc: {
            id: 'Dilengkapi dengan A.I. yang dapat membantu operasional toko.',
            en: 'Equipped with AI to help manage daily store operations.',
        },
        image: 'fitur2.png',
        icon: (
            <svg viewBox="0 0 24 24" width={52} height={52} fill="none" stroke="#C9E1F0" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
                <rect x="4" y="6" width="16" height="12" rx="3" />
                <path d="M9 10h.01M12 10h.01M15 10h.01" />
                <path d="M9 6V4M15 6V4" />
                <circle cx="9" cy="14" r="0.8" fill="#C9E1F0" stroke="none" />
                <circle cx="12" cy="14" r="0.8" fill="#C9E1F0" stroke="none" />
                <circle cx="15" cy="14" r="0.8" fill="#C9E1F0" stroke="none" />
            </svg>
        ),
    },
    {
        title: {
            id: 'Laporan Real-Time',
            en: 'Real-Time Reports',
        },
        desc: {
            id: 'Laporan dapat dilihat secara real-time sesuai kondisi di lapangan.',
            en: 'View reports in real time based on actual business activities.',
        },
        image: 'fitur3.png',
        icon: (
            <svg viewBox="0 0 24 24" width={52} height={52} fill="none" stroke="#C9E1F0" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <polyline points="8 15 10 17 16 11" />
            </svg>
        ),
    },
];

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;
    const { testimonials, translations, locale } = usePage().props as any;
    const prevRef = useRef<HTMLButtonElement | null>(null);
    const nextRef = useRef<HTMLButtonElement | null>(null);
    const dotsRef = useRef<HTMLDivElement | null>(null);
    const swiperRef = useRef<any>(null);
    const t = translations['company-profile/welcome'];
    const isEn = locale === 'en';

    return (
        <AppLayout>
            <Head title="Landing Page" />

            <div className="relative left-1/2 right-1/2 w-screen -translate-x-1/2 px-4 sm:px-6 lg:px-18 mt-8">
                <div
                    className="rounded-[32px] overflow-hidden w-full max-w-[1600px] mx-auto"
                    style={{
                        height: '570px',
                        boxShadow: '0 4px 10px 0 rgba(0,0,0,0.25)',
                    }}
                >
                    <div
                        className="w-full h-full relative"
                        style={{
                            backgroundImage: "url('assets/landing-page/landingpage_bgtop.jpeg')",
                            backgroundSize: 'cover',
                            backgroundPosition: '60% center',
                            backgroundRepeat: 'no-repeat',
                        }}
                    >
                        {/* GRADIENT OVERLAY */}
                        <div
                            className="absolute inset-0"
                            style={{
                                background: 'linear-gradient(to right, rgba(255,255,255,0.95) 30%, rgba(255,255,255,0.6) 55%, rgba(255,255,255,0) 75%)',
                            }}
                        />

                        {/* CONTENT */}
                        <div className="relative z-10 flex items-center h-full px-16">
                            <div className="max-w-lg">
                                <h1 className="text-[70px] leading-[1.1] font-medium text-black tracking-tight">
                                    {t.hero_title_1} <br />
                                    <span className="italic font-semibold whitespace-nowrap tracking-[0.025em] text-[80px]">
                                        {t.hero_title_2}
                                    </span>
                                </h1>

                                <p className="mt-4 text-[13px] max-w-lg leading-snug whitespace-nowrap overflow-hidden overflow-ellipsis">
                                    {t.hero_desc_1}
                                    <br />
                                    {t.hero_desc_2}
                                </p>

                                <button className="mt-6 px-7 py-3.5 rounded-full bg-[#1a2744] text-white text-sm font-medium hover:bg-[#243460] transition-colors duration-200">
                                    {t.hero_cta}
                                </button>
                            </div>
                        </div>
                </div>
            </div>

            {/* FITUR UTAMA SECTION */}
            <div className="relative left-1/2 right-1/2 w-screen -translate-x-1/2 mt-10 bg-[var(--primary-900)] px-4 sm:px-6 lg:px-20 py-12">
                <h2 className="text-center text-[30px] md:text-[34px] font-black text-white mb-3 tracking-tight">
                    {t.features_heading}
                </h2>
                <p className="text-center text-[17px] md:text-[19px] font-medium text-white mb-8 mx-auto leading-tight whitespace-nowrap overflow-hidden overflow-ellipsis max-w-full">
                    {t.features_subheading}
                </p>

                <div className="relative pt-14 max-w-4xl mx-auto">
                    {/* Big Card */}
                    <div
                        className="relative grid grid-cols-1 md:grid-cols-3 gap-4 rounded-[18px] overflow-visible pt-0 pb-8"
                        style={{ backgroundColor: 'var(--secondary-900)' }}
                    >
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="relative flex min-h-[220px] flex-col items-center text-center px-5 pt-24 pb-6"
                            >
                                {index > 0 && (
                                    <div className="absolute left-0 top-10 bottom-6 w-px bg-white" />
                                )}

                                <div
                                    className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 flex h-[150px] w-[150px] items-center justify-center rounded-full shadow-[0_8px_20px_rgba(0,0,0,0.18)]"
                                    style={{
                                        backgroundColor: 'var(--accent-700)',
                                        border: '5px solid #22303F',
                                        boxSizing: 'border-box',
                                    }}
                                >
                                    {feature.image ? (
                                        <img
                                            src={`assets/landing-page/${feature.image}`}
                                            alt={isEn ? feature.title.en : feature.title.id}
                                            className="h-[90px] w-[90px] object-cover rounded-2xl"
                                        />
                                    ) : (
                                        feature.icon
                                    )}
                                </div>

                                <div className="w-full pt-2">
                                    <p className="text-[20px] md:text-[20px] font-semibold text-white mb-1">
                                        {isEn ? feature.title.en : feature.title.id}
                                    </p>

                                    <p className="text-[15px] md:text-[16px] text-white leading-relaxed">
                                        {isEn ? feature.desc.en : feature.desc.id}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ABOUT / MISSION SECTION */}
            <div className="relative left-1/2 right-1/2 w-screen -translate-x-1/2 px-4 sm:px-6 lg:px-20 py-0">
                <div className="max-w-6xl mx-auto">
                    <div className="grid gap-12 lg:grid-cols-[1.2fr_0.9fr] items-center px-8 py-14 md:px-16 md:py-16">

                            {/* LEFT: Text */}
                            <div className="flex-1 min-w-0">
                                <div className="flex flex-col items-start gap-2 mb-6">
                                    <img
                                        src="assets/landing-page/logo.png"
                                        alt="POSAVE"
                                        className="h-12 w-auto object-contain scale-450 ml-16"
                                    />

                                    <span className="text-[13px] uppercase tracking-[0.1em] text-[#475569]">
                                        {t.slogan}
                                    </span>
                                </div>

                                <h2
                                    className="text-[42px] leading-[1.15] font-semibold tracking-[0.05em] text-[#0f1c36] mb-6"
                                    style={{
                                        WebkitTextStroke: '1px #0f1c36',
                                    }}
                                >
                                    {t.about_title_1} <br />
                                    <span className="font-semibold">
                                        {t.about_title_2}
                                    </span>
                                </h2>

                                <p className="max-w-xl text-[16px] leading-9 text-[#000000] mb-10">
                                    {t.about_desc}
                                </p>

                                <button
                                    onClick={() => window.history.back()}
                                    className="inline-flex items-center gap-2 text-[16px] font-semibold text-[#0f1c36] bg-transparent border-none p-0 cursor-pointer hover:opacity-70 transition-opacity"
                                >
                                    {t.about_cta}
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                        <path d="M6 3l5 5-5 5" stroke="#0f1c36" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </button>
                            </div>

                            {/* RIGHT: Images */}
                            <div className="relative min-h-[420px] lg:min-h-[440px]">
                                <div className="absolute -top-5 right-0 w-[360px] h-[430px] rounded-[30px] overflow-hidden shadow-[0_24px_60px_rgba(15,23,42,0.2)]">
                                    <img
                                        src="assets/landing-page/section3b.jpeg"
                                        alt="Kasir toko"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="absolute -bottom-8 -left-6 w-[210px] h-[270px] rounded-[28px] overflow-hidden shadow-[0_20px_50px_rgba(15,23,42,0.16)]">
                                    <img
                                        src="assets/landing-page/section3a.jpeg"
                                        alt="Tim Posave"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            {/* KENAPA PILIH POSAVE SECTION */}
            <div className="relative left-1/2 right-1/2 w-screen -translate-x-1/2 bg-[var(--accent-700)]  px-4 sm:px-6 lg:px-20 py-24">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col lg:flex-row items-center gap-0">
                        
                        {/* LEFT: Large Image Frame */}
                        <div className="w-full lg:w-1/2 flex justify-start z-10 ">
                            <div 
                                className="rounded-[65px] overflow-hidden h-[810px] w-full max-w-[600px]"
                                style={{ boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.35)' }}
                            >
                                <img 
                                    src="assets/landing-page/kenapa-posave.jpeg" 
                                    alt="Kenapa Pilih Posave" 
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>

                        {/* RIGHT: Content Section (Title + Card) */}
                        <div className="w-full lg:w-1/2 flex flex-col lg:-ml-30 z-20 mt-12 lg:mt-0">
                            
                            {/* Title aligned to the right content area */}
                            <div className="mb-3 lg:pl-12 ml-15">
                                <h2 className="text-[52px] font-bold text-[#0f1c36] leading-none tracking-tight">
                                    {t.why_heading}
                                </h2>
                                <div className="flex items-center gap-4 mt-0 ml-21.5">
                                    <img 
                                        src="assets/landing-page/logo.png" 
                                        alt="POSAVE" 
                                        className="h-16 object-contain scale-450" 
                                    />
                                    <span className="text-[70px] font-bold text-[var(--secondary-900)] leading-none ml-18">?</span>
                                </div>
                            </div>

                            {/* Dark Blue Card */}
                            <div 
                                className="bg-[var(--primary-900)] border-10 border-[var(--accent-700)] rounded-[55px] p-10 lg:p-14 text-white shadow-2xl"
                                style={{ boxShadow: '0 40px 80px -15px rgba(0, 0, 0, 0.5)' }}
                            >
                                <p className="text-[17px] leading-relaxed mb-10 text-gray-200">
                                    <span className="font-bold text-white text-lg">Posave</span> {t.why_description}
                                </p>

                                <div className="space-y-10">
                                    {/* Feature 1 */}
                                    <div className="flex gap-6 items-start">
                                        <div className="flex-shrink-0 w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-lg">

                                            <svg
                                                width="48"
                                                height="48"
                                                viewBox="0 0 48 48"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="w-9 h-9"
                                            >
                                                <path
                                                    d="M29.8081 7.00221H18.1921C16.7879 7.00163 15.3973 7.28611 14.0999 7.83939C12.8024 8.39267 11.6235 9.20391 10.6305 10.2268C9.63743 11.2496 8.84976 12.464 8.31245 13.8006C7.77515 15.1372 7.49874 16.5697 7.49902 18.0164V29.9836C7.49846 31.4305 7.77466 32.8633 8.31184 34.2001C8.84901 35.5369 9.63664 36.7516 10.6297 37.7747C11.6228 38.7978 12.8018 39.6092 14.0994 40.1626C15.397 40.716 16.7877 41.0006 18.1921 41H29.8081C31.2125 41.0006 32.6032 40.716 33.9008 40.1626C35.1984 39.6092 36.3774 38.7978 37.3705 37.7747C38.3636 36.7516 39.1512 35.5369 39.6884 34.2001C40.2255 32.8633 40.5017 31.4305 40.5012 29.9836V18.0164C40.5017 16.5695 40.2255 15.1367 39.6884 13.7999C39.1512 12.4631 38.3636 11.2484 37.3705 10.2253C36.3774 9.20225 35.1984 8.39081 33.9008 7.83739C32.6032 7.28397 31.2125 6.99942 29.8081 7V7.00221Z"
                                                    stroke="#22303F"
                                                    strokeWidth="3"
                                                />

                                                <path
                                                    d="M40.3251 31.934H43.8C44.3835 31.934 44.9431 31.6952 45.3556 31.2701C45.7682 30.8451 46 30.2686 46 29.6675V18.3349C46 17.7338 45.7682 17.1573 45.3556 16.7322C44.9431 16.3072 44.3835 16.0684 43.8 16.0684H40.3229M7.67707 31.934H4.2C3.91109 31.934 3.62501 31.8754 3.3581 31.7615C3.09118 31.6476 2.84865 31.4806 2.64436 31.2701C2.44008 31.0597 2.27803 30.8098 2.16746 30.5348C2.0569 30.2598 2 29.9651 2 29.6675V18.3349C2 17.7338 2.23178 17.1573 2.64436 16.7322C3.05695 16.3072 3.61652 16.0684 4.2 16.0684H7.67707"
                                                    stroke="#22303F"
                                                    strokeWidth="3"
                                                />

                                                <path
                                                    d="M4.17773 16.0685V7.00244M43.7992 16.0685L43.7777 7.00244M28.3563 21.7337H32.7541M17.3992 19.1267V23.6597M19.5992 30.7998C20.7692 31.9962 22.3508 32.6675 23.9992 32.6675C25.6476 32.6675 27.2292 31.9962 28.3992 30.7998"
                                                    stroke="#22303F"
                                                    strokeWidth="3"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>

                                        </div>

                                        <div>
                                            <h4 className="font-bold text-[20px] mb-1">
                                                {t.feature_ai_title}
                                            </h4>

                                            <p className="text-[15px] text-gray-300 leading-snug">
                                                {t.feature_ai_desc}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Feature 2 */}
                                    <div className="flex gap-6 items-start">
                                        <div className="flex-shrink-0 w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-lg">

                                            <svg
                                                width="48"
                                                height="48"
                                                viewBox="0 0 48 48"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="w-9 h-9"
                                            >
                                                <path
                                                    d="M24.0057 44V4M24.0057 24H43.0533M4 6.85714V41.1429C4 41.9006 4.30102 42.6273 4.83684 43.1632C5.37266 43.699 6.09938 44 6.85714 44H41.1429C41.9006 44 42.6273 43.699 43.1632 43.1632C43.699 42.6273 44 41.9006 44 41.1429V6.85714C44 6.09938 43.699 5.37266 43.1632 4.83684C42.6273 4.30102 41.9006 4 41.1429 4H6.85714C6.09938 4 5.37266 4.30102 4.83684 4.83684C4.30102 5.37266 4 6.09938 4 6.85714Z"
                                                    stroke="#22303F"
                                                    strokeWidth="3"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>

                                        </div>

                                        <div>
                                            <h4 className="font-bold text-[20px] mb-1">
                                                {t.feature_lite_title}
                                            </h4>

                                            <p className="text-[15px] text-gray-300 leading-snug">
                                                {t.feature_lite_desc}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Feature 3 */}
                                    <div className="flex gap-6 items-start">
                                        <div className="flex-shrink-0 w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-lg">

                                            <svg
                                                width="48"
                                                height="48"
                                                viewBox="0 0 48 48"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="w-9 h-9"
                                            >
                                                <path
                                                    d="M45 42C45 42 48 42 48 39C48 36 45 27 33 27C21 27 18 36 18 39C18 42 21 42 21 42H45ZM21.066 39L21 38.988C21.003 38.196 21.501 35.898 23.28 33.828C24.936 31.887 27.846 30 33 30C38.151 30 41.061 31.89 42.72 33.828C44.499 35.898 44.994 38.199 45 38.988L44.976 38.994L44.934 39H21.066ZM33 21C34.5913 21 36.1174 20.3679 37.2426 19.2426C38.3679 18.1174 39 16.5913 39 15C39 13.4087 38.3679 11.8826 37.2426 10.7574C36.1174 9.63214 34.5913 9 33 9C31.4087 9 29.8826 9.63214 28.7574 10.7574C27.6321 11.8826 27 13.4087 27 15C27 16.5913 27.6321 18.1174 28.7574 19.2426C29.8826 20.3679 31.4087 21 33 21ZM42 15C42 16.1819 41.7672 17.3522 41.3149 18.4442C40.8626 19.5361 40.1997 20.5282 39.364 21.364C38.5282 22.1997 37.5361 22.8626 36.4442 23.3149C35.3522 23.7672 34.1819 24 33 24C31.8181 24 30.6478 23.7672 29.5558 23.3149C28.4639 22.8626 27.4718 22.1997 26.636 21.364C25.8003 20.5282 25.1374 19.5361 24.6851 18.4442C24.2328 17.3522 24 16.1819 24 15C24 12.6131 24.9482 10.3239 26.636 8.63604C28.3239 6.94821 30.6131 6 33 6C35.3869 6 37.6761 6.94821 39.364 8.63604C41.0518 10.3239 42 12.6131 42 15ZM20.808 27.84C19.6073 27.4647 18.3705 27.2164 17.118 27.099C16.4141 27.0304 15.7072 26.9973 15 27C3 27 0 36 0 39C0 41 1 42 3 42H15.648C15.2035 41.0634 14.9817 40.0366 15 39C15 35.97 16.131 32.874 18.27 30.288C18.999 29.406 19.848 28.581 20.808 27.84ZM14.76 30C12.9856 32.6683 12.0265 35.7956 12 39H3C3 38.22 3.492 35.91 5.28 33.828C6.915 31.92 9.756 30.06 14.76 30.003V30ZM4.5 16.5C4.5 14.1131 5.44821 11.8239 7.13604 10.136C8.82387 8.44821 11.1131 7.5 13.5 7.5C15.8869 7.5 18.1761 8.44821 19.864 10.136C21.5518 11.8239 22.5 14.1131 22.5 16.5C22.5 18.8869 21.5518 21.1761 19.864 22.864C18.1761 24.5518 15.8869 25.5 13.5 25.5C11.1131 25.5 8.82387 24.5518 7.13604 22.864C5.44821 21.1761 4.5 18.8869 4.5 16.5ZM13.5 10.5C11.9087 10.5 10.3826 11.1321 9.25736 12.2574C8.13214 13.3826 7.5 14.9087 7.5 16.5C7.5 18.0913 8.13214 19.6174 9.25736 20.7426C10.3826 21.8679 11.9087 22.5 13.5 22.5C15.0913 22.5 16.6174 21.8679 17.7426 20.7426C18.8679 19.6174 19.5 18.0913 19.5 16.5C19.5 14.9087 18.8679 13.3826 17.7426 12.2574C16.6174 11.1321 15.0913 10.5 13.5 10.5Z"
                                                    fill="#22303F"
                                                />
                                            </svg>

                                        </div>

                                        <div>
                                            <h4 className="font-bold text-[20px] mb-1">
                                                {t.feature_branch_title}
                                            </h4>

                                            <p className="text-[15px] text-gray-300 leading-snug">
                                                {t.feature_branch_desc}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* SECTION TESTIMONI */}
            <div className="relative left-1/2 right-1/2 -mx-[50vw] w-[100vw] max-w-[100vw] bg-white py-10 overflow-x-hidden">

                <div className="px-18 overflow-hidden">

                    <div className="border border-[#9dc3dc] rounded-[42px] px-4 py-6 bg-white overflow-hidden">

                        {/* TITLE */}
                        <div className="flex justify-center mb-14 px-4 mt-5">

                            <div className="flex items-center justify-center flex-wrap gap-y-4 text-center">

                                {/* TEXT */}
                                <h2 className="text-[20px] sm:text-[28px] md:text-[36px] lg:text-[44px] font-medium tracking-[-0.05em] leading-tight text-black">
                                    {t.testi_title_1}
                                </h2>

                            {/* LOGO */}
                            <div className="mx-8 md:mx-14 lg:mx-20">

                                <img
                                    src="assets/landing-page/logo.png"
                                    alt="POSAVE"
                                    className="
                                        h-[28px]
                                        sm:h-[38px]
                                        md:h-[48px]
                                        lg:h-[58px]
                                        w-auto
                                        object-contain
                                        shrink-0
                                        scale-400
                                    "
                                />

                            </div>

                            {/* TEXT */}
                            <h2 className="text-[20px] sm:text-[28px] md:text-[36px] lg:text-[44px] font-medium tracking-[-0.05em] leading-tight text-black">
                                {t.testi_title_2}
                            </h2>

                        </div>

                    </div>

                    {/* SWIPER AREA */}
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
                            el: ".testimonial-dots",
                            bulletClass: "custom-dot",
                            bulletActiveClass: "custom-dot-active",
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
                                <div className="bg-[#e9e9e9] rounded-[36px] overflow-hidden flex flex-col lg:flex-row h-[550px] max-w-[980px] mx-auto">

                                    {/* LEFT IMAGE */}
                                    <div className="w-full lg:w-[38%] h-[200px] lg:h-full shrink-0 p-0">
                                        <img
                                            src={item.photo}
                                            alt={item.name}
                                            className="w-full h-full object-cover rounded-[32px]"
                                        />
                                    </div>

                                    {/* RIGHT CONTENT */}
                                    <div className="flex-1 px-8 py-8 lg:px-10 lg:py-10 flex flex-col">

                                        {/* TOP */}
                                        <div>
                                            {/* NAME */}
                                            <h2 className="text-[24px] md:text-[26px] lg:text-[28px] font-bold tracking-[-0.04em] leading-tight text-[#111] mt-17">
                                                {item.name}
                                            </h2>

                                            {/* POSITION */}
                                            <p className="mt-1 text-[15px] md:text-[16px] text-[#40566b] font-medium">
                                                {item.position} {item.company}
                                            </p>

                                            {/* LOGO */}
                                            <div className="mt-6">
                                                <img
                                                    src={item.logo}
                                                    alt="logo"
                                                    className="w-[80px] h-auto object-contain"
                                                />
                                            </div>
                                        </div>

                                        {/* MESSAGE */}
                                        <div className="mt-[100px]">
                                            <p className="text-[15px] leading-[1.7] text-[#111] max-w-[520px]">
                                                "{item.message}"
                                            </p>
                                        </div>

                                    </div>

                                </div>
                            </SwiperSlide>

                        ))}

                    </Swiper>

                        {/* CONTROLS */}
                        <div className="mt-10 flex items-center justify-center gap-4">
                            <button
                                type="button"
                                onClick={() => swiperRef.current?.slidePrev()}
                                className="flex items-center justify-center text-[42px] text-[#2f628c] leading-none hover:scale-110 transition-all"
                            >
                                ‹
                            </button>

                            <div className="testimonial-dots flex !w-auto items-center justify-center gap-2" />

                            <button
                                type="button"
                                onClick={() => swiperRef.current?.slideNext()}
                                className="flex items-center justify-center text-[42px] text-[#2f628c] leading-none hover:scale-110 transition-all"
                            >
                                ›
                            </button>
                        </div>
                    </div>

                </div>

            </div>

            {/* PARTNERS SECTION */}
            <section
                className="relative left-1/2 right-1/2 w-screen -translate-x-1/2 overflow-hidden py-18 lg:py-14"
                style={{
                    background:
                        'linear-gradient(90deg, rgba(143,191,218,1) 0%, rgba(57,74,86,1) 100%)',
                }}
            >
                <div className="max-w-7xl mx-auto px-6">

                    {/* Heading */}
                    <div className="text-center mb-12">
                        <h2 className="text-white text-[42px] font-black tracking-tight leading-none">
                            {t.partners_title}
                        </h2>

                        <p className="text-white/85 text-[22px] mt-4 font-medium">
                            {t.partners_subtitle}
                        </p>
                    </div>

                    {/* Logos */}
                    <div className="flex flex-wrap items-center justify-center gap-16 lg:gap-28">

                        {/* SERONA */}
                        <div className="flex items-center justify-center corner-lg">
                            <img
                                src="assets/landing-page/serona.png"
                                alt="Serona"
                                className="h-[140px] object-cover rounded-[36px] shadow-lg"
                            />
                        </div>

                        {/* VIKTORIFIT */}
                        <div className="flex items-center justify-center">
                            <img
                                src="assets/landing-page/viktorifit.png"
                                alt="Viktorifit"
                                className="h-[140px] object-contain"
                            />
                        </div>

                        {/* STUDYSPHERE */}
                        <div className="flex items-center justify-center">
                            <img
                                src="assets/landing-page/studysphere.png"
                                alt="Studysphere"
                                className="h-[150px] object-contain"
                            />
                        </div>

                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <div className="relative left-1/2 right-1/2 w-screen -translate-x-1/2 px-4 sm:px-6 lg:px-18 mt-10 mb-15">
                <div
                    className="rounded-[32px] overflow-hidden w-full max-w-[1600px] mx-auto"
                    style={{
                        height: '570px',
                        boxShadow: '0 4px 10px 0 rgba(0,0,0,0.25)',
                    }}
                >
                    <div
                        className="w-full h-full relative"
                        style={{
                            backgroundImage: "url('assets/landing-page/gambarbottom.jpeg')",
                            backgroundSize: 'cover',
                            backgroundPosition: '40% center',
                            backgroundRepeat: 'no-repeat',
                        }}
                    >

                        {/* GRADIENT OVERLAY */}
                        <div
                            className="absolute inset-0"
                            style={{
                                background:
                                    'linear-gradient(to left, rgba(255,255,255,0.97) 28%, rgba(255,255,255,0.72) 50%, rgba(255,255,255,0.08) 78%)',
                            }}
                        />

                        {/* CONTENT */}
                        <div className="relative z-10 flex justify-end items-center h-full px-16 lg:px-24">

                            <div className="max-w-[500px] text-center">

                                {/* LOGO */}
                                <img
                                    src="assets/landing-page/logo.png"
                                    alt="POSAVE"
                                    className="h-[72px] object-contain mx-auto mb-5 scale-450"
                                />

                                {/* TITLE */}
                                <h1
                                    className="
                                        text-[38px]
                                        leading-[1.1]
                                        font-medium
                                        tracking-[-0.055em]
                                        text-[#0f1c36]
                                        max-w-[420px]
                                        mx-auto
                                    "
                                >
                                    {t.cta_bottom_title}
                                </h1>

                                {/* BUTTON */}
                                <button
                                    className="
                                        mt-8
                                        px-12
                                        py-3
                                        rounded-full
                                        bg-[#22303F]
                                        text-white
                                        text-[22px]
                                        font-medium
                                        hover:bg-[#2b3c4f]
                                        transition-all
                                        duration-300
                                        shadow-lg
                                    "
                                >
                                    {t.cta_bottom_btn}
                                </button>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}