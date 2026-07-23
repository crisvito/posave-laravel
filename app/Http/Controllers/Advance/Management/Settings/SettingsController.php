<?php

namespace App\Http\Controllers\Advance\Management\Settings;

use App\Http\Controllers\Controller;
use App\Models\Advance\Messaging\Conversation;
use App\Models\Auth\Branch;
use App\Models\Auth\CompanyProfile;
use App\Models\Advance\Management\Settings\ReceiptSetting;
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
        abort_if(!$user->isOwner(), 403);
        return $user;
    }

    // ─── Company Profile ───────────────────────────────────────────

    public function companyProfile()
    {
        $user    = $this->getOwner();
        $company = $user->company->load('profile');

        return Inertia::render('advance/management/company-settings/company-profile', [
            'company' => [
                'id'      => $company->id,
                'type'    => $company->type,
                'profile' => $company->profile,
            ],
        ]);
    }

    public function updateCompanyProfile(Request $request)
    {
        $request->validate([
            'name'      => 'required|string|max:255',
            'phone'     => 'nullable|string|max:20',
            'email'     => 'nullable|email|max:255',
            'address'   => 'nullable|string|max:500',
            'province'  => 'nullable|string|max:100',
            'city'      => 'nullable|string|max:100',
            'zip'       => 'nullable|string|max:10',
            'instagram' => 'nullable|string|max:100',
            'facebook'  => 'nullable|string|max:100',
            'x'         => 'nullable|string|max:100',
            'youtube'   => 'nullable|string|max:100',
            'whatsapp'  => 'nullable|string|max:20',
            'website'   => 'nullable|url|max:255',
            'logo'      => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        $user    = $this->getOwner();
        $company = $user->company;
        $profile = $company->profile ?? CompanyProfile::make(['company_id' => $company->id]);

        $data = $request->only([
            'name',
            'phone',
            'email',
            'address',
            'province',
            'city',
            'zip',
            'instagram',
            'facebook',
            'x',
            'youtube',
            'whatsapp',
            'website',
        ]);

        if ($request->hasFile('logo')) {
            if ($profile->logo) {
                Storage::disk('public')->delete($profile->logo);
            }
            $data['logo'] = $request->file('logo')->store('logos/company', 'public');
        }

        $profile->fill($data);
        $profile->company_id = $company->id;
        $profile->save();

        return back()->with('success', 'Company profile berhasil disimpan.');
    }

    // ─── Receipt Settings ──────────────────────────────────────────
    // Identitas company (nama, alamat, kontak, logo) SEMUANYA ditarik dari Company Profile.
    // Receipt cuma nyimpen hal yang spesifik struk: catatan/pesan footer.

    public function receiptSettings()
    {
        $user    = $this->getOwner();
        $company = $user->company->load(['profile', 'receiptSetting']);

        return Inertia::render('advance/management/company-settings/receipt', [
            'receipt' => $company->receiptSetting,
            'profile' => $company->profile,
        ]);
    }

    public function updateReceiptSettings(Request $request)
    {
        $request->validate([
            'notes' => 'nullable|string|max:500',
        ]);

        $user    = $this->getOwner();
        $company = $user->company;
        $receipt = $company->receiptSetting
            ?? ReceiptSetting::make(['company_id' => $company->id]);

        $receipt->fill($request->only(['notes']));
        $receipt->company_id = $company->id;
        $receipt->save();

        return back()->with('success', 'Pengaturan struk berhasil disimpan.');
    }

    // ─── Manage Toko (Branches) ────────────────────────────────────

    public function branches()
    {
        $user    = $this->getOwner();
        $search  = request('search');
        $perPage = (int) request('per_page', 5);

        $branches = $user->company->branches()
            ->when($search, fn($q) => $q->where('name', 'like', "%{$search}%"))
            ->orderByDesc('is_main')
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('advance/management/company-settings/branches', [
            'branches' => $branches,
            'filters'  => [
                'search'   => $search,
                'per_page' => $perPage,
            ],
        ]);
    }

    public function storeBranch(Request $request)
    {
        $request->validate([
            'name'    => 'required|string|max:255',
            'address' => 'nullable|string|max:500',
            'phone'   => 'nullable|string|max:20',
        ]);

        $user = $this->getOwner();

        $branch = Branch::create([
            'company_id' => $user->company_id,
            'name'       => $request->name,
            'address'    => $request->address,
            'phone'      => $request->phone,
            'is_main'    => false,
        ]);

        $conversation = Conversation::create([
            'company_id' => $user->company_id,
            'branch_id'  => $branch->id,
            'type'       => 'group',
            'name'       => $branch->name,
        ]);

        $conversation->members()->attach($user->id, ['last_read_at' => now()]);

        return back()->with('success', 'Cabang berhasil ditambahkan.');
    }

    public function updateBranch(Request $request, Branch $branch)
    {
        $user = $this->getOwner();
        abort_if($branch->company_id !== $user->company_id, 403);

        $request->validate([
            'name'    => 'required|string|max:255',
            'address' => 'nullable|string|max:500',
            'phone'   => 'nullable|string|max:20',
        ]);

        $branch->update($request->only(['name', 'address', 'phone']));

        return back()->with('success', 'Cabang berhasil diperbarui.');
    }

    public function destroyBranch(Branch $branch)
    {
        $user = $this->getOwner();
        abort_if($branch->company_id !== $user->company_id, 403);
        abort_if($branch->is_main, 403, 'Cabang utama tidak bisa dihapus.');

        $branch->delete();

        return back()->with('success', 'Cabang berhasil dihapus.');
    }
}
