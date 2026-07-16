import { Button, Input, Label, Textarea } from '@/components';
import { DashboardSidebarLayout } from '@/layouts';
import { Head, useForm } from '@inertiajs/react';
import { Receipt, Store, UploadCloud } from 'lucide-react';
import { useRef, useState } from 'react';

interface ReceiptSettingData {
    address: string | null;
    phone: string | null;
    notes: string | null;
    logo: string | null;
}

interface Props {
    receipt: ReceiptSettingData | null;
    company_name: string;
}

const SAMPLE_ITEMS = [
    { name: 'Indomie Goreng', qty: 2, price: 3500 },
    { name: 'Es Teh Manis', qty: 1, price: 5000 },
    { name: 'Kerupuk', qty: 3, price: 1000 },
];
const SAMPLE_PAID = 20000;

export default function ReceiptSettings({ receipt, company_name }: Props) {
    const [preview, setPreview] = useState<string | null>(receipt?.logo ? `/storage/${receipt.logo}` : null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, errors } = useForm({
        address: receipt?.address ?? '',
        phone: receipt?.phone ?? '',
        notes: receipt?.notes ?? '',
        logo: null as File | null,
    });

    const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setData('logo', file);
        if (file) setPreview(URL.createObjectURL(file));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('lite.settings.receipt.update'), { forceFormData: true });
    };

    const subtotal = SAMPLE_ITEMS.reduce((s, i) => s + i.qty * i.price, 0);
    const change = SAMPLE_PAID - subtotal;
    const now = new Date();

    return (
        <DashboardSidebarLayout title="Bukti Bayar" description="Info yang muncul di struk belanja">
            <Head title="Bukti Bayar" />
            <div className="min-h-screen bg-[var(--page-bg)] p-4 sm:p-6 dark:bg-[var(--background)]">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <div className="rounded-2xl border border-[var(--border-strong)] bg-[var(--neutral-white)] p-5 shadow-sm sm:p-6 dark:border-[var(--border-strong)] dark:bg-[var(--primary-900)]">
                        <div className="mb-5 flex items-center gap-3">
                            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--second-accent)] dark:bg-[var(--border-strong)]">
                                <Receipt className="h-5 w-5 text-[var(--subheading)] dark:text-[var(--neutral-white)]" />
                            </span>
                            <div>
                                <h3 className="text-lg font-bold text-[var(--subheading)] dark:text-[var(--neutral-white)]">Info Struk</h3>
                                <p className="text-sm text-[var(--grey-text)] dark:text-[var(--neutral-white)]">
                                    Perubahan langsung terlihat di contoh sebelah kanan
                                </p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <div>
                                <Label>Alamat di Struk</Label>
                                <Textarea
                                    aria-label="Alamat pada struk"
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                    rows={2}
                                    placeholder="Boleh sama dengan alamat toko, atau beda"
                                    className="w-full border border-[var(--border-strong)] bg-transparent px-3 py-2 text-base dark:border-[var(--border-strong)] dark:text-[var(--neutral-white)]"
                                />
                            </div>

                            <div>
                                <Label>Telepon di Struk</Label>
                                <Input
                                    aria-label="Nomor telepon pada struk"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    placeholder="08xxxxxxxxxx"
                                    className="h-12 text-base"
                                />
                            </div>

                            <div>
                                <Label>Pesan di Bawah Struk</Label>
                                <Textarea
                                    aria-label="Catatan pada struk"
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    rows={2}
                                    placeholder="Contoh: Terima kasih sudah belanja!"
                                    className="w-full rounded-xl border border-[var(--border-strong)] bg-transparent px-3 py-2 text-base dark:border-[var(--border-strong)] dark:text-[var(--neutral-white)]"
                                />
                            </div>

                            <div>
                                <Label>Logo di Struk</Label>
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="flex cursor-pointer items-center gap-4 rounded-xl border-2 border-dashed border-[var(--border-strong)] p-4 hover:bg-[var(--second-accent)] dark:border-[var(--border-strong)] dark:hover:bg-white/10"
                                >
                                    {preview ? (
                                        <img src={preview} alt="Pratinjau logo struk" className="h-14 w-14 rounded-lg object-cover" />
                                    ) : (
                                        <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-[var(--second-accent)] dark:bg-[var(--border-strong)]">
                                            <UploadCloud className="h-6 w-6 text-[var(--grey-text)] dark:text-[var(--neutral-white)]" />
                                        </div>
                                    )}
                                    <span className="text-sm font-medium text-[var(--subheading)] dark:text-[var(--neutral-white)]">
                                        {preview ? 'Ganti logo' : 'Tap untuk pilih logo'}
                                    </span>
                                </div>
                                <input
                                    aria-label="Unggah logo struk"
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImage}
                                    className="hidden"
                                />
                            </div>

                            <Button
                                aria-label="Simpan pengaturan struk"
                                type="submit"
                                disabled={processing}
                                className="h-12 rounded-xl bg-[var(--surface-header)] text-base font-bold hover:bg-[var(--surface-header-hover)] dark:bg-[var(--neutral-white)] dark:text-[var(--primary-900)] dark:hover:opacity-90"
                            >
                                {processing ? 'Menyimpan...' : 'Simpan Pengaturan Struk'}
                            </Button>
                        </form>
                    </div>

                    <div className="lg:sticky lg:top-6 lg:self-start">
                        <div className="rounded-2xl border border-[var(--border-strong)] bg-[var(--neutral-white)] p-5 shadow-sm dark:border-[var(--border-strong)] dark:bg-[var(--primary-900)]">
                            <h3 className="mb-4 text-base font-bold text-[var(--subheading)] dark:text-[var(--neutral-white)]">
                                Contoh Tampilan Struk
                            </h3>

                            <div className="mx-auto max-w-[300px] rounded-xl border-2 border-dashed border-[var(--border-strong)] p-5 dark:border-[var(--border-strong)]">
                                <div className="flex flex-col items-center text-center">
                                    {preview ? (
                                        <img src={preview} alt="Logo" className="mb-2 h-14 w-14 rounded-full object-cover" />
                                    ) : (
                                        <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--second-accent)] dark:bg-[var(--border-strong)]">
                                            <Store className="h-6 w-6 text-[var(--grey-text)] dark:text-[var(--neutral-white)]" />
                                        </div>
                                    )}
                                    <p className="text-base font-extrabold text-[var(--subheading)] dark:text-[var(--neutral-white)]">
                                        {company_name || 'Nama Toko'}
                                    </p>
                                    {data.address && (
                                        <p className="mt-1 text-xs text-[var(--grey-text)] dark:text-[var(--neutral-white)]">{data.address}</p>
                                    )}
                                    {data.phone && <p className="text-xs text-[var(--grey-text)] dark:text-[var(--neutral-white)]">{data.phone}</p>}
                                </div>

                                <div className="my-3 border-t border-dashed border-[var(--border-strong)] dark:border-[var(--border-strong)]" />

                                <div className="flex justify-between text-[11px] text-[var(--grey-text)] dark:text-[var(--neutral-white)]">
                                    <span>{now.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                    <span>{now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>

                                <div className="my-3 border-t border-dashed border-[var(--border-strong)] dark:border-[var(--border-strong)]" />

                                <div className="flex flex-col gap-1.5">
                                    {SAMPLE_ITEMS.map((item) => (
                                        <div
                                            key={item.name}
                                            className="flex justify-between text-xs text-[var(--subheading)] dark:text-[var(--neutral-white)]"
                                        >
                                            <span>
                                                {item.qty}x {item.name}
                                            </span>
                                            <span>Rp {(item.qty * item.price).toLocaleString('id-ID')}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="my-3 border-t border-dashed border-[var(--border-strong)] dark:border-[var(--border-strong)]" />

                                <div className="flex flex-col gap-1 text-xs">
                                    <div className="flex justify-between font-bold text-[var(--subheading)] dark:text-[var(--neutral-white)]">
                                        <span>TOTAL</span>
                                        <span>Rp {subtotal.toLocaleString('id-ID')}</span>
                                    </div>
                                    <div className="flex justify-between text-[var(--grey-text)] dark:text-[var(--neutral-white)]">
                                        <span>Tunai</span>
                                        <span>Rp {SAMPLE_PAID.toLocaleString('id-ID')}</span>
                                    </div>
                                    <div className="flex justify-between text-[var(--grey-text)] dark:text-[var(--neutral-white)]">
                                        <span>Kembalian</span>
                                        <span>Rp {change.toLocaleString('id-ID')}</span>
                                    </div>
                                </div>

                                {data.notes && (
                                    <>
                                        <div className="my-3 border-t border-dashed border-[var(--border-strong)] dark:border-[var(--border-strong)]" />
                                        <p className="text-center text-xs text-[var(--grey-text)] dark:text-[var(--neutral-white)]">{data.notes}</p>
                                    </>
                                )}

                                <p className="mt-3 text-center text-xs text-[var(--grey-text)] dark:text-[var(--neutral-white)]">
                                    Ini cuma contoh tampilan, bukan transaksi asli.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardSidebarLayout>
    );
}
