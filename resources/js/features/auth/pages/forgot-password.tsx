// Components
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import { Button, Input, InputError, Label, TextLink } from '@/components';
import { useLanguage } from '@/hooks';
import { AuthLayout } from '@/layouts';

export default function ForgotPassword({ status }: { status?: string }) {
    const { t } = useLanguage();
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <AuthLayout title={t('auth.forgotPassword.title')} description={t('auth.forgotPassword.description')}>
            <Head title={t('auth.forgotPassword.headTitle')} />

            {status && <div className="mb-4 text-center text-sm font-medium text-[var(--success)]">{status}</div>}

            <div className="space-y-6">
                <form onSubmit={submit}>
                    <div className="grid gap-2">
                        <Label htmlFor="email">{t('auth.forgotPassword.emailLabel')}</Label>
                        <Input
                            id="email"
                            type="email"
                            name="email"
                            autoComplete="off"
                            value={data.email}
                            autoFocus
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder={t('auth.forgotPassword.emailPlaceholder')}
                        />

                        <InputError message={errors.email} />
                    </div>

                    <div className="my-6 flex items-center justify-start">
                        <Button className="w-full" disabled={processing}>
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            {t('auth.forgotPassword.submitButton')}
                        </Button>
                    </div>
                </form>

                <div className="space-x-1 text-center text-sm text-[var(--grey-text)] dark:text-[var(--neutral-white)]">
                    <span>{t('auth.forgotPassword.returnPrefix')}</span>
                    <TextLink href={route('login')}>{t('auth.forgotPassword.loginLink')}</TextLink>
                </div>
            </div>
        </AuthLayout>
    );
}
