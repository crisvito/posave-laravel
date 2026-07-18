import { Button, Input, Label } from '@/components';
import { useLanguage } from '@/hooks';
import { DashboardSidebarLayout } from '@/layouts';
import { Head, useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';

interface CompanyProfile {
    name?: string;
    logo?: string;
    address?: string;
    province?: string;
    city?: string;
    zip?: string;
    phone?: string;
    instagram?: string;
    facebook?: string;
    x?: string;
    youtube?: string;
    whatsapp?: string;
    website?: string;
}

interface Props {
    company: {
        id: number;
        type: string;
        profile: CompanyProfile | null;
    };
}

export default function CompanyProfilePage({ company }: Props) {
    const { t } = useLanguage();
    const profile = company.profile;

    const { data, setData, post, processing, errors } = useForm({
        name: profile?.name ?? '',
        phone: profile?.phone ?? '',
        address: profile?.address ?? '',
        province: profile?.province ?? '',
        city: profile?.city ?? '',
        zip: profile?.zip ?? '',
        instagram: profile?.instagram ?? '',
        facebook: profile?.facebook ?? '',
        x: profile?.x ?? '',
        youtube: profile?.youtube ?? '',
        whatsapp: profile?.whatsapp ?? '',
        website: profile?.website ?? '',
        logo: null as File | null,
    });

    const [logoPreview, setLogoPreview] = useState<string | null>(profile?.logo ? `/storage/${profile.logo}` : null);
    const logoRef = useRef<HTMLInputElement>(null);

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setData('logo', file);
        setLogoPreview(URL.createObjectURL(file));
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('settings.company-profile.update'), { forceFormData: true });
    };

    return (
        <DashboardSidebarLayout
            title={t('dashboardAdvance.companyProfile.layoutTitle')}
            description={t('dashboardAdvance.companyProfile.layoutDescription')}
        >
            <Head title={t('dashboardAdvance.companyProfile.headTitle')} />

            <div className="min-h-screen bg-[var(--page-bg)] p-4 sm:p-6">
                <form onSubmit={submit}>
                    <div className="space-y-5">
                        <div className="overflow-hidden rounded-2xl border border-[var(--border-strong)] bg-[var(--card)] shadow-sm">
                            <div className="border-b border-[var(--border-strong)] bg-[var(--surface-header)] px-4 py-3 sm:px-6 sm:py-4">
                                <h2 className="text-sm font-medium text-[var(--text-light)]">
                                    {t('dashboardAdvance.companyProfile.identitySection')}
                                </h2>
                            </div>

                            <div className="p-4 sm:p-6">
                                <div className="mb-6 flex flex-col items-start gap-4 border-b border-[var(--border-strong)] pb-6 sm:flex-row sm:items-center sm:gap-5">
                                    <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[var(--border-strong)] bg-[var(--page-bg)]">
                                        {logoPreview ? (
                                            <img
                                                src={logoPreview}
                                                alt={t('dashboardAdvance.companyProfile.logoAlt')}
                                                className="h-full w-full object-contain"
                                            />
                                        ) : (
                                            <span className="text-2xl" aria-hidden="true">
                                                🏢
                                            </span>
                                        )}
                                    </div>
                                    <div>
                                        <p className="mb-1 text-sm font-medium text-[var(--grey-text)]">
                                            {t('dashboardAdvance.companyProfile.logoLabel')}
                                        </p>
                                        <p className="mb-2 text-xs text-[var(--grey-text-muted)]">{t('dashboardAdvance.companyProfile.logoHint')}</p>
                                        <Button
                                            type="button"
                                            aria-label={t('dashboardAdvance.companyProfile.changeLogoAriaLabel')}
                                            onClick={() => logoRef.current?.click()}
                                            className="px-3 py-1.5 text-xs font-medium"
                                        >
                                            {t('dashboardAdvance.companyProfile.changeLogoButton')}
                                        </Button>
                                        <Input
                                            ref={logoRef}
                                            type="file"
                                            accept="image/*"
                                            aria-label={t('dashboardAdvance.companyProfile.uploadLogoAriaLabel')}
                                            className="hidden"
                                            onChange={handleLogoChange}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div className="md:col-span-2">
                                        <Label htmlFor="company-name">{t('dashboardAdvance.companyProfile.nameLabel')}</Label>
                                        <Input
                                            id="company-name"
                                            type="text"
                                            aria-label={t('dashboardAdvance.companyProfile.nameAriaLabel')}
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            placeholder={t('dashboardAdvance.companyProfile.namePlaceholder')}
                                        />
                                        {errors.name && <p className="mt-1 text-xs text-[var(--danger)]">{errors.name}</p>}
                                    </div>

                                    <div>
                                        <Label htmlFor="company-phone">{t('dashboardAdvance.companyProfile.phoneLabel')}</Label>
                                        <Input
                                            id="company-phone"
                                            type="text"
                                            aria-label={t('dashboardAdvance.companyProfile.phoneAriaLabel')}
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                            placeholder={t('dashboardAdvance.companyProfile.phonePlaceholder')}
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="company-website">{t('dashboardAdvance.companyProfile.websiteLabel')}</Label>
                                        <Input
                                            id="company-website"
                                            type="url"
                                            aria-label={t('dashboardAdvance.companyProfile.websiteAriaLabel')}
                                            value={data.website}
                                            onChange={(e) => setData('website', e.target.value)}
                                            placeholder={t('dashboardAdvance.companyProfile.websitePlaceholder')}
                                        />
                                        {errors.website && <p className="mt-1 text-xs text-[var(--danger)]">{errors.website}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-hidden rounded-2xl border border-[var(--border-strong)] bg-[var(--card)] shadow-sm">
                            <div className="border-b border-[var(--border-strong)] bg-[var(--surface-header)] px-4 py-3 sm:px-6 sm:py-4">
                                <h2 className="text-sm font-medium text-[var(--text-light)]">
                                    {t('dashboardAdvance.companyProfile.addressSection')}
                                </h2>
                            </div>

                            <div className="p-4 sm:p-6">
                                <div className="mb-4">
                                    <Label htmlFor="company-address">{t('dashboardAdvance.companyProfile.fullAddressLabel')}</Label>
                                    <Input
                                        id="company-address"
                                        type="text"
                                        aria-label={t('dashboardAdvance.companyProfile.fullAddressAriaLabel')}
                                        value={data.address}
                                        onChange={(e) => setData('address', e.target.value)}
                                        placeholder={t('dashboardAdvance.companyProfile.fullAddressPlaceholder')}
                                    />
                                </div>

                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                                    <div>
                                        <Label htmlFor="company-province">{t('dashboardAdvance.companyProfile.provinceLabel')}</Label>
                                        <Input
                                            id="company-province"
                                            type="text"
                                            aria-label={t('dashboardAdvance.companyProfile.provinceLabel')}
                                            value={data.province}
                                            onChange={(e) => setData('province', e.target.value)}
                                            placeholder={t('dashboardAdvance.companyProfile.provincePlaceholder')}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="company-city">{t('dashboardAdvance.companyProfile.cityLabel')}</Label>
                                        <Input
                                            id="company-city"
                                            type="text"
                                            aria-label={t('dashboardAdvance.companyProfile.cityLabel')}
                                            value={data.city}
                                            onChange={(e) => setData('city', e.target.value)}
                                            placeholder={t('dashboardAdvance.companyProfile.cityPlaceholder')}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="company-zip">{t('dashboardAdvance.companyProfile.zipLabel')}</Label>
                                        <Input
                                            id="company-zip"
                                            type="text"
                                            aria-label={t('dashboardAdvance.companyProfile.zipLabel')}
                                            value={data.zip}
                                            onChange={(e) => setData('zip', e.target.value)}
                                            placeholder={t('dashboardAdvance.companyProfile.zipPlaceholder')}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-hidden rounded-2xl border border-[var(--border-strong)] bg-[var(--card)] shadow-sm">
                            <div className="border-b border-[var(--border-strong)] bg-[var(--surface-header)] px-4 py-3 sm:px-6 sm:py-4">
                                <h2 className="text-sm font-medium text-[var(--text-light)]">{t('dashboardAdvance.companyProfile.socialSection')}</h2>
                            </div>

                            <div className="p-4 sm:p-6">
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div>
                                        <Label htmlFor="company-instagram">Instagram</Label>
                                        <div className="flex">
                                            <span className="flex items-center rounded-l-lg border border-r-0 border-[var(--border-strong)] bg-[var(--second-accent)] px-3 text-sm text-[var(--grey-text-muted)]">
                                                @
                                            </span>
                                            <Input
                                                id="company-instagram"
                                                type="text"
                                                aria-label={t('dashboardAdvance.companyProfile.instagramAriaLabel')}
                                                value={data.instagram}
                                                onChange={(e) => setData('instagram', e.target.value)}
                                                placeholder="posave.id"
                                                className="!w-full !rounded-l-none"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="company-facebook">Facebook</Label>
                                        <div className="flex">
                                            <span className="flex items-center rounded-l-lg border border-r-0 border-[var(--border-strong)] bg-[var(--second-accent)] px-3 text-sm text-[var(--grey-text-muted)]">
                                                fb/
                                            </span>
                                            <Input
                                                id="company-facebook"
                                                type="text"
                                                aria-label={t('dashboardAdvance.companyProfile.facebookAriaLabel')}
                                                value={data.facebook}
                                                onChange={(e) => setData('facebook', e.target.value)}
                                                placeholder="posave"
                                                className="w-full !rounded-l-none"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="company-x">X (Twitter)</Label>
                                        <div className="flex">
                                            <span className="flex items-center rounded-l-lg border border-r-0 border-[var(--border-strong)] bg-[var(--second-accent)] px-3 text-sm text-[var(--grey-text-muted)]">
                                                @
                                            </span>
                                            <Input
                                                id="company-x"
                                                type="text"
                                                aria-label={t('dashboardAdvance.companyProfile.xAriaLabel')}
                                                value={data.x}
                                                onChange={(e) => setData('x', e.target.value)}
                                                placeholder="posave"
                                                className="w-full !rounded-l-none"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="company-youtube">YouTube</Label>
                                        <div className="flex">
                                            <span className="flex items-center rounded-l-lg border border-r-0 border-[var(--border-strong)] bg-[var(--second-accent)] px-3 text-sm text-[var(--grey-text-muted)]">
                                                @
                                            </span>
                                            <Input
                                                id="company-youtube"
                                                type="text"
                                                aria-label={t('dashboardAdvance.companyProfile.youtubeAriaLabel')}
                                                value={data.youtube}
                                                onChange={(e) => setData('youtube', e.target.value)}
                                                placeholder="posave"
                                                className="w-full !rounded-l-none"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="company-whatsapp">{t('dashboardAdvance.companyProfile.whatsappLabel')}</Label>
                                        <Input
                                            id="company-whatsapp"
                                            type="text"
                                            aria-label={t('dashboardAdvance.companyProfile.whatsappAriaLabel')}
                                            value={data.whatsapp}
                                            onChange={(e) => setData('whatsapp', e.target.value)}
                                            placeholder={t('dashboardAdvance.companyProfile.phonePlaceholder')}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-start">
                            <Button type="submit" aria-label={t('dashboardAdvance.companyProfile.submitAriaLabel')} disabled={processing}>
                                {processing ? t('dashboardAdvance.companyProfile.submitting') : t('dashboardAdvance.companyProfile.submitLabel')}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </DashboardSidebarLayout>
    );
}
