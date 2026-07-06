import { type BreadcrumbItem } from '@/types';
import { Head, useForm, router } from '@inertiajs/react';
import { FormEventHandler, useState, useEffect, useRef } from 'react';
import { Button, Input, InputError, Label } from '@/components';
import { DashboardLayout } from '@/layouts';
import { MapPin, Phone, MoreVertical, Search, Printer, ChevronDown, Check, Eye, Pencil, Trash2 } from 'lucide-react';

interface Branch {
    id: number;
    name: string;
    address: string;
    phone: string;
    status: 'open' | 'close';
}

interface PaginationLinks {
    url: string | null;
    label: string;
    active: boolean;
}

interface BranchesProps {
    data: Branch[];
    current_page: number;
    last_page: number;
    from: number;
    to: number;
    total: number;
    links: PaginationLinks[];
}

interface Props {
    branches: BranchesProps;
    filters?: {
        search?: string;
        status?: string;
        per_page?: string;
    };
}

export default function BranchIndex({ branches, filters = { search: '', status: 'Semua', per_page: '5' } }: Props) {
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [editData, setEditData] = useState<Branch | null>(null);
    const [isViewOnly, setIsViewOnly] = useState(false);
    const [activeActionMenu, setActiveActionMenu] = useState<number | null>(null);
    
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [selectedStatus, setSelectedStatus] = useState<string>(filters.status || 'Semua');
    const [perPage, setPerPage] = useState<string>(filters.per_page || '5');

    const [openFilterStatus, setOpenFilterStatus] = useState(false);
    const [openFilterKaryawan, setOpenFilterKaryawan] = useState(false);
    const [selectedKaryawan, setSelectedKaryawan] = useState<string>('Aktif');

    const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
        name: '',
        address: '',
        phone: '',
        status: 'open' as 'open' | 'close',
    });

    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const delayDebounceFn = setTimeout(() => {
            const params: any = {
                page: 1, 
                search: searchQuery,
                status: selectedStatus,
                per_page: perPage
            };
            
            router.get(
                route('dashboard.settings.store'),
                params,
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true
                }
            );
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery, selectedStatus, perPage]);

    const openAddModal = () => {
        setEditData(null);
        setIsViewOnly(false);
        reset();
        setIsOpenModal(true);
    };

    const openEditModal = (branch: Branch) => {
        setEditData(branch);
        setIsViewOnly(false);
        setData({
            name: branch.name,
            address: branch.address,
            phone: branch.phone,
            status: branch.status,
        });
        setActiveActionMenu(null);
        setIsOpenModal(true);
    };

    const openViewModal = (branch: Branch) => {
        setEditData(branch);
        setIsViewOnly(true);
        setData({
            name: branch.name,
            address: branch.address,
            phone: branch.phone,
            status: branch.status,
        });
        setActiveActionMenu(null);
        setIsOpenModal(true);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (isViewOnly) return;

        if (editData) {
            put(route('dashboard.settings.branches.update', editData.id), {
                onSuccess: () => { setIsOpenModal(false); reset(); },
            });
        } else {
            post(route('dashboard.settings.branches.store'), {
                onSuccess: () => { setIsOpenModal(false); reset(); },
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus cabang ini?')) {
            destroy(route('dashboard.settings.branches.destroy', id));
            setActiveActionMenu(null);
        }
    };

    const handlePaginationClick = (url: string | null) => {
        if (url) {
            const urlObj = new URL(url);
            if (searchQuery) urlObj.searchParams.set('search', searchQuery);
            if (selectedStatus !== 'Semua') urlObj.searchParams.set('status', selectedStatus);
            urlObj.searchParams.set('per_page', perPage);

            router.visit(urlObj.toString(), { preserveScroll: true, preserveState: true });
        }
    };

    return (
         <DashboardLayout title="Cabang" description="Kelola Seluruh Cabang Anda">
            <Head title="Cabang" />

            {/* Layout Wrapper Flex untuk Mengamankan Kontrol Viewport Bottom */}
            <div className="w-full flex flex-col justify-between min-h-[calc(100vh-140px)] relative pb-20 px-4 py-2">
                
                <div className="space-y-6 w-full">
                    {/* 1. BARIS ATAS */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
                        <button className="flex items-center gap-2 px-4 py-2.5 bg-[#f8fafc] border border-gray-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-gray-100 transition self-start">
                            <span>🏬</span> Semua Cabang <ChevronDown className="w-4 h-4 text-slate-400" />
                        </button>
                        
                        <div className="flex items-center gap-2 self-end md:self-auto">
                            <div className="px-4 py-2 bg-blue-50 border border-blue-100 rounded-xl text-xs font-medium text-blue-600">
                                Cabang : {branches?.total || 0}
                            </div>
                            <button 
                                onClick={openAddModal}
                                className="flex items-center gap-1.5 px-4 py-2 bg-[#1e293b] text-white rounded-xl text-xs font-medium hover:bg-slate-800 transition shadow-sm"
                            >
                                <span className="text-sm font-bold">+</span> Buat Cabang
                            </button>
                            <button className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 text-slate-600 rounded-xl text-xs font-medium hover:bg-gray-50 transition bg-white">
                                <Printer className="w-3.5 h-3.5" /> Cetak
                            </button>
                        </div>
                    </div>

                    {/* 2. BARIS TENGAH: SEARCH & FILTERS */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 relative z-30">
                        <div className="relative w-full sm:max-w-md">
                            <Search className="absolute left-4 top-3 w-4 h-4 text-slate-400" />
                            <input 
                                type="text" 
                                placeholder="Search" 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-11 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-[#f8fafc] focus:bg-white focus:ring-1 focus:ring-slate-400 outline-none transition"
                            />
                        </div>
                        
                        <div className="flex items-center gap-2 w-full sm:w-auto justify-end relative">
                            {/* DROPDOWN FILTER: STATUS */}
                            <div className="relative">
                                <button 
                                    onClick={() => { setOpenFilterStatus(!openFilterStatus); setOpenFilterKaryawan(false); }}
                                    className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-medium text-slate-600 hover:bg-gray-50 transition min-w-[120px] justify-between"
                                >
                                    <span>Status: {selectedStatus}</span> 
                                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                                </button>

                                {openFilterStatus && (
                                    <>
                                        <div className="fixed inset-0 z-10" onClick={() => setOpenFilterStatus(false)}></div>
                                        <div className="absolute right-0 mt-1.5 w-40 bg-white border border-gray-200 rounded-xl shadow-lg py-1.5 z-20">
                                            {['Semua', 'Buka', 'Tutup'].map((status) => (
                                                <button
                                                    key={status}
                                                    onClick={() => { setSelectedStatus(status); setOpenFilterStatus(false); }}
                                                    className="w-full px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 text-left font-medium transition flex items-center justify-between"
                                                >
                                                    <span>{status}</span>
                                                    {selectedStatus === status && <Check className="w-3.5 h-3.5 text-blue-600" />}
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* DROPDOWN FILTER: KARYAWAN */}
                            <div className="relative">
                                <button 
                                    onClick={() => { setOpenFilterKaryawan(!openFilterKaryawan); setOpenFilterStatus(false); }}
                                    className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-medium text-slate-600 hover:bg-gray-50 transition min-w-[140px] justify-between"
                                >
                                    <span>Karyawan: {selectedKaryawan}</span> 
                                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                                </button>

                                {openFilterKaryawan && (
                                    <>
                                        <div className="fixed inset-0 z-10" onClick={() => setOpenFilterKaryawan(false)}></div>
                                        <div className="absolute right-0 mt-1.5 w-44 bg-white border border-gray-200 rounded-xl shadow-lg py-1.5 z-20">
                                            {['Aktif', 'Pasif', 'Cuti', 'Resign'].map((karyawan) => (
                                                <button
                                                    key={karyawan}
                                                    onClick={() => { setSelectedKaryawan(karyawan); setOpenFilterKaryawan(false); }}
                                                    className="w-full px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 text-left font-medium transition flex items-center justify-between"
                                                >
                                                    <span>{karyawan}</span>
                                                    {selectedKaryawan === karyawan && <Check className="w-3.5 h-3.5 text-blue-600" />}
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* 3. CARD UTAMA TABEL */}
                    <div className="w-full border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-xs relative z-10">
                        <div className="overflow-x-auto w-full max-h-[calc(100vh-340px)] scrollbar-thin">
                            <table className="w-full text-left border-collapse text-sm">
                                <thead className="sticky top-0 z-20 shadow-2xs">
                                    <tr className="border-b border-gray-200 bg-[#293545] text-white">
                                        <th className="p-4 font-semibold text-xs tracking-wider w-1/4">Nama Cabang</th>
                                        <th className="p-4 font-semibold text-xs tracking-wider w-2/5">Alamat</th>
                                        <th className="p-4 font-semibold text-xs tracking-wider w-1/5">Nomor telepon</th>
                                        <th className="p-4 font-semibold text-xs tracking-wider text-center w-32">Status</th>
                                        <th className="p-4 font-semibold text-xs tracking-wider text-center w-20">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {branches?.data && branches.data.length > 0 ? (
                                        branches.data.map((branch) => (
                                            <tr key={branch.id} className="hover:bg-slate-50/50 transition align-middle">
                                                <td className="p-4 font-medium text-slate-800">{branch.name}</td>
                                                <td className="p-4 text-slate-600">
                                                    <div className="flex items-start gap-2 max-w-md">
                                                        <MapPin className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                                                        <span className="text-xs leading-relaxed">{branch.address}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-slate-600 font-mono text-xs">
                                                    <div className="flex items-center gap-2">
                                                        <Phone className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                                                        <span>{branch.phone}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-center">
                                                    <span className={`inline-flex px-3 py-1 rounded-lg text-xs font-medium ${
                                                        branch.status === 'open' 
                                                            ? 'bg-emerald-50 text-emerald-600' 
                                                            : 'bg-rose-50 text-rose-600'
                                                    }`}>
                                                        {branch.status === 'open' ? 'Open' : 'Close'}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-center relative">
                                                    <button 
                                                        id={`action-btn-${branch.id}`}
                                                        onClick={() => setActiveActionMenu(activeActionMenu === branch.id ? null : branch.id)}
                                                        className="p-1.5 hover:bg-gray-100 rounded-lg transition text-slate-500 relative z-20"
                                                    >
                                                        <MoreVertical className="w-4 h-4" />
                                                    </button>
                                                    
                                                    {/* ACTIONS POPUP */}
                                                    {activeActionMenu === branch.id && (
                                                        <>
                                                            <div className="fixed inset-0 z-40" onClick={() => setActiveActionMenu(null)}></div>
                                                            <div 
                                                                className="fixed bg-white border border-gray-300 rounded-2xl shadow-xl overflow-hidden z-50 text-base font-medium transition-all divide-y divide-gray-200 w-36"
                                                                style={{
                                                                    top: (document.getElementById(`action-btn-${branch.id}`)?.getBoundingClientRect().top ?? 0) + 30,
                                                                    left: (document.getElementById(`action-btn-${branch.id}`)?.getBoundingClientRect().left ?? 0) - 120,
                                                                }}
                                                            >
                                                                <button 
                                                                    onClick={() => openViewModal(branch)}
                                                                    className="w-full px-4 py-2.5 text-[#2563eb] bg-[#e0f2fe] hover:bg-[#bae6fd] flex items-center gap-2.5 transition font-semibold text-left"
                                                                >
                                                                    <Eye className="w-4 h-4 stroke-[2.5]" />
                                                                    <span className="text-sm">Lihat</span>
                                                                </button>
                                                                <button 
                                                                    onClick={() => openEditModal(branch)}
                                                                    className="w-full px-4 py-2.5 text-[#d97706] bg-[#fef3c7] hover:bg-[#fde68a] flex items-center gap-2.5 transition font-semibold text-left"
                                                                >
                                                                    <Pencil className="w-4 h-4 stroke-[2.5]" />
                                                                    <span className="text-sm">Ubah</span>
                                                                </button>
                                                                <button 
                                                                    onClick={() => handleDelete(branch.id)}
                                                                    className="w-full px-4 py-2.5 text-[#dc2626] bg-[#ffe4e6] hover:bg-[#fecdd3] flex items-center gap-2.5 transition font-semibold text-left"
                                                                >
                                                                    <Trash2 className="w-4 h-4 stroke-[2.5]" />
                                                                    <span className="text-sm">Hapus</span>
                                                                </button>
                                                            </div>
                                                        </>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="p-16 text-center text-slate-400 font-medium bg-white">
                                                <div className="flex flex-col items-center justify-center space-y-2">
                                                    <span className="text-2xl">🏬</span>
                                                    <span className="text-sm">Tidak ada data cabang yang sesuai dengan filter.</span>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* 4. SEKSI PAGINATION - FIX TERKUNCI DI BAWAH LAYAR (OUTSIDE THE CARD) */}
                <div className="fixed bottom-0 left-0 md:left-64 right-0 p-4 bg-[#f8fafc]/90 backdrop-blur-md border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4 z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.03)] transition-all">
                    <div className="font-medium text-slate-600">
                        Menampilkan <span className="font-semibold text-slate-800">{branches?.from || 0}</span>-<span className="font-semibold text-slate-800">{branches?.to || 0}</span> dari <span className="font-semibold text-slate-800">{branches?.total || 0}</span> Cabang
                    </div>
                    
                    <div className="flex items-center gap-1.5 flex-wrap justify-center">
                        {branches?.links && branches.links.map((link, index) => {
                            const cleanLabel = link.label
                                .replace('&laquo; Previous', '‹')
                                .replace('Next &raquo;', '›');

                            return (
                                <button
                                    key={index}
                                    type="button"
                                    disabled={!link.url}
                                    onClick={() => handlePaginationClick(link.url)}
                                    className={`h-8 min-w-[32px] px-2.5 rounded-xl flex items-center justify-center font-semibold transition-all text-xs border ${
                                        link.active
                                            ? 'bg-[#1e293b] text-white border-[#1e293b] shadow-xs'
                                            : !link.url
                                            ? 'text-gray-300 border-gray-100 cursor-not-allowed bg-gray-50/50'
                                            : 'border-gray-200 bg-white text-slate-600 hover:bg-gray-50 hover:text-slate-800'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: cleanLabel }}
                                />
                            );
                        })}
                    </div>

                    {/* SELECT ENTRI PER HALAMAN */}
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <select 
                                value={perPage}
                                onChange={(e) => setPerPage(e.target.value)}
                                className="appearance-none bg-white border border-gray-200 rounded-xl pl-4 pr-8 py-2 text-slate-600 font-medium text-xs focus:outline-none cursor-pointer hover:bg-gray-50 transition shadow-2xs"
                            >
                                <option value="5">5 per halaman</option>
                                <option value="10">10 per halaman</option>
                                <option value="25">25 per halaman</option>
                            </select>
                            <span className="absolute right-3 top-2.5 pointer-events-none text-slate-400 text-[10px]">▼</span>
                        </div>
                    </div>
                </div>

            </div>

            {/* MODAL FORM TAMBAH / EDIT / LIHAT */}
            {isOpenModal && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 transition-opacity">
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 max-w-lg w-full overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200">
                        <div className="px-6 py-4 bg-[#293545] text-white flex justify-between items-center">
                            <h3 className="font-semibold text-sm tracking-wide uppercase">
                                {isViewOnly ? 'DETAIL INFORMASI CABANG' : editData ? 'UBAH DATA CABANG' : 'TAMBAH CABANG BARU'}
                            </h3>
                            <button onClick={() => setIsOpenModal(false)} className="text-white/70 hover:text-white font-bold text-lg transition">✕</button>
                        </div>
                        <form onSubmit={submit} className="p-6 space-y-4">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="modal-name">Nama Cabang</Label>
                                <Input id="modal-name" disabled={isViewOnly} className="w-full bg-[#f8fafc] border-[#e2e8f0] rounded-xl h-11 text-sm focus:bg-white transition disabled:opacity-70" value={data.name} onChange={(e) => setData('name', e.target.value)} placeholder="Contoh: Cabang 1" required />
                                {errors.name && <InputError message={errors.name} />}
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="modal-phone">Nomor Telepon</Label>
                                <Input id="modal-phone" disabled={isViewOnly} className="w-full bg-[#f8fafc] border-[#e2e8f0] rounded-xl h-11 text-sm focus:bg-white transition disabled:opacity-70" value={data.phone} onChange={(e) => setData('phone', e.target.value)} placeholder="Contoh: +62 123456789" required />
                                {errors.phone && <InputError message={errors.phone} />}
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="modal-status">Status Operasional</Label>
                                <select id="modal-status" disabled={isViewOnly} className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-xl h-11 text-sm px-4 focus:bg-white transition outline-none disabled:opacity-70" value={data.status} onChange={(e) => setData('status', e.target.value as 'open' | 'close')}>
                                    <option value="open">Open</option>
                                    <option value="close">Close</option>
                                </select>
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="modal-address">Alamat Lengkap Cabang</Label>
                                <textarea id="modal-address" disabled={isViewOnly} className="w-full rounded-xl border border-[#e2e8f0] bg-[#f8fafc] text-sm p-4 h-24 resize-none focus:bg-white transition outline-none disabled:opacity-70" value={data.address} onChange={(e) => setData('address', e.target.value)} placeholder="Tulis alamat jalan lengkap..." required />
                                {errors.address && <InputError message={errors.address} />}
                            </div>
                            <div className="flex justify-end gap-2 pt-4 border-t border-gray-100 mt-6">
                                <button type="button" onClick={() => setIsOpenModal(false)} className="px-4 py-2 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition">
                                    {isViewOnly ? 'Tutup' : 'Batal'}
                                </button>
                                {!isViewOnly && (
                                    <Button type="submit" disabled={processing} className="px-5 py-2 bg-[#293545] text-white rounded-xl text-xs font-medium hover:bg-slate-800 transition">
                                        {processing ? 'Menyimpan...' : 'Simpan Data'}
                                    </Button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            )}
         </DashboardLayout>
    );
}