import { Input, InputError } from '@/components';
import { Button } from '@/components/ui';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/hooks';
import { useForm } from '@inertiajs/react';
import { Lock, Send } from 'lucide-react';
import { FormEventHandler } from 'react';

export function ContactForm() {
    const { t } = useLanguage();
    const { data, setData, post, processing, errors, reset } = useForm({
        first_name: '',
        last_name: '',
        email: '',
        message: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/contact-us', {
            onSuccess: () => reset(),
        });
    };

    return (
        <div className="rounded-2xl border border-[var(--border-strong)] bg-[var(--card)] p-8 shadow-sm">
            <h3 className="mb-6 text-2xl font-bold text-[var(--foreground)]">{t('companyProfile.inquiry.form.title')}</h3>

            <form onSubmit={submit} className="flex flex-col gap-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-[var(--muted-foreground)]">
                            {t('companyProfile.inquiry.form.firstName')}
                        </label>
                        <Input
                            value={data.first_name}
                            onChange={(e) => setData('first_name', e.target.value)}
                            placeholder={t('companyProfile.inquiry.form.firstNamePlaceholder')}
                            className="bg-[var(--background)] text-[var(--foreground)] placeholder:text-[var(--grey-text-muted)]"
                        />
                        <InputError message={errors.first_name} className="mt-2" />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium text-[var(--muted-foreground)]">
                            {t('companyProfile.inquiry.form.lastName')}
                        </label>
                        <Input
                            value={data.last_name}
                            onChange={(e) => setData('last_name', e.target.value)}
                            placeholder={t('companyProfile.inquiry.form.lastNamePlaceholder')}
                            className="bg-[var(--background)] text-[var(--foreground)] placeholder:text-[var(--grey-text-muted)]"
                        />
                        <InputError message={errors.last_name} className="mt-2" />
                    </div>
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-[var(--muted-foreground)]">{t('companyProfile.inquiry.form.email')}</label>
                    <Input
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        placeholder={t('companyProfile.inquiry.form.emailPlaceholder')}
                        className="bg-[var(--background)] text-[var(--foreground)] placeholder:text-[var(--grey-text-muted)]"
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-[var(--muted-foreground)]">
                        {t('companyProfile.inquiry.form.description')}
                    </label>
                    <Textarea
                        value={data.message}
                        onChange={(e) => setData('message', e.target.value)}
                        placeholder={t('companyProfile.inquiry.form.descriptionPlaceholder')}
                        className="bg-[var(--background)] text-[var(--foreground)] placeholder:text-[var(--grey-text-muted)]"
                    />
                    <InputError message={errors.message} className="mt-2" />
                </div>

                <Button
                    type="submit"
                    disabled={processing}
                    className="text-md h-12 w-full bg-[var(--secondary-600)] text-white hover:bg-[var(--secondary-700)]"
                >
                    {t('companyProfile.inquiry.form.submitButton')} <Send className="ml-2 h-4 w-4" />
                </Button>

                <div className="flex items-center justify-center gap-2 text-center text-xs text-[var(--grey-text-muted)]">
                    <Lock className="h-3 w-3" />
                    <p>{t('companyProfile.inquiry.form.privacyNote')}</p>
                </div>
            </form>
        </div>
    );
}
