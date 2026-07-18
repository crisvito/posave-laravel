import { Input, InputError } from '@/components';
import { Button } from '@/components/ui';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from '@inertiajs/react';
import { Lock, Send } from 'lucide-react';
import { FormEventHandler } from 'react';

export function ContactForm() {
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
            <h3 className="mb-6 text-2xl font-bold text-[var(--foreground)]">Kirim Pesan</h3>

            <form onSubmit={submit} className="flex flex-col gap-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-[var(--muted-foreground)]">Nama Depan</label>
                        <Input
                            value={data.first_name}
                            onChange={(e) => setData('first_name', e.target.value)}
                            placeholder="Nama depan"
                            className="bg-[var(--background)] text-[var(--foreground)] placeholder:text-[var(--grey-text-muted)]"
                        />
                        <InputError message={errors.first_name} className="mt-2" />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium text-[var(--muted-foreground)]">Nama Belakang</label>
                        <Input
                            value={data.last_name}
                            onChange={(e) => setData('last_name', e.target.value)}
                            placeholder="Nama belakang"
                            className="bg-[var(--background)] text-[var(--foreground)] placeholder:text-[var(--grey-text-muted)]"
                        />
                        <InputError message={errors.last_name} className="mt-2" />
                    </div>
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-[var(--muted-foreground)]">Email</label>
                    <Input
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        placeholder="contoh@email.com"
                        className="bg-[var(--background)] text-[var(--foreground)] placeholder:text-[var(--grey-text-muted)]"
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-[var(--muted-foreground)]">Deskripsi</label>
                    <Textarea
                        value={data.message}
                        onChange={(e) => setData('message', e.target.value)}
                        placeholder="Tuliskan pertanyaan atau pesan Anda disini..."
                        className="bg-[var(--background)] text-[var(--foreground)] placeholder:text-[var(--grey-text-muted)]"
                    />
                    <InputError message={errors.message} className="mt-2" />
                </div>

                <Button
                    type="submit"
                    disabled={processing}
                    className="text-md h-12 w-full bg-[var(--secondary-600)] text-white hover:bg-[var(--secondary-700)]"
                >
                    Kirim Pesan <Send className="ml-2 h-4 w-4" />
                </Button>

                <div className="flex items-center justify-center gap-2 text-center text-xs text-[var(--grey-text-muted)]">
                    <Lock className="h-3 w-3" />
                    <p>Data Anda aman bersama kami. Kami tidak akan membagikan informasi Anda ke pihak lain.</p>
                </div>
            </form>
        </div>
    );
}
