<?php

namespace App\Http\Controllers\Advance\Management\Inventory;

use App\Http\Controllers\Controller;
use App\Models\Advance\Management\Inventory\BranchStock;
use App\Models\Advance\Management\Inventory\Category;
use App\Models\Advance\Management\Inventory\Item;
use App\Models\Auth\Branch;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ItemController extends Controller
{
    public function index(Request $request)
    {
        /** @var User $user */
        $user = Auth::user();

        // Branch manager: selalu cabangnya sendiri, gak peduli query param.
        // Owner: boleh pilih cabang lewat dropdown, atau kosongin buat lihat semua.
        $branchId = $user->isBranchManager() ? $user->branch_id : ($request->integer('branch_id') ?: null);

        $itemsQuery = Item::with('category')
            ->where('company_id', $user->company_id)
            ->when($request->search, function ($query) use ($request) {
                $query->where(function ($q) use ($request) {
                    $q->where('name', 'like', '%' . $request->search . '%')
                        ->orWhere('sku', 'like', '%' . $request->search . '%');
                });
            })
            ->when($request->category_id, function ($query) use ($request) {
                $query->where('category_id', $request->category_id);
            });

        if ($branchId) {
            $itemsQuery->with(['branchStocks' => fn($q) => $q->where('branch_id', $branchId)]);
        } else {
            $itemsQuery->withSum('branchStocks as current_stock_sum', 'current_stock')
                ->withSum('branchStocks as min_stock_sum', 'min_stock');
        }

        $items = $itemsQuery->paginate($request->integer('per_page') ?: 6)->withQueryString();

        $items->getCollection()->transform(function ($item) use ($branchId) {
            if ($branchId) {
                $stock = $item->branchStocks->first();
                $item->current_stock = $stock->current_stock ?? 0;
                $item->min_stock = $stock->min_stock ?? 0;
            } else {
                $item->current_stock = (int) ($item->current_stock_sum ?? 0);
                $item->min_stock = (int) ($item->min_stock_sum ?? 0);
            }
            return $item;
        });

        $categories = Category::where('company_id', $user->company_id)->select('id', 'name')->get();

        $branches = $user->isBranchManager()
            ? Branch::where('id', $user->branch_id)->select('id', 'name')->get()
            : Branch::where('company_id', $user->company_id)->select('id', 'name')->get();

        return Inertia::render('advance/management/inventory/inventory-item', [
            'items' => $items,
            'categories' => $categories,
            'branches' => $branches,
            'filters' => $request->only('search', 'category_id', 'branch_id', 'per_page'),
            'is_branch_manager' => $user->isBranchManager(),
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

        // Katalog (nama/harga/kategori/barang baru) itu keputusan level company —
        // cuma Owner yang boleh, branch_manager gak boleh sentuh sama sekali.
        abort_if(!$user->isOwner(), 403);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:inventory_categories,id',
            'branch_id' => 'required|exists:branches,id',
            'price' => 'nullable|numeric|min:0',
            'current_stock' => 'nullable|integer|min:0',
            'min_stock' => 'nullable|integer|min:0',
            'image' => 'nullable|image|max:2048',
        ]);

        $branch = Branch::where('id', $validated['branch_id'])
            ->where('company_id', $user->company_id)
            ->firstOrFail();

        $itemData = [
            'company_id' => $user->company_id,
            'name' => $validated['name'],
            'category_id' => $validated['category_id'],
            'price' => $validated['price'] ?? 0,
            'sku' => Item::generateSku(),
        ];

        if ($request->hasFile('image')) {
            $itemData['image'] = $request->file('image')->store('inventory', 'public');
        }

        $item = Item::create($itemData);

        BranchStock::create([
            'branch_id' => $branch->id,
            'inventory_item_id' => $item->id,
            'current_stock' => $validated['current_stock'] ?? 0,
            'min_stock' => $validated['min_stock'] ?? 0,
        ]);

        return redirect()->route('dashboard.inventory.items.index')->with('success', 'Barang berhasil ditambahkan!');
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

        $item = Item::where('company_id', $user->company_id)->findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:inventory_categories,id',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'price' => 'required|numeric|min:0',
            'branch_id' => 'nullable|exists:branches,id',
            'current_stock' => 'nullable|integer|min:0',
            'min_stock' => 'nullable|integer|min:0',
        ]);

        $updateData = [
            'name' => $validated['name'],
            'category_id' => $validated['category_id'],
            'price' => $validated['price'],
        ];

        if ($request->hasFile('image')) {
            if ($item->image) {
                Storage::disk('public')->delete($item->image);
            }
            $updateData['image'] = $request->file('image')->store('inventory', 'public');
        }

        $item->update($updateData);

        if (!empty($validated['branch_id'])) {
            $branch = Branch::where('id', $validated['branch_id'])
                ->where('company_id', $user->company_id)
                ->firstOrFail();

            BranchStock::updateOrCreate(
                ['branch_id' => $branch->id, 'inventory_item_id' => $item->id],
                ['current_stock' => $validated['current_stock'] ?? 0, 'min_stock' => $validated['min_stock'] ?? 0],
            );
        }

        return redirect()->route('dashboard.inventory.items.index')->with('success', 'Barang berhasil diperbarui!');
    }

    public function destroy(string $id)
    {
        /** @var User $user */
        $user = Auth::user();
        abort_if(!$user->isOwner(), 403);

        $item = Item::where('company_id', $user->company_id)->findOrFail($id);

        $hasHistory = $item->transactionItems()->exists()
            || $item->adjustments()->exists()
            || \App\Models\Advance\Management\Inventory\PurchaseOrderItem::where('inventory_item_id', $item->id)->exists()
            || \App\Models\Advance\Management\Inventory\TransferItem::where('inventory_item_id', $item->id)->exists();

        if ($hasHistory) {
            // Barang ini sudah pernah muncul di transaksi/riwayat lain — jangan dihapus permanen
            // (nanti riwayat lama jadi patah/kehilangan nama barangnya). Cukup nonaktifkan.
            $item->update(['is_active' => false]);

            return redirect()->route('dashboard.inventory.items.index')
                ->with('success', 'Barang dinonaktifkan. Riwayat transaksinya tetap tersimpan, tapi barang ini tidak akan muncul lagi saat membuat transaksi baru.');
        }

        // Belum pernah dipakai sama sekali — aman dihapus permanen.
        if ($item->image) {
            Storage::disk('public')->delete($item->image);
        }
        $item->delete();

        return redirect()->route('dashboard.inventory.items.index')->with('success', 'Barang berhasil dihapus!');
    }

    /** Stepper +/- stok — ini yang boleh dipakai branch_manager (dan Owner). */
    public function adjustStock(Request $request, string $id)
    {
        /** @var User $user */
        $user = Auth::user();
        $item = Item::where('company_id', $user->company_id)->findOrFail($id);

        $validated = $request->validate(['delta' => 'required|integer']);

        $branchId = $user->isBranchManager() ? $user->branch_id : $request->integer('branch_id');
        abort_if(!$branchId, 422, 'Pilih cabang dulu.');

        if (!$user->isBranchManager()) {
            Branch::where('id', $branchId)->where('company_id', $user->company_id)->firstOrFail();
        }

        $stock = BranchStock::firstOrCreate(
            ['branch_id' => $branchId, 'inventory_item_id' => $item->id],
            ['current_stock' => 0, 'min_stock' => 0],
        );

        $newStock = max(0, $stock->current_stock + $validated['delta']);
        $stock->update(['current_stock' => $newStock]);

        return response()->json(['current_stock' => $newStock]);
    }
}
