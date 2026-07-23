import { Button, Label, Textarea } from '@/components';
import { SettingsCard } from '@/features/advance/management/company-settings/components';
import { useLanguage } from '@/hooks';
import { DashboardSidebarLayout } from '@/layouts';
import { Head, useForm } from '@inertiajs/react';

interface ReceiptSetting {
    id?: number;
    notes?: string;
}

interface CompanyProfileData {
    name?: string;
    logo?: string;
    address?: string;
    province?: string;
    city?: string;
    zip?: string;
    phone?: string;
    email?: string;
}

interface Props {
    receipt: ReceiptSetting | null;
    profile: CompanyProfileData | null;
}

export default function ReceiptSettingsPage({ receipt, profile }: Props) {
    const { locale, t } = useLanguage();

    const { data, setData, post, processing, errors } = useForm({
        notes: receipt?.notes ?? '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('settings.receipt.update'));
    };

    const today = new Date().toLocaleDateString(locale === 'en' ? 'en-US' : 'id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    const logoPreview = profile?.logo ? `/storage/${profile.logo}` : null;

    return (
        <DashboardSidebarLayout title={t('dashboardAdvance.receipt.layoutTitle')} description={t('dashboardAdvance.receipt.layoutDescription')}>
            <Head title={t('dashboardAdvance.receipt.headTitle')} />

            <div className="min-h-screen bg-[var(--page-bg)] p-4 sm:p-6">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <form onSubmit={submit}>
                        <SettingsCard title={t('dashboardAdvance.receipt.cardTitle')}>
                            <p className="mb-5 text-sm text-[var(--grey-text)]">{t('dashboardAdvance.receipt.identityFromProfileHint')}</p>

                            <div className="mb-6">
                                <Label>{t('dashboardAdvance.receipt.notesLabel')}</Label>
                                <Textarea
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    placeholder={t('dashboardAdvance.receipt.notesPlaceholder')}
                                    rows={3}
                                />
                                {errors.notes && <p className="mt-1 text-xs text-[var(--danger)]">{errors.notes}</p>}
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
                                        {profile?.name || t('dashboardAdvance.receipt.previewCompanyPlaceholder')}
                                    </p>
                                    {profile?.address && (
                                        <p className="mt-0.5 text-xs text-[var(--grey-text)]">
                                            {[profile.address, profile.city, profile.province].filter(Boolean).join(', ')}
                                        </p>
                                    )}
                                    {(profile?.phone || profile?.email) && (
                                        <p className="mt-0.5 text-xs text-[var(--grey-text)]">
                                            {[profile?.phone, profile?.email].filter(Boolean).join(' | ')}
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
