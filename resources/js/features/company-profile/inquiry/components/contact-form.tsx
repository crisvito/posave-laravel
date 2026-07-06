import { Input, InputError } from '@/components'; // Sesuaikan lokasi import Input kamu
import { Button } from '@/components/ui'; // Asumsi kamu punya Button
import { Textarea } from '@/components/ui/textarea'; // Sesuaikan lokasi import
import { useForm, usePage } from '@inertiajs/react';
import { Lock, Send } from 'lucide-react';
import { FormEventHandler } from 'react';

export function ContactForm() {
    const { translations } = usePage().props as any;
    const t = translations['company-profile/inquiry'];
    // Gunakan Inertia useForm untuk menangani data yang akan dikirim
    const { data, setData, post, processing, errors, reset } = useForm({
        first_name: '',
        last_name: '',
        email: '',
        message: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        // Ganti '/contact-us' dengan route tujuanmu di Laravel
        post('/contact-us', {
            onSuccess: () => reset(),
        });
    };

    return (
        <div className="rounded-2xl border border-neutral-100 bg-white p-8 shadow-sm">
            <h3 className="mb-6 text-2xl font-bold text-slate-800">{t.form_title}</h3>

            <form onSubmit={submit} className="flex flex-col gap-6">
                {/* Baris Nama (Dibagi 2 kolom) */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">{t.first_name}</label>
                        <Input value={data.first_name} onChange={(e) => setData('first_name', e.target.value)} placeholder={t.first_name_placeholder} />
                        <InputError message={errors.first_name} className="mt-2" />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">{t.last_name}</label>
                        <Input value={data.last_name} onChange={(e) => setData('last_name', e.target.value)} placeholder={t.last_name_placeholder} />
                        <InputError message={errors.last_name} className="mt-2" />
                    </div>
                </div>

                {/* Baris Email */}
                <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">{t.email}</label>
                    <Input type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} placeholder={t.email_placeholder} />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                {/* Baris Deskripsi */}
                <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">{t.description}</label>
                    <Textarea
                        value={data.message}
                        onChange={(e) => setData('message', e.target.value)}
                        placeholder={t.description_placeholder}
                    />
                    <InputError message={errors.message} className="mt-2" />
                </div>

                {/* Tombol Kirim */}
                <Button type="submit" disabled={processing} className="text-md h-12 w-full bg-[#22303F] hover:bg-[#002266]">
                    {t.send_button} <Send className="ml-2 h-4 w-4" />
                </Button>

                {/* Tulisan Keamanan */}
                <div className="flex items-center justify-center gap-2 text-center text-xs text-slate-500">
                    <Lock className="h-3 w-3" />
                    <p>{t.security_notice}</p>
                </div>
            </form>
        </div>
    );
}
