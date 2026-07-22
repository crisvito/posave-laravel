<?php

namespace App\Http\Controllers\lite;

use App\Http\Controllers\Controller;
use App\Models\Advance\Management\Settings\ReceiptSetting;
use App\Models\Auth\CompanyProfile;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class SettingsController extends Controller
{
    private function getOwner(): User
    {
        /** @var User $user */
        $user = Auth::user();
        return $user;
    }

    public function profile()
    {
        $user = $this->getOwner();
        $company = $user->company->load('profile');

        return Inertia::render('lite/settings/profile', [
            'profile' => $company->profile,
        ]);
    }

    public function updateProfile(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:500',
            'logo' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        $user = $this->getOwner();
        $company = $user->company;
        $profile = $company->profile ?? CompanyProfile::make(['company_id' => $company->id]);

        $data = $request->only(['name', 'phone', 'address']);

        if ($request->hasFile('logo')) {
            if ($profile->logo) {
                Storage::disk('public')->delete($profile->logo);
            }
            $data['logo'] = $request->file('logo')->store('logos/company', 'public');
        }

        $profile->fill($data);
        $profile->company_id = $company->id;
        $profile->save();

        return back()->with('success', 'Profil toko berhasil disimpan.');
    }

    public function receipt()
    {
        $user = $this->getOwner();
        $company = $user->company->load(['profile', 'receiptSetting']);

        return Inertia::render('lite/settings/receipt', [
            'receipt' => $company->receiptSetting,
            'profile' => $company->profile,
        ]);
    }

    public function updateReceipt(Request $request)
    {
        $request->validate([
            'notes' => 'nullable|string|max:500',
        ]);

        $user = $this->getOwner();
        $company = $user->company;
        $receipt = $company->receiptSetting ?? ReceiptSetting::make(['company_id' => $company->id]);

        $receipt->fill($request->only(['notes']));
        $receipt->company_id = $company->id;
        $receipt->save();

        return back()->with('success', 'Pengaturan struk berhasil disimpan.');
    }
}
