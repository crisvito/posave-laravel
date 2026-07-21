interface ModeCardProps {
    icon: string;
    badgeLabel: string;
    badgeClassName: string;
    iconBgClassName: string;
    title: string;
    description: string;
    selected: boolean;
    onClick: () => void;
}

export function ModeCard({ icon, badgeLabel, badgeClassName, iconBgClassName, title, description, selected, onClick }: ModeCardProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`relative rounded-xl border-2 p-5 text-left transition-all ${
                selected
                    ? 'border-[var(--primary-900)] bg-[var(--second-accent)] dark:border-[var(--neutral-white)] dark:bg-[var(--border-strong)]'
                    : 'border-[var(--border-strong)] bg-[var(--neutral-white)] dark:border-[var(--border-strong)] dark:bg-[var(--card)]'
            }`}
        >
            {selected && (
                <div className="absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--primary-900)] dark:bg-[var(--neutral-white)]">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path
                            d="M1.5 5l2.5 2.5 4.5-4.5"
                            className="stroke-white dark:stroke-[var(--primary-900)]"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>
            )}
            <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl text-xl ${iconBgClassName}`}>{icon}</div>
            <span className={`mb-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${badgeClassName}`}>{badgeLabel}</span>
            <p className="mb-1 text-sm font-medium text-[var(--primary-900)] dark:text-[var(--neutral-white)]">{title}</p>
            <p className="text-xs leading-relaxed text-[var(--grey-text)] dark:text-[var(--neutral-white)]">{description}</p>
        </button>
    );
}
