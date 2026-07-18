export function CtaSection() {
    return (
        <>
            <div
                className="mx-auto w-full max-w-6xl overflow-hidden rounded-[32px] shadow-[0_4px_10px_0_rgba(0,0,0,0.25)]"
                style={{ height: '570px' }}
            >
                <div
                    className="relative h-full w-full"
                    style={{
                        backgroundImage: "url('assets/landing-page/gambarbottom.jpeg')",
                        backgroundSize: 'cover',
                        backgroundPosition: '40% center',
                        backgroundRepeat: 'no-repeat',
                    }}
                >
                    <div className="absolute inset-0 bg-[linear-gradient(to_left,var(--background)_28%,var(--background)_50%,transparent_78%)]" />

                    <div className="relative z-10 flex h-full items-center justify-end px-16 lg:px-24">
                        <div className="max-w-[500px] text-center">
                            <img
                                src="assets/landing-page/logo.png"
                                alt="POSAVE"
                                className="mx-auto mb-5 h-[72px] scale-450 object-contain dark:brightness-0 dark:invert"
                            />

                            <h1 className="mx-auto max-w-[420px] text-[38px] leading-[1.1] font-medium tracking-[-0.055em] text-[var(--foreground)]">
                                Selalu Menjadi Jawaban Terbaik Anda
                            </h1>

                            <button className="mt-8 rounded-full bg-[var(--secondary-600)] px-12 py-3 text-[22px] font-medium text-white shadow-lg transition-all duration-300 hover:bg-[var(--secondary-700)]">
                                Coba Sekarang
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
