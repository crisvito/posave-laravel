interface StepperProps {
    step: 1 | 2;
}

export function Stepper({ step }: StepperProps) {
    const step2Active = step === 2;
    const step1Label =
        step === 1 ? 'text-[var(--primary-900)] dark:text-[var(--neutral-white)]' : 'text-[var(--primary-600)] dark:text-[var(--muted-foreground)]';
    const step2Label = step2Active
        ? 'text-[var(--primary-900)] dark:text-[var(--neutral-white)]'
        : 'text-[var(--grey-text-muted)] dark:text-[var(--muted-foreground)]';

    return (
        <>
            <div className="mb-10 flex items-center">
                <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[var(--primary-900)] text-sm font-medium text-white dark:bg-[var(--neutral-white)] dark:text-[var(--primary-900)]">
                        {step > 1 ? (
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <path
                                    d="M2 7l4 4 6-6"
                                    className="stroke-white dark:stroke-[var(--primary-900)]"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        ) : (
                            '1'
                        )}
                    </div>
                    <span className={`hidden text-sm font-medium sm:inline ${step1Label}`}>Pilih mode</span>
                </div>

                <div
                    className={`mx-3 h-px flex-1 transition-all duration-300 ${
                        step > 1
                            ? 'bg-[var(--primary-900)] dark:bg-[var(--neutral-white)]'
                            : 'bg-[var(--border-strong)] dark:bg-[var(--border-strong)]'
                    }`}
                />

                <div className="flex items-center gap-2">
                    <div
                        className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm font-medium transition-all ${
                            step2Active
                                ? 'bg-[var(--primary-900)] text-white dark:bg-[var(--neutral-white)] dark:text-[var(--primary-900)]'
                                : 'bg-[var(--second-accent)] text-[var(--primary-600)] dark:bg-[var(--border-strong)] dark:text-[var(--neutral-white)]'
                        }`}
                    >
                        2
                    </div>
                    <span className={`hidden text-sm font-medium sm:inline ${step2Label}`}>Informasi bisnis</span>
                </div>
            </div>

            <p className="-mt-8 mb-6 text-center text-xs font-medium text-[var(--primary-600)] sm:hidden dark:text-[var(--muted-foreground)]">
                Langkah {step} dari 2: {step === 1 ? 'Pilih mode' : 'Informasi bisnis'}
            </p>
        </>
    );
}
