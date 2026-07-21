import { Head, Link, useForm } from '@inertiajs/react';
import { BarChart3, Cloud, LoaderCircle, ShieldCheck } from 'lucide-react';
import { FormEventHandler } from 'react';

import { Button, Checkbox, Input, InputError, Label } from '@/components';
import { useLanguage } from '@/hooks';
import { AuthSplitLayout } from '@/layouts';
import { SocialLoginButton } from '../components';

interface LoginForm {
    [key: string]: string | boolean;
    email: string;
    password: string;
    remember: boolean;
}

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const { t } = useLanguage();
    const { data, setData, post, processing, errors, reset } = useForm<LoginForm>({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    const loginFeatures = [
        {
            icon: <BarChart3 className="h-5 w-5 text-[var(--secondary-600)]" />,
            title: t('auth.login.features.manageTitle'),
            description: t('auth.login.features.manageDescription'),
        },
        {
            icon: <ShieldCheck className="h-5 w-5 text-[var(--secondary-600)]" />,
            title: t('auth.login.features.secureTitle'),
            description: t('auth.login.features.secureDescription'),
        },
        {
            icon: <Cloud className="h-5 w-5 text-[var(--secondary-600)]" />,
            title: t('auth.login.features.accessTitle'),
            description: t('auth.login.features.accessDescription'),
        },
    ];

    return (
        <AuthSplitLayout
            title={
                <>
                    {t('auth.login.welcomeTitle')} <span>👋</span>
                </>
            }
            description={t('auth.login.welcomeDescription')}
            illustrationImage="/images/login-illustration.png"
            features={loginFeatures}
        >
            <Head title={t('auth.login.headTitle')} />

            <form className="flex flex-col gap-5" onSubmit={submit}>
                <div className="grid gap-2">
                    <Label htmlFor="email" className="font-bold text-[var(--subheading)] dark:text-[var(--neutral-white)]">
                        {t('auth.login.form.emailLabel')}
                    </Label>
                    <Input
                        id="email"
                        type="email"
                        required
                        autoFocus
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        placeholder={t('auth.login.form.emailPlaceholder')}
                        className="h-12"
                    />
                    <InputError message={errors.email} />
                </div>

                <div className="mt-2 grid gap-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="password" className="font-bold text-[var(--subheading)] dark:text-[var(--neutral-white)]">
                            {t('auth.login.form.passwordLabel')}
                        </Label>
                        {canResetPassword && (
                            <Link href={route('password.request')} className="text-sm font-semibold text-[var(--secondary-600)] hover:underline">
                                {t('auth.login.form.forgotPassword')}
                            </Link>
                        )}
                    </div>
                    <Input
                        id="password"
                        type="password"
                        required
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        placeholder={t('auth.login.form.passwordPlaceholder')}
                        className="h-12"
                    />
                    <InputError message={errors.password} />
                </div>

                <div className="mt-1 flex items-center space-x-2">
                    <Checkbox id="remember" name="remember" />
                    <Label htmlFor="remember" className="font-normal text-[var(--grey-text)] dark:text-[var(--neutral-white)]">
                        {t('auth.login.form.rememberMe')}
                    </Label>
                </div>

                <Button
                    type="submit"
                    className="text-md mt-2 h-12 w-full bg-[var(--secondary-600)] hover:bg-[var(--secondary-700)]"
                    disabled={processing}
                >
                    {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                    {t('auth.login.form.submitButton')}
                </Button>

                <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-[var(--border-strong)]" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-[var(--card)] px-2 text-[var(--grey-text)] dark:text-[var(--neutral-white)]">
                            {t('auth.login.form.dividerText')}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <SocialLoginButton provider="google" icon={<img src="/icons/google.svg" alt="Google" className="h-5 w-5" />}>
                        Google
                    </SocialLoginButton>
                    <SocialLoginButton provider="facebook" icon={<img src="/icons/facebook.svg" alt="Facebook" className="h-5 w-5" />}>
                        Facebook
                    </SocialLoginButton>
                </div>

                <div className="mt-6 text-center text-sm text-[var(--grey-text)] dark:text-[var(--neutral-white)]">
                    {t('auth.login.form.noAccount')}{' '}
                    <Link href={route('register')} className="font-semibold text-[var(--secondary-600)] hover:underline">
                        {t('auth.login.form.registerLink')}
                    </Link>
                </div>
            </form>

            {status && <div className="mt-4 text-center text-sm font-medium text-[var(--success)]">{status}</div>}
        </AuthSplitLayout>
    );
}
