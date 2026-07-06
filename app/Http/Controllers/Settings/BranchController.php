<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\Settings\Branch;
use App\Models\Settings\Company;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BranchController extends Controller
{
    /**
     * Display a listing of the company branches.
     */
    public function index(\Illuminate\Http\Request $request)
{
    $userId = $request->user()->id;
    $company = \App\Models\Settings\Company::where('user_id', $userId)->first();

    // 📥 1. Tangkap parameter filter & per_page secara dinamis dari frontend React
    $search = $request->input('search');
    $status = $request->input('status');
    $perPage = $request->input('per_page', 5); // Default 5 entri jika tidak diubah

    if ($company) {
        // Mulai Query Builder untuk Branch yang terikat dengan Company
        $query = \App\Models\Settings\Branch::where('company_id', $company->id);

        // 🔍 2. Logika Pencarian Dinamis (Nama Cabang atau Alamat)
        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('address', 'like', "%{$search}%");
            });
        }

        // 🚦 3. Logika Filter Status (Konversi Bahasa Indonesia ke value Database)
        if ($status && $status !== 'Semua') {
            $dbStatus = ($status === 'Buka') ? 'open' : 'close';
            $query->where('status', $dbStatus);
        }

        // Jalankan pagination dengan query string yang dipertahankan
        $branches = $query->latest()->paginate((int)$perPage)->withQueryString();
    } else {
        // Proteksi jika data company kosong, kembalikan pagination kosong yang valid
        $branches = \App\Models\Settings\Branch::where('id', 0)->paginate((int)$perPage)->withQueryString();
    }

    // 📤 4. Kirim data branches beserta state filter agar input di React tidak ter-reset
    return inertia('settings/branch', [
        'branches' => $branches,
        'filters' => [
            'search' => $search ?? '',
            'status' => $status ?? 'Semua',
            'per_page' => (string)$perPage
        ]
    ]);
}
    /**
     * Store a newly created branch in storage.
     */
    public function store(Request $request)
    {
        $userId = $request->user()->id;
        
        // FIXED: Changed 'user-id' to 'user_id'
        $company = Company::where('user_id', $userId)->first();

        if (!$company) {
            return redirect()->back()->withErrors([
                'name' => 'Please fill out your company profile first in the Profile Settings menu.'
            ]);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string',
            'phone' => 'required|string|max:20',
            'status' => 'required|in:open,close',
        ]);

        // Inject the company_id foreign key directly into the creation array
        $validated['company_id'] = $company->id;
        Branch::create($validated);

        return redirect()->back();
    }

    /**
     * Update the specified branch in storage.
     */
    public function update(Request $request, Branch $branch)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string',
            'phone' => 'required|string|max:20',
            'status' => 'required|in:open,close',
        ]);

        $branch->update($validated);

        return redirect()->back();
    }

    /**
     * Remove the specified branch from storage.
     */
    public function destroy(Branch $branch)
    {
        $branch->delete();
        return redirect()->back();
    }
}