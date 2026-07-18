import { features } from '../lib';

export function FeaturesSection() {
    return (
        <>
            <div className="relative right-1/2 left-1/2 mt-10 w-screen -translate-x-1/2 bg-[var(--primary-900)] px-8 py-12 sm:px-6 lg:px-20">
                <h2 className="mb-3 text-center text-[30px] font-black tracking-tight text-white md:text-[34px]">Fitur Utama Posave</h2>
                <p className="mx-auto mb-8 max-w-full overflow-hidden text-center text-[17px] leading-tight font-medium overflow-ellipsis whitespace-nowrap text-white md:text-[19px]">
                    Prioritas kami adalah membantu Anda menjalankan bisnis dengan cepat, rapi, dan berkelanjutan.
                </p>

                <div className="relative mx-auto max-w-4xl pt-14">
                    {/* Big Card */}
                    <div
                        className="relative grid grid-cols-1 gap-4 overflow-visible rounded-[18px] pt-0 pb-8 md:grid-cols-3"
                        style={{ backgroundColor: 'var(--secondary-900)' }}
                    >
                        {features.map((feature, index) => (
                            <div key={index} className="relative flex min-h-[220px] flex-col items-center px-5 pt-24 pb-6 text-center">
                                {index > 0 && <div className="absolute top-10 bottom-6 left-0 w-px bg-white" />}
                                <div
                                    className="absolute top-0 left-1/2 flex h-[150px] w-[150px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full shadow-[0_8px_20px_rgba(0,0,0,0.18)]"
                                    style={{
                                        backgroundColor: 'var(--accent-700)',
                                        border: '5px solid var(--primary-900)',
                                        boxSizing: 'border-box',
                                    }}
                                >
                                    {feature.image ? (
                                        <img
                                            src={`assets/landing-page/${feature.image}`}
                                            alt={feature.title}
                                            className="h-[90px] w-[90px] rounded-2xl object-cover"
                                        />
                                    ) : (
                                        feature.icon
                                    )}
                                </div>
                                <div className="w-full pt-2">
                                    <p className="mb-1 text-[20px] font-semibold text-white md:text-[20px]">{feature.title}</p>
                                    <p className="text-[15px] leading-relaxed text-white md:text-[16px]">{feature.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
