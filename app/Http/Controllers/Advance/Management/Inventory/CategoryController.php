<?php

namespace App\Http\Controllers\Advance\Management\Inventory;

use App\Http\Controllers\Controller;
use App\Models\Advance\Management\Inventory\Category;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class CategoryController extends Controller
{
    private const COLOR_PALETTE = ['#3d8ab8', '#16a34a', '#e75f1a', '#9f6fd5', '#dc2626', '#0891b2', '#ca8a04', '#db2777'];

    public function index(Request $request)
    {
        /** @var User $user */
        $user = Auth::user();

        $categories = Category::where('company_id', $user->company_id)
            ->withCount('items')
            ->when($request->search, function ($query) use ($request) {
                $query->where('name', 'like', '%' . $request->search . '%');
            })
            ->when($request->status && $request->status !== 'all', function ($query) use ($request) {
                $query->where('is_active', $request->status === 'active');
            })
            ->paginate(5)
            ->withQueryString();

        return Inertia::render('advance/management/inventory/inventory-category', [
            'categories' => $categories,
            'filters' => $request->only('search', 'status'),
            'can_manage_catalog' => $user->isOwner(),
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
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('inventory_categories', 'name')->where(fn($q) => $q->where('company_id', $user->company_id)),
            ],
            'color' => ['nullable', 'regex:/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/'],
        ]);

        $validated['company_id'] = $user->company_id;
        $validated['color'] = $validated['color'] ?? $this->resolveAutoColor($user->company_id);

        Category::create($validated);

        return redirect()->route('dashboard.inventory.categories.index')->with('success', 'Kategori berhasil ditambahkan!');
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

        $category = Category::where('company_id', $user->company_id)->findOrFail($id);

        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('inventory_categories', 'name')
                    ->where(fn($q) => $q->where('company_id', $user->company_id))
                    ->ignore($category->id),
            ],
            'color' => ['required', 'regex:/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/'],
        ]);

        $category->update($validated);

        return redirect()->route('dashboard.inventory.categories.index')->with('success', 'Kategori berhasil diperbarui!');
    }

    public function destroy(string $id)
    {
        /** @var User $user */
        $user = Auth::user();
        abort_if(!$user->isOwner(), 403);

        $category = Category::where('company_id', $user->company_id)->withCount('items')->findOrFail($id);

        if ($category->items_count > 0) {
            // Masih dipakai barang lain — jangan dihapus permanen, cukup nonaktifkan.
            $category->update(['is_active' => false]);

            return redirect()->route('dashboard.inventory.categories.index')
                ->with('success', 'Kategori dinonaktifkan karena masih dipakai oleh ' . $category->items_count . ' barang.');
        }

        $category->delete();

        return redirect()->route('dashboard.inventory.categories.index')->with('success', 'Kategori berhasil dihapus!');
    }

    private function resolveAutoColor(int $companyId): string
    {
        $index = Category::where('company_id', $companyId)->count() % count(self::COLOR_PALETTE);

        return self::COLOR_PALETTE[$index];
    }
    public function toggleActive(string $id)
    {
        /** @var User $user */
        $user = Auth::user();
        abort_if(!$user->isOwner(), 403);

        $category = Category::where('company_id', $user->company_id)->findOrFail($id);
        $category->update(['is_active' => !$category->is_active]);

        return redirect()->route('dashboard.inventory.categories.index')
            ->with('success', $category->is_active ? 'Kategori diaktifkan kembali!' : 'Kategori dinonaktifkan.');
    }
}
