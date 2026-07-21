import { StepBusinessInfo, StepModeSelection, Stepper } from '@/features/onboarding/components';
import { useForm } from '@inertiajs/react';
import { useState } from 'react';

type Mode = 'lite' | 'advance';

export default function OnboardingPage() {
    const [step, setStep] = useState<1 | 2>(1);
    const [selectedMode, setSelectedMode] = useState<Mode | null>(null);

    const { data, setData, post, processing, errors } = useForm({
        type: '' as Mode | '',
        company_name: '',
        branch_name: '',
    });

    const selectMode = (mode: Mode) => {
        setSelectedMode(mode);
        setData('type', mode);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('onboarding.setup'));
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[var(--page-bg)] p-4 sm:p-8 dark:bg-[var(--background)]">
            <div className="w-full max-w-[560px] rounded-2xl border border-[var(--border-strong)] bg-[var(--neutral-white)] p-6 sm:p-10 dark:border-[var(--border-strong)] dark:bg-[var(--primary-900)]">
                <Stepper step={step} />

                {step === 1 ? (
                    <StepModeSelection selectedMode={selectedMode} onSelect={selectMode} onNext={() => setStep(2)} />
                ) : (
                    <StepBusinessInfo
                        companyName={data.company_name}
                        branchName={data.branch_name}
                        onCompanyNameChange={(v) => setData('company_name', v)}
                        onBranchNameChange={(v) => setData('branch_name', v)}
                        companyNameError={errors.company_name}
                        branchNameError={errors.branch_name}
                        processing={processing}
                        onBack={() => setStep(1)}
                        onSubmit={submit}
                    />
                )}
            </div>
        </div>
    );
}
