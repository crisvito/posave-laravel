import { Button } from '@/components';
import { useLanguage } from '@/hooks';
import type { FormEventHandler } from 'react';

interface StepBusinessInfoProps {
    companyName: string;
    branchName: string;
    onCompanyNameChange: (value: string) => void;
    onBranchNameChange: (value: string) => void;
    companyNameError?: string;
    branchNameError?: string;
    processing: boolean;
    onBack: () => void;
    onSubmit: FormEventHandler<HTMLFormElement>;
}

export function StepBusinessInfo({
    companyName,
    branchName,
    onCompanyNameChange,
    onBranchNameChange,
    companyNameError,
    branchNameError,
    processing,
    onBack,
    onSubmit,
}: StepBusinessInfoProps) {
    const { t } = useLanguage();

    return (
        <form onSubmit={onSubmit}>
            <h1 className="mb-1 text-xl font-medium text-[var(--primary-900)] dark:text-[var(--neutral-white)]">
                {t('onboarding.businessInfo.title')}
            </h1>
            <p className="mb-8 text-sm leading-relaxed text-[var(--grey-text)] dark:text-[var(--neutral-white)]">
                {t('onboarding.businessInfo.description')}
            </p>

            <div className="mb-5">
                <label className="mb-1.5 block text-sm font-medium text-[var(--primary-700)] dark:text-[var(--neutral-white)]">
                    {t('onboarding.businessInfo.companyNameLabel')}
                </label>
                <input
                    type="text"
                    value={companyName}
                    onChange={(e) => onCompanyNameChange(e.target.value)}
                    placeholder={t('onboarding.businessInfo.companyNamePlaceholder')}
                    className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-[var(--primary-900)] transition-all outline-none focus:ring-2 dark:bg-[var(--card)] dark:text-[var(--neutral-white)] ${
                        companyNameError ? 'border-[var(--danger)]' : 'border-[var(--border-strong)] dark:border-[var(--border-strong)]'
                    }`}
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                />
                {companyNameError && <p className="mt-1 text-xs text-[var(--danger)]">{companyNameError}</p>}
                <p className="mt-1 text-xs text-[var(--grey-text-muted)] dark:text-[var(--muted-foreground)]">
                    {t('onboarding.businessInfo.companyNameHint')}
                </p>
            </div>

            <div className="mb-5">
                <label className="mb-1.5 block text-sm font-medium text-[var(--primary-700)] dark:text-[var(--neutral-white)]">
                    {t('onboarding.businessInfo.branchNameLabel')}
                </label>
                <input
                    type="text"
                    value={branchName}
                    onChange={(e) => onBranchNameChange(e.target.value)}
                    placeholder={t('onboarding.businessInfo.branchNamePlaceholder')}
                    className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-[var(--primary-900)] transition-all outline-none focus:ring-2 dark:bg-[var(--card)] dark:text-[var(--neutral-white)] ${
                        branchNameError ? 'border-[var(--danger)]' : 'border-[var(--border-strong)] dark:border-[var(--border-strong)]'
                    }`}
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                />
                {branchNameError && <p className="mt-1 text-xs text-[var(--danger)]">{branchNameError}</p>}
                <p className="mt-1 text-xs text-[var(--grey-text-muted)] dark:text-[var(--muted-foreground)]">
                    {t('onboarding.businessInfo.branchNameHint')}
                </p>
            </div>

            <div className="mt-8 flex gap-2.5">
                <Button
                    variant="outline"
                    type="button"
                    onClick={onBack}
                    className="shrink-0 rounded-lg border border-[var(--border-strong)] bg-transparent px-5 py-2.5 text-sm font-medium text-[var(--primary-600)] transition-all dark:border-[var(--border-strong)] dark:text-[var(--neutral-white)]"
                >
                    {t('onboarding.businessInfo.backButton')}
                </Button>
                <Button
                    type="submit"
                    disabled={processing || !companyName.trim() || !branchName.trim()}
                    className="flex-1 rounded-lg bg-[var(--primary-900)] py-2.5 text-sm font-medium text-white transition-all disabled:opacity-50"
                >
                    {processing ? t('onboarding.businessInfo.submittingButton') : t('onboarding.businessInfo.submitButton')}
                </Button>
            </div>
        </form>
    );
}
