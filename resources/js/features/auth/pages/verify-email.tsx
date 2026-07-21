import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import { Button, TextLink } from '@/components';
import { useLanguage } from '@/hooks';
import { AuthLayout } from '@/layouts';

export default function VerifyEmail({ status }: { status?: string }) {
    const { t } = useLanguage();
    const { post, processing } = useForm({});

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    return (
        <AuthLayout title={t('auth.verifyEmail.title')} description={t('auth.verifyEmail.description')}>
            <Head title={t('auth.verifyEmail.headTitle')} />

            {status === 'verification-link-sent' && (
                <div className="mb-4 text-center text-sm font-medium text-[var(--success)]">{t('auth.verifyEmail.linkSentStatus')}</div>
            )}

            <form onSubmit={submit} className="space-y-6 text-center">
                <Button disabled={processing} variant="secondary">
                    {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                    {t('auth.verifyEmail.resendButton')}
                </Button>

                <TextLink href={route('logout')} method="post" className="mx-auto block text-sm">
                    {t('auth.verifyEmail.logoutLink')}
                </TextLink>
            </form>
        </AuthLayout>
    );
}
