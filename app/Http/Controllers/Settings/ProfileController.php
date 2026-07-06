<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Settings\Company;

class ProfileController extends Controller
{
    /**
     * Show the user's profile settings page.
     */
    public function edit(Request $request): Response
    {
        $company = $request->user()->company;

        // Jika company ditemukan, kita buatkan link URL untuk avatar-nya (jika ada)
        if ($company) {
            $company->avatar_url = $company->avatar 
                ? Storage::url($company->avatar) 
                : null;
        }

        return Inertia::render('settings/profile', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => $request->session()->get('status'),
            'company' => $company, // <--- Kirim data ini ke React!
        ]);
    }

    /**
     * Update the user's profile settings.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $user = $request->user();
        
        // 1. Update data User terlebih dahulu (bawaan Laravel Breeze)
        $user->fill($request->validated());
        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }
        $user->save();

        // 2. Ambil atau buat data company baru jika belum ada
        $company = $user->company ?? $user->company()->create();

        // 3. Ambil data yang sudah divalidasi dari Form Request
        // Pastikan field di ProfileUpdateRequest sudah mencakup name, phone, address, dll.
        $companyData = $request->only([
            'name', 'description', 'phone', 'address', 'province', 
            'city', 'zip_code', 'email', 'instagram', 'youtube', 'linkedin', 'twitter'
        ]);

        // 4. Proses Upload Avatar/Foto jika ada file baru yang diunggah
        if ($request->hasFile('avatar')) {
            // Hapus foto lama dari storage jika sebelumnya sudah ada
            if ($company->avatar) {
                Storage::delete($company->avatar);
            }
            
            // Simpan foto baru ke folder 'avatars' di dalam disk public
            $path = $request->file('avatar')->store('avatars', 'public');
            $companyData['avatar'] = $path;
        }

        // 5. Simpan perubahan ke table companies
        $company->update($companyData);

        // 6. Redirect kembali ke halaman edit profil dengan pesan sukses
        return to_route('dashboard.settings.profile.edit')->with('status', 'profile-updated');
        // Catatan: sesuaikan nama route to_route() Anda dengan yang tertulis di web.php
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
