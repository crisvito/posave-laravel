import { Button, Input, Label } from '@/components';
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
        <DashboardSidebarLayout title="Profil Perusahaan" description="Kelola informasi dan identitas perusahaan kamu">
            <Head title="Profil Perusahaan" />

            <div className="min-h-screen bg-[var(--page-bg)] p-4 sm:p-6 dark:bg-[var(--background)]">
                <form onSubmit={submit}>
                    <div className="space-y-5">
                        <div className="overflow-hidden rounded-2xl border border-[var(--border-strong)] bg-[var(--neutral-white)] shadow-sm dark:border-[var(--border-strong)] dark:bg-[var(--card)]">
                            <div className="border-b border-[var(--border-strong)] bg-[var(--surface-header)] px-4 py-3 sm:px-6 sm:py-4 dark:border-[var(--border-strong)]">
                                <h2 className="text-sm font-medium text-[var(--text-light)] dark:text-white">Identitas Perusahaan</h2>
                            </div>

                            <div className="p-4 sm:p-6">
                                <div className="mb-6 flex flex-col items-start gap-4 border-b border-[var(--border-strong)] pb-6 sm:flex-row sm:items-center sm:gap-5 dark:border-[var(--border-strong)]">
                                    <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[var(--border-strong)] bg-[var(--page-bg)] dark:border-[var(--border-strong)] dark:bg-[#111827]">
                                        {logoPreview ? (
                                            <img src={logoPreview} alt="Logo perusahaan" className="h-full w-full object-contain" />
                                        ) : (
                                            <span className="text-2xl" aria-hidden="true">
                                                🏢
                                            </span>
                                        )}
                                    </div>
                                    <div>
                                        <p className="mb-1 text-sm font-medium text-[var(--grey-text)] dark:text-white">Logo Perusahaan</p>
                                        <p className="mb-2 text-xs text-[var(--grey-text-muted)] dark:text-[var(--muted-foreground)]">
                                            JPG, PNG, atau WEBP. Maksimal 2MB.
                                        </p>
                                        <Button
                                            type="button"
                                            aria-label="Ganti logo perusahaan"
                                            onClick={() => logoRef.current?.click()}
                                            className="px-3 py-1.5 text-xs font-medium"
                                        >
                                            Ganti Logo
                                        </Button>
                                        <Input
                                            ref={logoRef}
                                            type="file"
                                            accept="image/*"
                                            aria-label="Upload logo perusahaan"
                                            className="hidden"
                                            onChange={handleLogoChange}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div className="md:col-span-2">
                                        <Label htmlFor="company-name">Nama Perusahaan</Label>
                                        <Input
                                            id="company-name"
                                            type="text"
                                            aria-label="Nama perusahaan"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            placeholder="PT. Maju Bersama"
                                        />
                                        {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                                    </div>

                                    <div>
                                        <Label htmlFor="company-phone">Nomor Telepon</Label>
                                        <Input
                                            id="company-phone"
                                            type="text"
                                            aria-label="Nomor telepon perusahaan"
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                            placeholder="+62 812 3456 7890"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="company-website">Website</Label>
                                        <Input
                                            id="company-website"
                                            type="url"
                                            aria-label="Website perusahaan"
                                            value={data.website}
                                            onChange={(e) => setData('website', e.target.value)}
                                            placeholder="https://posave.id"
                                        />
                                        {errors.website && <p className="mt-1 text-xs text-red-500">{errors.website}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-hidden rounded-2xl border border-[var(--border-strong)] bg-[var(--neutral-white)] shadow-sm dark:border-[var(--border-strong)] dark:bg-[var(--card)]">
                            <div className="border-b border-[var(--border-strong)] bg-[var(--surface-header)] px-4 py-3 sm:px-6 sm:py-4 dark:border-[var(--border-strong)]">
                                <h2 className="text-sm font-medium text-[var(--text-light)] dark:text-white">Alamat</h2>
                            </div>

                            <div className="p-4 sm:p-6">
                                <div className="mb-4">
                                    <Label htmlFor="company-address">Alamat Lengkap</Label>
                                    <Input
                                        id="company-address"
                                        type="text"
                                        aria-label="Alamat lengkap perusahaan"
                                        value={data.address}
                                        onChange={(e) => setData('address', e.target.value)}
                                        placeholder="Jl. Sudirman No. 1"
                                    />
                                </div>

                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                                    <div>
                                        <Label htmlFor="company-province">Provinsi</Label>
                                        <Input
                                            id="company-province"
                                            type="text"
                                            aria-label="Provinsi"
                                            value={data.province}
                                            onChange={(e) => setData('province', e.target.value)}
                                            placeholder="DKI Jakarta"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="company-city">Kota</Label>
                                        <Input
                                            id="company-city"
                                            type="text"
                                            aria-label="Kota"
                                            value={data.city}
                                            onChange={(e) => setData('city', e.target.value)}
                                            placeholder="Jakarta Pusat"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="company-zip">Kode Pos</Label>
                                        <Input
                                            id="company-zip"
                                            type="text"
                                            aria-label="Kode pos"
                                            value={data.zip}
                                            onChange={(e) => setData('zip', e.target.value)}
                                            placeholder="10110"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-hidden rounded-2xl border border-[var(--border-strong)] bg-[var(--neutral-white)] shadow-sm dark:border-[var(--border-strong)] dark:bg-[var(--card)]">
                            <div className="border-b border-[var(--border-strong)] bg-[var(--surface-header)] px-4 py-3 sm:px-6 sm:py-4 dark:border-[var(--border-strong)]">
                                <h2 className="text-sm font-medium text-[var(--text-light)] dark:text-white">Media Sosial</h2>
                            </div>

                            <div className="p-4 sm:p-6">
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div>
                                        <Label htmlFor="company-instagram">Instagram</Label>
                                        <div className="flex">
                                            <span className="flex items-center rounded-l-lg border border-r-0 border-[var(--border-strong)] bg-[var(--second-accent)] px-3 text-sm text-[var(--grey-text-muted)] dark:border-[var(--border-strong)] dark:bg-[var(--border-strong)] dark:text-[var(--muted-foreground)]">
                                                @
                                            </span>
                                            <Input
                                                id="company-instagram"
                                                type="text"
                                                aria-label="Username Instagram"
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
                                            <span className="flex items-center rounded-l-lg border border-r-0 border-[var(--border-strong)] bg-[var(--second-accent)] px-3 text-sm text-[var(--grey-text-muted)] dark:border-[var(--border-strong)] dark:bg-[var(--border-strong)] dark:text-[var(--muted-foreground)]">
                                                fb/
                                            </span>
                                            <Input
                                                id="company-facebook"
                                                type="text"
                                                aria-label="Username Facebook"
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
                                            <span className="flex items-center rounded-l-lg border border-r-0 border-[var(--border-strong)] bg-[var(--second-accent)] px-3 text-sm text-[var(--grey-text-muted)] dark:border-[var(--border-strong)] dark:bg-[var(--border-strong)] dark:text-[var(--muted-foreground)]">
                                                @
                                            </span>
                                            <Input
                                                id="company-x"
                                                type="text"
                                                aria-label="Username X (Twitter)"
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
                                            <span className="flex items-center rounded-l-lg border border-r-0 border-[var(--border-strong)] bg-[var(--second-accent)] px-3 text-sm text-[var(--grey-text-muted)] dark:border-[var(--border-strong)] dark:bg-[var(--border-strong)] dark:text-[var(--muted-foreground)]">
                                                @
                                            </span>
                                            <Input
                                                id="company-youtube"
                                                type="text"
                                                aria-label="Username YouTube"
                                                value={data.youtube}
                                                onChange={(e) => setData('youtube', e.target.value)}
                                                placeholder="posave"
                                                className="w-full !rounded-l-none"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="company-whatsapp">WhatsApp</Label>
                                        <Input
                                            id="company-whatsapp"
                                            type="text"
                                            aria-label="Nomor WhatsApp"
                                            value={data.whatsapp}
                                            onChange={(e) => setData('whatsapp', e.target.value)}
                                            placeholder="+62 812 3456 7890"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-start">
                            <Button type="submit" aria-label="Simpan perubahan profil perusahaan" disabled={processing}>
                                {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </DashboardSidebarLayout>
    );
}
