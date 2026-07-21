import { Head, Link, useForm } from '@inertiajs/react';
import { Clock, Eye, LoaderCircle, Lock, Mail, Phone, PieChart, User, UserPlus } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

import { Button, Checkbox, Input, InputError, Label } from '@/components';
import { useLanguage } from '@/hooks';
import { AuthSplitLayout } from '@/layouts';

interface RegisterForm {
    [key: string]: string | boolean;
    name: string;
    email: string;
    phone: string;
    password: string;
    password_confirmation: string;
    terms: boolean;
}

export default function Register() {
    const { t } = useLanguage();
    const { data, setData, post, processing, errors, reset } = useForm<RegisterForm>({
        name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
        terms: false,
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    const registerFeatures = [
        {
            icon: <UserPlus className="h-5 w-5 text-[var(--secondary-600)]" />,
            title: t('auth.register.features.freeTitle'),
            description: t('auth.register.features.freeDescription'),
        },
        {
            icon: <Clock className="h-5 w-5 text-[var(--secondary-600)]" />,
            title: t('auth.register.features.timeTitle'),
            description: t('auth.register.features.timeDescription'),
        },
        {
            icon: <PieChart className="h-5 w-5 text-[var(--secondary-600)]" />,
            title: t('auth.register.features.insightTitle'),
            description: t('auth.register.features.insightDescription'),
        },
    ];

    return (
        <AuthSplitLayout
            title={t('auth.register.title')}
            description={t('auth.register.description')}
            illustrationImage="/images/register-illustration.png"
            features={registerFeatures}
        >
            <Head title={t('auth.register.headTitle')} />

            <form className="flex flex-col gap-5" onSubmit={submit}>
                <div className="grid gap-1.5">
                    <Label htmlFor="name" className="font-bold text-[var(--subheading)] dark:text-[var(--neutral-white)]">
                        {t('auth.register.form.nameLabel')}
                    </Label>
                    <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <User className="h-5 w-5 text-[var(--grey-text-muted)]" />
                        </div>
                        <Input
                            id="name"
                            type="text"
                            required
                            autoFocus
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder={t('auth.register.form.namePlaceholder')}
                            className="h-12 pl-10"
                        />
                    </div>
                    <InputError message={errors.name} />
                </div>

                <div className="grid gap-1.5">
                    <Label htmlFor="email" className="font-bold text-[var(--subheading)] dark:text-[var(--neutral-white)]">
                        {t('auth.register.form.emailLabel')}
                    </Label>
                    <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <Mail className="h-5 w-5 text-[var(--grey-text-muted)]" />
                        </div>
                        <Input
                            id="email"
                            type="email"
                            required
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder={t('auth.register.form.emailPlaceholder')}
                            className="h-12 pl-10"
                        />
                    </div>
                    <InputError message={errors.email} />
                </div>

                <div className="grid gap-1.5">
                    <Label htmlFor="phone" className="font-bold text-[var(--subheading)] dark:text-[var(--neutral-white)]">
                        {t('auth.register.form.phoneLabel')}
                    </Label>
                    <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <Phone className="h-5 w-5 text-[var(--grey-text-muted)]" />
                        </div>
                        <Input
                            id="phone"
                            type="tel"
                            required
                            value={data.phone}
                            onChange={(e) => setData('phone', e.target.value)}
                            placeholder={t('auth.register.form.phonePlaceholder')}
                            className="h-12 pl-10"
                        />
                    </div>
                    <InputError message={errors.phone} />
                </div>

                <div className="grid gap-1.5">
                    <Label htmlFor="password" className="font-bold text-[var(--subheading)] dark:text-[var(--neutral-white)]">
                        {t('auth.register.form.passwordLabel')}
                    </Label>
                    <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <Lock className="h-5 w-5 text-[var(--grey-text-muted)]" />
                        </div>
                        <Input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            required
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder={t('auth.register.form.passwordPlaceholder')}
                            className="h-12 pr-10 pl-10"
                        />
                        <button
                            aria-label={showPassword ? t('auth.register.form.hidePasswordAria') : t('auth.register.form.showPasswordAria')}
                            type="button"
                            className="absolute inset-y-0 right-0 flex items-center pr-3"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            <Eye className="h-5 w-5 text-[var(--grey-text-muted)] hover:text-[var(--subheading)] dark:hover:text-[var(--neutral-white)]" />
                        </button>
                    </div>
                    <InputError message={errors.password} />
                </div>

                <div className="grid gap-1.5">
                    <Label htmlFor="password_confirmation" className="font-bold text-[var(--subheading)] dark:text-[var(--neutral-white)]">
                        {t('auth.register.form.confirmPasswordLabel')}
                    </Label>
                    <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <Lock className="h-5 w-5 text-[var(--grey-text-muted)]" />
                        </div>
                        <Input
                            id="password_confirmation"
                            type={showConfirmPassword ? 'text' : 'password'}
                            required
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            placeholder={t('auth.register.form.confirmPasswordPlaceholder')}
                            className="h-12 pr-10 pl-10"
                        />
                        <button
                            aria-label={showConfirmPassword ? t('auth.register.form.hidePasswordAria') : t('auth.register.form.showPasswordAria')}
                            type="button"
                            className="absolute inset-y-0 right-0 flex items-center pr-3"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            <Eye className="h-5 w-5 text-[var(--grey-text-muted)] hover:text-[var(--subheading)] dark:hover:text-[var(--neutral-white)]" />
                        </button>
                    </div>
                    <InputError message={errors.password_confirmation} />
                </div>

                <div className="mt-2 flex items-start space-x-2">
                    <Checkbox
                        id="terms"
                        name="terms"
                        checked={data.terms}
                        onChange={(e) => setData('terms', (e.target as HTMLInputElement).checked)}
                        className="mt-1"
                    />
                    <Label htmlFor="terms" className="text-sm leading-relaxed font-normal text-[var(--grey-text)] dark:text-[var(--neutral-white)]">
                        {t('auth.register.form.termsPrefix')}{' '}
                        <Link href="#" className="font-semibold text-[var(--secondary-600)] hover:underline">
                            {t('auth.register.form.termsOfService')}
                        </Link>{' '}
                        {t('auth.register.form.termsAnd')}{' '}
                        <Link href="#" className="font-semibold text-[var(--secondary-600)] hover:underline">
                            {t('auth.register.form.privacyPolicy')}
                        </Link>
                    </Label>
                </div>

                <Button
                    type="submit"
                    className="text-md mt-2 h-12 w-full bg-[var(--secondary-600)] hover:bg-[var(--secondary-700)]"
                    disabled={processing}
                >
                    {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                    {t('auth.register.form.submitButton')}
                </Button>

                <div className="mt-4 text-center text-sm text-[var(--grey-text)] dark:text-[var(--neutral-white)]">
                    {t('auth.register.form.haveAccount')}{' '}
                    <Link href={route('login')} className="font-semibold text-[var(--secondary-600)] hover:underline">
                        {t('auth.register.form.loginLink')}
                    </Link>
                </div>
            </form>
        </AuthSplitLayout>
    );
}
