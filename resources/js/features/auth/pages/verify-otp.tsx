import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, useRef, useState } from 'react';

import { useLanguage } from '@/hooks';

interface Props {
    email: string;
    status?: string;
}

export default function VerifyOtp({ email, status }: Props) {
    const { t } = useLanguage();
    const [codes, setCodes] = useState(['', '', '', '', '', '']);
    const inputs = useRef<(HTMLInputElement | null)[]>([]);

    const { data, setData, post, processing, errors } = useForm({ code: '' });
    const { post: resendPost, processing: resendProcessing } = useForm({});

    const handleChange = (index: number, value: string) => {
        if (!/^\d?$/.test(value)) return;

        const newCodes = [...codes];
        newCodes[index] = value;
        setCodes(newCodes);
        setData('code', newCodes.join(''));

        if (value && index < 5) {
            inputs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !codes[index] && index > 0) {
            inputs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        const newCodes = pasted.split('').concat(Array(6).fill('')).slice(0, 6);
        setCodes(newCodes);
        setData('code', newCodes.join(''));
        inputs.current[Math.min(pasted.length, 5)]?.focus();
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('otp.verify'));
    };

    const handleResend = () => {
        resendPost(route('otp.resend'));
    };

    return (
        <>
            <Head title={t('auth.verifyOtp.headTitle')} />

            <div className="flex min-h-screen items-center justify-center bg-[var(--page-bg)] dark:bg-[var(--background)]">
                <div className="w-full max-w-md rounded-2xl bg-[var(--neutral-white)] p-8 shadow-lg dark:bg-[var(--card)]">
                    <div className="mb-6 text-center">
                        <h1 className="text-2xl font-bold text-[var(--subheading)] dark:text-[var(--neutral-white)]">{t('auth.verifyOtp.title')}</h1>
                        <p className="mt-2 text-sm text-[var(--grey-text)] dark:text-[var(--neutral-white)]">{t('auth.verifyOtp.sentPrefix')}</p>
                        <p className="font-medium text-[var(--subheading)] dark:text-[var(--neutral-white)]">{email}</p>
                    </div>

                    {status && (
                        <div className="mb-4 rounded-lg bg-[var(--success-background)] p-3 text-center text-sm text-[var(--success)]">{status}</div>
                    )}

                    {errors.code && (
                        <div className="mb-4 rounded-lg bg-[var(--danger-background)] p-3 text-center text-sm text-[var(--danger)]">
                            {errors.code}
                        </div>
                    )}

                    <form onSubmit={submit}>
                        <div className="mb-6 flex justify-center gap-3">
                            {codes.map((digit, i) => (
                                <input
                                    key={i}
                                    ref={(el) => {
                                        inputs.current[i] = el;
                                    }}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleChange(i, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(i, e)}
                                    onPaste={handlePaste}
                                    aria-label={`${t('auth.verifyOtp.digitAriaPrefix')} ${i + 1}`}
                                    className="h-12 w-12 rounded-lg border border-[var(--border-strong)] bg-transparent text-center text-xl font-bold text-[var(--subheading)] outline-none focus:border-[var(--secondary-600)] focus:ring-2 focus:ring-[var(--secondary-600)]/20 dark:text-[var(--neutral-white)]"
                                />
                            ))}
                        </div>

                        <button
                            type="submit"
                            disabled={processing || data.code.length < 6}
                            className="w-full rounded-lg bg-[var(--secondary-600)] py-3 font-medium text-white transition hover:bg-[var(--secondary-700)] disabled:opacity-50"
                        >
                            {processing ? t('auth.verifyOtp.submittingButton') : t('auth.verifyOtp.submitButton')}
                        </button>
                    </form>

                    <div className="mt-4 text-center">
                        <span className="text-sm text-[var(--grey-text)] dark:text-[var(--neutral-white)]">{t('auth.verifyOtp.noCodeText')} </span>
                        <button
                            onClick={handleResend}
                            disabled={resendProcessing}
                            className="text-sm font-medium text-[var(--secondary-600)] hover:underline disabled:opacity-50"
                        >
                            {t('auth.verifyOtp.resendButton')}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
