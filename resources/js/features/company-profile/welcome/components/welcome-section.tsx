import { GradientOverlay } from './ui';

export function WelcomeSection() {
    return (
        <div
            className="mx-auto w-full overflow-hidden rounded-[32px] dark:border dark:border-[var(--border-strong)]"
            style={{
                height: '570px',
                boxShadow: '0 4px 10px 0 rgba(0,0,0,0.25)',
            }}
        >
            <div
                className="relative h-full w-full"
                style={{
                    backgroundImage: "url('assets/landing-page/landingpage_bgtop.jpeg')",
                    backgroundSize: 'cover',
                    backgroundPosition: '60% center',
                    backgroundRepeat: 'no-repeat',
                }}
            >
                <GradientOverlay />

                <div className="relative z-10 flex h-full items-center px-16">
                    <div className="max-w-lg">
                        <h1 className="text-[70px] leading-[1.1] font-medium tracking-tight text-black dark:text-white">
                            Satu Untuk <br />
                            <span className="text-[80px] font-semibold tracking-[0.025em] whitespace-nowrap italic">Semua Masalah</span>
                        </h1>

                        <p className="mt-4 max-w-lg overflow-hidden text-[13px] leading-snug overflow-ellipsis whitespace-nowrap text-gray-800 dark:text-gray-200">
                            Kami hadir untuk senantiasa menemani perjalanan
                            <br />
                            bisnis anda
                        </p>

                        <button className="mt-6 rounded-full bg-[var(--secondary-600)] px-7 py-3.5 text-sm font-medium text-white transition-colors duration-200 hover:bg-[var(--secondary-700)]">
                            Jadwalkan Demo
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
