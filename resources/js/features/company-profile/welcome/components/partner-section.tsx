export function PartnerSection() {
    return (
        <>
            <div className="mx-auto max-w-6xl px-8 md:px-16">
                <div className="mb-12 text-center">
                    <h2 className="text-[42px] leading-none font-black tracking-tight text-[var(--primary-900)] dark:text-[var(--text-light)]">
                        Our Partners
                    </h2>

                    <p className="mt-4 text-[22px] font-medium text-[var(--grey-text)] dark:text-[var(--grey-text-muted)]">
                        We proudly present our partners, #UMKMJaya
                    </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-16 lg:gap-28">
                    <div className="corner-lg flex items-center justify-center">
                        <img
                            src="assets/landing-page/serona.png"
                            alt="Serona"
                            className="h-[140px] rounded-[36px] object-cover shadow-lg dark:brightness-90"
                        />
                    </div>

                    <div className="flex items-center justify-center">
                        <img src="assets/landing-page/viktorifit.png" alt="Viktorifit" className="h-[140px] object-contain" />
                    </div>

                    <div className="flex items-center justify-center">
                        <img src="assets/landing-page/studysphere.png" alt="Studysphere" className="h-[150px] object-contain" />
                    </div>
                </div>
            </div>
        </>
    );
}
