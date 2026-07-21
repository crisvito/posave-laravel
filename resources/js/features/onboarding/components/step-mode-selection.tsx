import { useLanguage } from '@/hooks';
import { ModeCard } from './mode-card';

type Mode = 'lite' | 'advance';

interface StepModeSelectionProps {
    selectedMode: Mode | null;
    onSelect: (mode: Mode) => void;
    onNext: () => void;
}

export function StepModeSelection({ selectedMode, onSelect, onNext }: StepModeSelectionProps) {
    const { t } = useLanguage();

    return (
        <div>
            <h1 className="mb-1 text-xl font-medium text-[var(--primary-900)] dark:text-[var(--neutral-white)]">
                {t('onboarding.modeSelection.title')}
            </h1>
            <p className="mb-8 text-sm leading-relaxed text-[var(--grey-text)] dark:text-[var(--neutral-white)]">
                {t('onboarding.modeSelection.description')}
            </p>

            <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <ModeCard
                    icon="🏪"
                    badgeLabel={t('onboarding.modeSelection.lite.badge')}
                    badgeClassName="bg-[var(--success-background)] text-[var(--success)]"
                    iconBgClassName="bg-[var(--success-background)]"
                    title={t('onboarding.modeSelection.lite.title')}
                    description={t('onboarding.modeSelection.lite.description')}
                    selected={selectedMode === 'lite'}
                    onClick={() => onSelect('lite')}
                />
                <ModeCard
                    icon="🏢"
                    badgeLabel={t('onboarding.modeSelection.advance.badge')}
                    badgeClassName="bg-[var(--secondary-600)]/10 text-[var(--secondary-600)]"
                    iconBgClassName="bg-[var(--secondary-600)]/10"
                    title={t('onboarding.modeSelection.advance.title')}
                    description={t('onboarding.modeSelection.advance.description')}
                    selected={selectedMode === 'advance'}
                    onClick={() => onSelect('advance')}
                />
            </div>

            <button
                type="button"
                onClick={onNext}
                disabled={!selectedMode}
                className="w-full rounded-lg bg-[var(--primary-900)] py-2.5 text-sm font-medium text-white transition-all disabled:opacity-50"
            >
                {t('onboarding.modeSelection.nextButton')}
            </button>
        </div>
    );
}
