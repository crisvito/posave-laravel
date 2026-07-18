import { Button, Input, Label, Textarea } from '@/components';
import { SettingsCard } from '@/features/advance/management/company-settings/components';
import { useLanguage } from '@/hooks';
import { DashboardSidebarLayout } from '@/layouts';
import { Head, useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';

interface ReceiptSetting {
    id?: number;
    logo?: string;
    address?: string;
    province?: string;
    city?: string;
    zip?: string;
    phone?: string;
    email?: string;
    notes?: string;
}

interface Props {
    receipt: ReceiptSetting | null;
    company_name: string;
}

export default function ReceiptSettingsPage({ receipt, company_name }: Props) {
    const { locale, t } = useLanguage();

    const { data, setData, post, processing, errors } = useForm({
        logo: null as File | null,
        address: receipt?.address ?? '',
        province: receipt?.province ?? '',
        city: receipt?.city ?? '',
        zip: receipt?.zip ?? '',
        phone: receipt?.phone ?? '',
        email: receipt?.email ?? '',
        notes: receipt?.notes ?? '',
    });

    const [logoPreview, setLogoPreview] = useState<string | null>(receipt?.logo ? `/storage/${receipt.logo}` : null);
    const logoRef = useRef<HTMLInputElement>(null);

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setData('logo', file);
        setLogoPreview(URL.createObjectURL(file));
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('settings.receipt.update'), { forceFormData: true });
    };

    const today = new Date().toLocaleDateString(locale === 'en' ? 'en-US' : 'id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    return (
        <DashboardSidebarLayout title={t('dashboardAdvance.receipt.layoutTitle')} description={t('dashboardAdvance.receipt.layoutDescription')}>
            <Head title={t('dashboardAdvance.receipt.headTitle')} />

            <div className="min-h-screen bg-[var(--page-bg)] p-4 sm:p-6">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <form onSubmit={submit}>
                        <SettingsCard title={t('dashboardAdvance.receipt.cardTitle')}>
                            <div className="mb-5 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
                                <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[var(--border-strong)] bg-[var(--page-bg)]">
                                    {logoPreview ? (
                                        <img src={logoPreview} alt={t('dashboardAdvance.receipt.logoAlt')} className="h-full w-full object-contain" />
                                    ) : (
                                        <span className="text-xs text-[var(--grey-text)]">{t('dashboardAdvance.receipt.logoPlaceholder')}</span>
                                    )}
                                </div>
                                <div>
                                    <Button type="button" onClick={() => logoRef.current?.click()} className="px-3 text-xs font-medium">
                                        {t('dashboardAdvance.receipt.uploadLogoButton')}
                                    </Button>
                                    <p className="mt-1 text-xs text-[var(--grey-text-muted)]">{t('dashboardAdvance.receipt.logoHint')}</p>
                                </div>
                                <Input
                                    aria-label={t('dashboardAdvance.receipt.uploadLogoAriaLabel')}
                                    ref={logoRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleLogoChange}
                                />
                            </div>

                            <div className="mb-4">
                                <Label>{t('dashboardAdvance.receipt.addressLabel')}</Label>
                                <Input
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                    placeholder={t('dashboardAdvance.receipt.addressPlaceholder')}
                                />
                            </div>

                            <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                                <div>
                                    <Label>{t('dashboardAdvance.receipt.provinceLabel')}</Label>
                                    <Input
                                        type="text"
                                        value={data.province}
                                        onChange={(e) => setData('province', e.target.value)}
                                        placeholder={t('dashboardAdvance.receipt.provincePlaceholder')}
                                    />
                                </div>
                                <div>
                                    <Label>{t('dashboardAdvance.receipt.cityLabel')}</Label>
                                    <Input
                                        type="text"
                                        value={data.city}
                                        onChange={(e) => setData('city', e.target.value)}
                                        placeholder={t('dashboardAdvance.receipt.cityPlaceholder')}
                                    />
                                </div>
                                <div>
                                    <Label>{t('dashboardAdvance.receipt.zipLabel')}</Label>
                                    <Input
                                        type="text"
                                        value={data.zip}
                                        onChange={(e) => setData('zip', e.target.value)}
                                        placeholder={t('dashboardAdvance.receipt.zipPlaceholder')}
                                    />
                                </div>
                            </div>

                            <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <div>
                                    <Label>{t('dashboardAdvance.receipt.phoneLabel')}</Label>
                                    <Input
                                        type="text"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        placeholder={t('dashboardAdvance.receipt.phonePlaceholder')}
                                    />
                                </div>
                                <div>
                                    <Label>{t('dashboardAdvance.receipt.emailLabel')}</Label>
                                    <Input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder={t('dashboardAdvance.receipt.emailPlaceholder')}
                                    />
                                </div>
                            </div>

                            <div className="mb-6">
                                <Label>{t('dashboardAdvance.receipt.notesLabel')}</Label>
                                <Textarea
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    placeholder={t('dashboardAdvance.receipt.notesPlaceholder')}
                                    rows={3}
                                />
                            </div>

                            <Button type="submit" disabled={processing} className="w-full">
                                {processing ? t('dashboardAdvance.receipt.submitting') : t('dashboardAdvance.receipt.submitLabel')}
                            </Button>
                        </SettingsCard>
                    </form>

                    <SettingsCard title={t('dashboardAdvance.receipt.previewCardTitle')} className="lg:self-start">
                        <div className="flex items-start justify-center">
                            <div className="w-full max-w-[280px] rounded-lg border border-[var(--border-strong)] bg-[var(--page-bg)] p-5 font-mono text-xs text-[var(--foreground)]">
                                {logoPreview && (
                                    <div className="mb-3 flex justify-center">
                                        <img src={logoPreview} alt={t('dashboardAdvance.receipt.logoAlt')} className="h-12 w-auto object-contain" />
                                    </div>
                                )}

                                <div className="mb-3 text-center">
                                    <p className="font-bold text-[var(--subheading)]">
                                        {company_name || t('dashboardAdvance.receipt.previewCompanyPlaceholder')}
                                    </p>
                                    {data.address && (
                                        <p className="mt-0.5 text-xs text-[var(--grey-text)]">
                                            {[data.address, data.city, data.province].filter(Boolean).join(', ')}
                                        </p>
                                    )}
                                    {(data.phone || data.email) && (
                                        <p className="mt-0.5 text-xs text-[var(--grey-text)]">
                                            {[data.phone, data.email].filter(Boolean).join(' | ')}
                                        </p>
                                    )}
                                </div>

                                <div className="my-2 border-t border-dashed border-[var(--border-strong)]" />

                                <div className="mb-2 space-y-1">
                                    <div className="flex justify-between">
                                        <span className="text-[var(--grey-text)]">{t('dashboardAdvance.receipt.previewDateLabel')}</span>
                                        <span>{today}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[var(--grey-text)]">{t('dashboardAdvance.receipt.previewInvoiceLabel')}</span>
                                        <span>INV-001</span>
                                    </div>
                                </div>

                                <div className="my-2 border-t border-dashed border-[var(--border-strong)]" />

                                <div className="mb-2">
                                    <div className="flex justify-between">
                                        <span>{t('dashboardAdvance.receipt.previewSampleProduct')}</span>
                                        <span>Rp 50.000</span>
                                    </div>
                                </div>

                                <div className="my-2 border-t border-dashed border-[var(--border-strong)]" />

                                <div className="space-y-1">
                                    <div className="flex justify-between">
                                        <span className="text-[var(--grey-text)]">{t('dashboardAdvance.receipt.previewSubtotalLabel')}</span>
                                        <span>Rp 50.000</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[var(--grey-text)]">{t('dashboardAdvance.receipt.previewTaxLabel')}</span>
                                        <span>Rp 2.500</span>
                                    </div>
                                    <div className="mt-1 flex justify-between font-bold">
                                        <span>{t('dashboardAdvance.receipt.previewTotalLabel')}</span>
                                        <span>Rp 52.500</span>
                                    </div>
                                </div>

                                {data.notes && (
                                    <>
                                        <div className="my-2 border-t border-dashed border-[var(--border-strong)]" />
                                        <p className="text-center text-xs text-[var(--grey-text)]">{data.notes}</p>
                                    </>
                                )}
                            </div>
                        </div>
                    </SettingsCard>
                </div>
            </div>
        </DashboardSidebarLayout>
    );
}
