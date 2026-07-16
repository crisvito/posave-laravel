import { Button, Input, Label, Textarea } from '@/components/ui';
import { DashboardSidebarLayout } from '@/layouts';
import { Head, useForm } from '@inertiajs/react';
import { Store, UploadCloud } from 'lucide-react';
import { useRef, useState } from 'react';

interface CompanyProfile {
    name: string;
    phone: string | null;
    address: string | null;
    logo: string | null;
}

interface Props {
    profile: CompanyProfile | null;
}

export default function ProfileSettings({ profile }: Props) {
    const [preview, setPreview] = useState<string | null>(profile?.logo ? `/storage/${profile.logo}` : null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, errors } = useForm({
        name: profile?.name ?? '',
        phone: profile?.phone ?? '',
        address: profile?.address ?? '',
        logo: null as File | null,
    });

    const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setData('logo', file);
        if (file) setPreview(URL.createObjectURL(file));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('lite.settings.profile.update'), { forceFormData: true });
    };

    return (
        <DashboardSidebarLayout title="Profil Toko" description="Info dasar tentang usaha kamu">
            <Head title="Profil Toko" />
            <div className="min-h-screen bg-[var(--page-bg)] p-4 sm:p-6 dark:bg-[var(--background)]">
                <div className="mx-auto max-w-xl rounded-2xl border border-[var(--border-strong)] bg-[var(--neutral-white)] p-5 shadow-sm sm:p-6 dark:border-[var(--border-strong)] dark:bg-[var(--primary-900)]">
                    <div className="mb-5 flex items-center gap-3">
                        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--second-accent)] dark:bg-[var(--border-strong)]">
                            <Store className="h-5 w-5 text-[var(--subheading)] dark:text-[var(--neutral-white)]" />
                        </span>
                        <div>
                            <h3 className="text-lg font-bold text-[var(--subheading)] dark:text-[var(--neutral-white)]">Profil Toko</h3>
                            <p className="text-sm text-[var(--grey-text)] dark:text-[var(--neutral-white)]">Info dasar tentang usaha kamu</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div>
                            <Label>Nama Toko</Label>
                            <Input
                                aria-label="Nama toko"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="Contoh: Warung Bu Siti"
                                className="h-12"
                            />
                            {errors.name && <p className="mt-1 text-sm text-[var(--danger)]">{errors.name}</p>}
                        </div>

                        <div>
                            <Label>Nomor Telepon</Label>
                            <Input
                                aria-label="Nomor telepon toko"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                placeholder="08xxxxxxxxxx"
                                className="h-12"
                            />
                        </div>

                        <div>
                            <Label>Alamat</Label>
                            <Textarea
                                aria-label="Alamat toko"
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                                placeholder="Jl. Contoh No. 123, Kota"
                                rows={3}
                                className="w-full"
                            />
                        </div>

                        <div>
                            <Label>Logo Toko</Label>
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="flex cursor-pointer items-center gap-4 rounded-xl border-2 border-dashed border-[var(--border-strong)] p-4 hover:bg-[var(--second-accent)] dark:border-[var(--border-strong)] dark:hover:bg-white/10"
                            >
                                {preview ? (
                                    <img src={preview} alt="Pratinjau logo" className="h-14 w-14 rounded-lg object-cover" />
                                ) : (
                                    <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-[var(--second-accent)] dark:bg-[var(--border-strong)]">
                                        <UploadCloud className="h-6 w-6 text-[var(--grey-text)] dark:text-[var(--neutral-white)]" />
                                    </div>
                                )}
                                <span className="text-sm font-medium text-[var(--subheading)] dark:text-[var(--neutral-white)]">
                                    {preview ? 'Ganti logo' : 'Tap untuk pilih logo'}
                                </span>
                            </div>
                            <Input
                                aria-label="Unggah logo toko"
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImage}
                                className="hidden"
                            />
                        </div>

                        <Button
                            aria-label="Simpan profil toko"
                            type="submit"
                            disabled={processing}
                            className="h-12 bg-[var(--surface-header)] text-base font-bold hover:bg-[var(--surface-header-hover)] dark:bg-[var(--neutral-white)] dark:text-[var(--primary-900)] dark:hover:text-[var(--neutral-white)] dark:hover:opacity-90"
                        >
                            {processing ? 'Menyimpan...' : 'Simpan Profil Toko'}
                        </Button>
                    </form>
                </div>
            </div>
        </DashboardSidebarLayout>
    );
}
