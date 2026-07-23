<?php

namespace App\Http\Controllers\Advance\Management\Inventory;

use App\Http\Controllers\Controller;
use App\Models\Advance\Management\Inventory\Category;
use App\Models\Advance\Management\Inventory\Supplier;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class SupplierController extends Controller
{
    public function index(Request $request)
    {
        /** @var User $user */
        $user = Auth::user();

        $suppliers = Supplier::with('category')
            ->where('company_id', $user->company_id)
            ->when($request->search, fn($q) => $q->where('name', 'like', '%' . $request->search . '%'))
            ->when($request->category_id, fn($q) => $q->where('category_id', $request->category_id))
            ->when($request->status && $request->status !== 'all', function ($q) use ($request) {
                $q->where('is_active', $request->status === 'active');
            })
            ->paginate($request->per_page ?? 6)
            ->withQueryString();

        return Inertia::render('advance/management/inventory/inventory-supplier', [
            'suppliers' => $suppliers,
            'categories' => Category::where('company_id', $user->company_id)->where('is_active', true)->select('id', 'name')->get(),
            'is_branch_manager' => $user->isBranchManager(),
            'filters' => $request->only('search', 'per_page', 'category_id', 'status'),
        ]);
    }

    public function create()
    {
        //
    }

    public function store(Request $request)
    {
        /** @var User $user */
        $user = Auth::user();
        abort_if(!$user->isOwner(), 403);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'nullable|exists:inventory_categories,id',
            'address' => 'nullable|string|max:500',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'logo' => 'nullable|image|max:2048',
        ]);

        $data = $validated;
        $data['company_id'] = $user->company_id;

        if ($request->hasFile('logo')) {
            $data['logo'] = $request->file('logo')->store('suppliers', 'public');
        }

        Supplier::create($data);

        return redirect()->route('dashboard.inventory.suppliers.index')->with('success', 'Pemasok berhasil ditambahkan!');
    }

    public function show(string $id)
    {
        //
    }

    public function edit(string $id)
    {
        //
    }

    public function update(Request $request, string $id)
    {
        /** @var User $user */
        $user = Auth::user();
        abort_if(!$user->isOwner(), 403);

        $supplier = Supplier::where('company_id', $user->company_id)->findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'nullable|exists:inventory_categories,id',
            'address' => 'nullable|string|max:500',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'logo' => 'nullable|image|max:2048',
        ]);

        $data = $validated;

        if ($request->hasFile('logo')) {
            if ($supplier->logo) {
                Storage::disk('public')->delete($supplier->logo);
            }
            $data['logo'] = $request->file('logo')->store('suppliers', 'public');
        }

        $supplier->update($data);

        return redirect()->route('dashboard.inventory.suppliers.index')->with('success', 'Pemasok berhasil diperbarui!');
    }

    public function destroy(string $id)
    {
        /** @var User $user */
        $user = Auth::user();
        abort_if(!$user->isOwner(), 403);

        $supplier = Supplier::where('company_id', $user->company_id)->withCount('purchaseOrders')->findOrFail($id);

        if ($supplier->purchase_orders_count > 0) {
            // Masih punya riwayat pembelian — jangan dihapus permanen, cukup nonaktifkan.
            $supplier->update(['is_active' => false]);

            return redirect()->route('dashboard.inventory.suppliers.index')
                ->with('success', 'Pemasok dinonaktifkan karena masih memiliki riwayat pembelian.');
        }

        $supplier->delete();

        return redirect()->route('dashboard.inventory.suppliers.index')->with('success', 'Pemasok berhasil dihapus!');
    }
    public function toggleActive(string $id)
    {
        /** @var User $user */
        $user = Auth::user();
        abort_if(!$user->isOwner(), 403);

        $supplier = Supplier::where('company_id', $user->company_id)->findOrFail($id);
        $supplier->update(['is_active' => !$supplier->is_active]);

        return redirect()->route('dashboard.inventory.suppliers.index')
            ->with('success', $supplier->is_active ? 'Pemasok diaktifkan kembali!' : 'Pemasok dinonaktifkan.');
    }
}
