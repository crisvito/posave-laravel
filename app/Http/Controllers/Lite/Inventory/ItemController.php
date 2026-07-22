<?php

namespace App\Http\Controllers\Lite\Inventory;

use App\Http\Controllers\Controller;
use App\Models\Advance\Management\Inventory\BranchStock;
use App\Models\Advance\Management\Inventory\Category;
use App\Models\Advance\Management\Inventory\Item;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ItemController extends Controller
{
    public function index(Request $request)
    {
        /** @var User $owner */
        $owner = Auth::user();
        $branchId = $owner->branch_id;

        $perPage = (int) ($request->per_page ?? 6);

        $itemsQuery = Item::with(['category', 'branchStocks' => fn($q) => $q->where('branch_id', $branchId)])
            ->where('company_id', $owner->company_id)
            ->when($request->search, fn($q) => $q->where(function ($qq) use ($request) {
                $qq->where('name', 'like', '%' . $request->search . '%')
                    ->orWhere('sku', 'like', '%' . $request->search . '%');
            }))
            ->when($request->category_id, fn($q) => $q->where('category_id', $request->category_id));

        if ($request->stock_status && $request->stock_status !== 'all') {
            match ($request->stock_status) {
                'out' => $itemsQuery->where(function ($q) use ($branchId) {
                    $q->whereDoesntHave('branchStocks', fn($qq) => $qq->where('branch_id', $branchId))
                        ->orWhereHas('branchStocks', fn($qq) => $qq->where('branch_id', $branchId)->where('current_stock', 0));
                }),
                'low' => $itemsQuery->whereHas('branchStocks', fn($qq) => $qq->where('branch_id', $branchId)
                    ->where('current_stock', '>', 0)
                    ->whereColumn('current_stock', '<=', 'min_stock')),
                'safe' => $itemsQuery->whereHas('branchStocks', fn($qq) => $qq->where('branch_id', $branchId)
                    ->whereColumn('current_stock', '>', 'min_stock')),
                default => null,
            };
        }

        $items = $itemsQuery->paginate($perPage)->withQueryString();

        $items->getCollection()->transform(function (Item $item) {
            $stock = $item->branchStocks->first();
            $item->current_stock = $stock->current_stock ?? 0;
            $item->min_stock = $stock->min_stock ?? 0;
            return $item;
        });

        $allItems = Item::where('company_id', $owner->company_id)
            ->with(['branchStocks' => fn($q) => $q->where('branch_id', $branchId)])
            ->get();

        $outOfStockCount = 0;
        $lowStockCount = 0;

        foreach ($allItems as $item) {
            $stock = $item->branchStocks->first();
            $current = $stock->current_stock ?? 0;
            $min = $stock->min_stock ?? 0;

            if ($current === 0) {
                $outOfStockCount++;
            } elseif ($current <= $min) {
                $lowStockCount++;
            }
        }

        $summary = [
            'out_of_stock' => $outOfStockCount,
            'low_stock' => $lowStockCount,
        ];

        $categories = Category::where('company_id', $owner->company_id)->orderBy('name')->get(['id', 'name', 'color']);

        return Inertia::render('lite/inventory/item-list', [
            'items' => $items,
            'categories' => $categories,
            'summary' => $summary,
            'filters' => $request->only('search', 'category_id', 'stock_status', 'per_page'),
        ]);
    }

    public function store(Request $request)
    {
        /** @var User $owner */
        $owner = Auth::user();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:inventory_categories,id',
            'price' => 'nullable|numeric|min:0',
            'current_stock' => 'nullable|integer|min:0',
            'min_stock' => 'nullable|integer|min:0',
        ]);

        $item = Item::create([
            'company_id' => $owner->company_id,
            'name' => $validated['name'],
            'category_id' => $validated['category_id'],
            'price' => $validated['price'] ?? 0,
            'sku' => Item::generateSku(),
        ]);

        BranchStock::create([
            'branch_id' => $owner->branch_id,
            'inventory_item_id' => $item->id,
            'current_stock' => $validated['current_stock'] ?? 0,
            'min_stock' => $validated['min_stock'] ?? 0,
        ]);

        return redirect()->route('lite.inventory.items.index')->with('success', 'Barang berhasil ditambahkan!');
    }

    public function update(Request $request, string $id)
    {
        /** @var User $owner */
        $owner = Auth::user();
        $item = Item::where('company_id', $owner->company_id)->findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:inventory_categories,id',
            'price' => 'required|numeric|min:0',
        ]);

        $item->update([
            'name' => $validated['name'],
            'category_id' => $validated['category_id'],
            'price' => $validated['price'],
        ]);

        return redirect()->route('lite.inventory.items.index')->with('success', 'Barang berhasil diperbarui!');
    }

    public function destroy(string $id)
    {
        /** @var User $owner */
        $owner = Auth::user();
        $item = Item::where('company_id', $owner->company_id)->findOrFail($id);

        if ($item->image) {
            Storage::disk('public')->delete($item->image);
        }
        $item->delete();

        return redirect()->route('lite.inventory.items.index')->with('success', 'Barang berhasil dihapus!');
    }
}
