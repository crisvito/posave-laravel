import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import { Button, Input, InputError, Label } from '@/components';
import { useLanguage } from '@/hooks';
import { AuthLayout } from '@/layouts';

export default function ConfirmPassword() {
    const { t } = useLanguage();
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('password.confirm'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <AuthLayout title={t('auth.confirmPassword.title')} description={t('auth.confirmPassword.description')}>
            <Head title={t('auth.confirmPassword.headTitle')} />

            <form onSubmit={submit}>
                <div className="space-y-6">
                    <div className="grid gap-2">
                        <Label htmlFor="password">{t('auth.confirmPassword.passwordLabel')}</Label>
                        <Input
                            id="password"
                            type="password"
                            name="password"
                            placeholder={t('auth.confirmPassword.passwordPlaceholder')}
                            autoComplete="current-password"
                            value={data.password}
                            autoFocus
                            onChange={(e) => setData('password', e.target.value)}
                        />

                        <InputError message={errors.password} />
                    </div>

                    <div className="flex items-center">
                        <Button className="w-full" disabled={processing}>
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            {t('auth.confirmPassword.submitButton')}
                        </Button>
                    </div>
                </div>
            </form>
        </AuthLayout>
    );
}
