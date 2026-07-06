import { type BreadcrumbItem } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useRef, useState } from 'react';

import { Button, Input, InputError, Label } from '@/components';
import { DashboardLayout } from '@/layouts';

interface CompanyFormProps {
    name: string;
    description: string;
    phone: string;
    address: string;
    province: string;
    city: string;
    zip_code: string;
    email: string;
    instagram: string;
    youtube: string;
    linkedin: string;
    twitter: string;
    avatar: File | null;
}

export default function Profile() {
    const { company } = usePage<{ company: CompanyFormProps }>().props;

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(company?.avatar ? (company as any).avatar_url : null);
    const [currentPage, setCurrentPage] = useState(1);

    const { data, setData, post, processing, errors } = useForm<CompanyFormProps>({
        name: company?.name || '',
        description: company?.description || '',
        phone: company?.phone || '',
        address: company?.address || '',
        province: company?.province || '',
        city: company?.city || '',
        zip_code: company?.zip_code || '',
        email: company?.email || '',
        instagram: company?.instagram || '',
        youtube: company?.youtube || '',
        linkedin: company?.linkedin || '',
        twitter: company?.twitter || '',
        avatar: null,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('dashboard.settings.profile.update'), {
            preserveScroll: true,
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('avatar', file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    return (
        <DashboardLayout title="Profil Akun" description="Kelola informasi profil akun dari perusahaan anda">
            <Head title="Profil Akun" />
            
            {/* Main Content Wrapper - Menghapus padding samping global agar pembungkus dalam yang mengatur perataan */}
            <div className="w-full bg-white min-h-[calc(100vh-80px)] py-8 font-poppins flex flex-col justify-between relative">
                <div className="w-full">

                    {/* 2. FORM LAYOUT UTAMA */}
                    <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-12 gap-x-12 gap-y-6 w-full max-w-7xl mx-auto px-6 md:px-12">
                        
                        {/* KOLOM KIRI: Foto & Sosial Media Dengan Ikon SVG */}
                        <div className="lg:col-span-4 flex flex-col gap-5">
                            {/* Kotak Upload Foto */}
                            <div className="bg-[#1e293b] p-8 rounded-[24px] flex flex-col items-center justify-center relative aspect-square w-full max-w-[280px]">
                                <div className="w-32 h-32 rounded-full bg-[#e2e8f0] overflow-hidden mb-6 flex items-center justify-center border-4 border-[#334155]">
                                    {previewUrl ? (
                                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-[#cbd5e1]" />
                                    )}
                                </div>
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    onChange={handleFileChange} 
                                    className="hidden" 
                                    accept="image/*" 
                                />
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="flex items-center gap-2 px-5 py-2 bg-transparent hover:bg-slate-800 text-white rounded-xl text-xs border border-slate-500 transition"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><circle cx="12" cy="13" r="3" strokeWidth="2"/></svg>
                                    Ubah Foto
                                </button>
                                <InputError message={errors.avatar} className="mt-2" />
                            </div>

                            {/* List Sosial Media */}
                            <div className="flex flex-col gap-3 w-full max-w-[280px]">
                                {/* Instagram */}
                                <div className="relative flex items-center">
                                    <svg className="absolute left-4 w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="2" y="2" width="20" h="20" rx="5" ry="5" strokeWidth="2"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" strokeWidth="2"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeWidth="2"/></svg>
                                    <span className="absolute left-10 text-gray-400 text-sm font-medium">@</span>
                                    <Input className="pl-14 w-full text-sm rounded-xl border border-gray-200 bg-[#f8fafc] h-11" value={data.instagram} onChange={(e) => setData('instagram', e.target.value)} placeholder="Posave" />
                                </div>
                                {/* Youtube */}
                                <div className="relative flex items-center">
                                    <svg className="absolute left-4 w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58 2.78 2.78 0 001.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.96A29 29 0 0023 12a29 29 0 00-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor"/></svg>
                                    <span className="absolute left-10 text-gray-400 text-sm font-medium">@</span>
                                    <Input className="pl-14 w-full text-sm rounded-xl border border-gray-200 bg-[#f8fafc] h-11" value={data.youtube} onChange={(e) => setData('youtube', e.target.value)} placeholder="Posave" />
                                </div>
                                {/* Linkedin */}
                                <div className="relative flex items-center">
                                    <svg className="absolute left-4 w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2" strokeWidth="2"/></svg>
                                    <span className="absolute left-10 text-gray-400 text-sm font-medium">@</span>
                                    <Input className="pl-14 w-full text-sm rounded-xl border border-gray-200 bg-[#f8fafc] h-11" value={data.linkedin} onChange={(e) => setData('linkedin', e.target.value)} placeholder="Posave" />
                                </div>
                                {/* Twitter */}
                                <div className="relative flex items-center">
                                    <svg className="absolute left-4 w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="2" y="2" width="20" h="20" rx="5" ry="5" strokeWidth="2"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" strokeWidth="2"/></svg>
                                    <span className="absolute left-10 text-gray-400 text-sm font-medium">@</span>
                                    <Input className="pl-14 w-full text-sm rounded-xl border border-gray-200 bg-[#f8fafc] h-11" value={data.twitter} onChange={(e) => setData('twitter', e.target.value)} placeholder="Posave" />
                                </div>
                            </div>
                        </div>

                        {/* KOLOM KANAN: Grid Form Input */}
                        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 items-start">
                            
                            {/* Baris 1 Kiri: Nama Perusahaan */}
                            <div className="flex flex-col gap-2">
                                <Label className="text-[#1e293b] font-medium text-sm" htmlFor="name">Nama Perusahaan</Label>
                                <Input id="name" className="w-full bg-[#f8fafc] border-[#e2e8f0] rounded-xl h-11 text-sm px-4 focus:bg-white transition" value={data.name} onChange={(e) => setData('name', e.target.value)} required />
                                <InputError message={errors.name} />
                            </div>

                            {/* Baris 1 Kanan: Alamat */}
                            <div className="flex flex-col gap-2 md:row-span-2">
                                <Label className="text-[#1e293b] font-medium text-sm" htmlFor="address">Alamat</Label>
                                <textarea id="address" className="w-full rounded-xl border border-[#e2e8f0] bg-[#f8fafc] text-sm p-4 h-[134px] resize-none focus:bg-white transition focus:ring-1 focus:ring-blue-500 outline-none" value={data.address} onChange={(e) => setData('address', e.target.value)} />
                                <InputError message={errors.address} />
                            </div>

                            {/* Baris 2 Kiri: Deskripsi */}
                            <div className="flex flex-col gap-2">
                                <Label className="text-[#1e293b] font-medium text-sm" htmlFor="description">Deskripsi</Label>
                                <textarea id="description" className="w-full rounded-xl border border-[#e2e8f0] bg-[#f8fafc] text-sm p-4 h-[106px] resize-none focus:bg-white transition focus:ring-1 focus:ring-blue-500 outline-none" value={data.description} onChange={(e) => setData('description', e.target.value)} />
                                <InputError message={errors.description} />
                            </div>

                            {/* Baris 2 Kanan: Wilayah (Provinsi, Kota, Zip) */}
                            <div className="grid grid-cols-3 gap-3">
                                <div className="flex flex-col gap-2">
                                    <Label className="text-[#1e293b] font-medium text-xs" htmlFor="province">Provinsi</Label>
                                    <Input id="province" className="w-full bg-[#f8fafc] border-[#e2e8f0] rounded-xl h-11 text-xs focus:bg-white transition" value={data.province} onChange={(e) => setData('province', e.target.value)} />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label className="text-[#1e293b] font-medium text-xs" htmlFor="city">Kota</Label>
                                    <Input id="city" className="w-full bg-[#f8fafc] border-[#e2e8f0] rounded-xl h-11 text-xs focus:bg-white transition" value={data.city} onChange={(e) => setData('city', e.target.value)} />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label className="text-[#1e293b] font-medium text-xs" htmlFor="zip_code">Zip</Label>
                                    <Input id="zip_code" className="w-full bg-[#f8fafc] border-[#e2e8f0] rounded-xl h-11 text-xs focus:bg-white transition" value={data.zip_code} onChange={(e) => setData('zip_code', e.target.value)} />
                                </div>
                            </div>

                            {/* Baris 3 Kiri: Nomor Telepon */}
                            <div className="flex flex-col gap-2">
                                <Label className="text-[#1e293b] font-medium text-sm" htmlFor="phone">Nomor Telepon</Label>
                                <Input id="phone" className="w-full bg-[#f8fafc] border-[#e2e8f0] rounded-xl h-11 text-sm focus:bg-white transition" value={data.phone} onChange={(e) => setData('phone', e.target.value)} />
                            </div>

                            {/* Baris 3 Kanan: Email */}
                            <div className="flex flex-col gap-2">
                                <Label className="text-[#1e293b] font-medium text-sm" htmlFor="email">Email</Label>
                                <Input id="email" type="email" className="w-full bg-[#f8fafc] border-[#e2e8f0] rounded-xl h-11 text-sm focus:bg-white transition" value={data.email} onChange={(e) => setData('email', e.target.value)} />
                            </div>

                            {/* Tombol Aksi */}
                            <div className="md:col-span-2 flex justify-end mt-4">
                                <Button type="submit" className="bg-[#1a2533] hover:bg-slate-800 text-white font-medium px-8 py-3 rounded-xl text-sm transition shadow-sm" disabled={processing}>
                                    Simpan Perubahan
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
}