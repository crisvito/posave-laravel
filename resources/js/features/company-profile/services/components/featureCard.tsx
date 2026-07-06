import { usePage } from '@inertiajs/react';

// Dummy Data
const FEATURES_DATA = [
    {
        id: 1,
        iconSrc: "/assets/services/chatbot.png",
        title_en: "AI Chatbot Assistant",
        title_id: "Asisten Chatbot AI",
        description_en: "Manage your store through conversations",
        description_id: "Kelola toko lewat percakapan",
    },
    {
        id: 2,
        iconSrc: "/assets/services/laporan.png",
        title_en: "Automatic Reports",
        title_id: "Laporan Otomatis",
        description_en: "Automatic business insights",
        description_id: "Insight bisnis otomatis",
    },
    {
        id: 3,
        iconSrc: "/assets/services/mode.png",
        title_en: "Two User Versions",
        title_id: "Dua Versi Pengguna",
        description_en: "Customize the system according to your needs",
        description_id: "Sesuaikan sistem dengan kebutuhan",
        iconClassName: "h-14",
    },
    {
        id: 4,
        iconSrc: "/assets/services/transaksi.png",
        title_en: "Transactions",
        title_id: "Transaksi",
        description_en: "Record transactions quickly",
        description_id: "Catat transaksi secara cepat",
    },
];

export const FeatureCard = () => {
    const { locale } = usePage().props as any;

    const isEn = locale === "en";

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES_DATA.map((feature) => (
                <div
                    key={feature.id}
                    className="bg-[var(--white)] min-h-[280px] rounded-[30px] p-6 flex flex-col items-center text-center shadow-sm drop-shadow-[2px_3px_6px_rgba(0,0,0,0.25)] h-full"
                >
                    <div className="h-24 flex items-center justify-center mb-4">
                        <img
                            src={feature.iconSrc}
                            alt={isEn ? feature.title_en : feature.title_id}
                            className={feature.iconClassName || "h-20"}
                        />
                    </div>

                    <div className="min-h-[64px] flex items-start justify-center w-full">
                        <h4 className="font-medium text-[20px] lg:text-[22px] text-[var(--black)] leading-snug">
                            {isEn ? feature.title_en : feature.title_id}
                        </h4>
                    </div>

                    <p className="text-[16px] lg:text-[18px] text-[var(--black)] mt-2">
                        {isEn
                            ? feature.description_en
                            : feature.description_id}
                    </p>
                </div>
            ))}
        </div>
    );
};