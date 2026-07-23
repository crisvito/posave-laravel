<?php

namespace App\Http\Controllers\Advance\Management\Inventory;

use App\Http\Controllers\Controller;
use App\Models\Advance\Management\Inventory\Adjustment;
use App\Models\Advance\Management\Inventory\BranchStock;
use App\Models\Advance\Management\Inventory\Item;
use App\Models\Auth\Branch;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AdjustmentController extends Controller
{
    public function index(Request $request)
    {
        /** @var User $user */
        $user = Auth::user();

        $date = $request->date ?? now()->toDateString();
        $branchId = $user->isBranchManager() ? $user->branch_id : ($request->integer('branch_id') ?: null);

        $adjustments = Adjustment::with(['item', 'branch'])
            ->whereHas('item', fn($q) => $q->where('company_id', $user->company_id))
            ->whereDate('date', $date)
            ->when($branchId, fn($q) => $q->where('branch_id', $branchId))
            ->when($request->search, function ($query) use ($request) {
                $query->whereHas('item', function ($q) use ($request) {
                    $q->where('name', 'like', '%' . $request->search . '%')
                        ->orWhere('sku', 'like', '%' . $request->search . '%');
                });
            })
            ->when($request->status, function ($query) use ($request) {
                if ($request->status === 'in') {
                    $query->where('qty_change', '>', 0);
                } elseif ($request->status === 'out') {
                    $query->where('qty_change', '<', 0);
                }
            })
            ->latest()
            ->paginate(6)
            ->withQueryString();

        // Statistik ikut ke-scope ke cabang yang sama kayak list-nya —
        // di versi lama ini kelewat, statistiknya selalu global walau list-nya difilter.
        $statsBase = Adjustment::whereHas('item', fn($q) => $q->where('company_id', $user->company_id))
            ->whereDate('date', $date)
            ->when($branchId, fn($q) => $q->where('branch_id', $branchId));

        $stats = [
            'total_changes' => (clone $statsBase)->count(),
            'items_changed' => (clone $statsBase)->distinct('inventory_item_id')->count('inventory_item_id'),
            'total_income' => (float) (clone $statsBase)->where('financial_change', '>', 0)->sum('financial_change'),
            'total_expense' => (float) (clone $statsBase)->where('financial_change', '<', 0)->sum('financial_change'),
        ];

        $inventoryItems = Item::where('company_id', $user->company_id)->where('is_active', true)->select('id', 'name', 'sku', 'price')->get();

        $branches = $user->isBranchManager()
            ? Branch::where('id', $user->branch_id)->get(['id', 'name'])
            : Branch::where('company_id', $user->company_id)->get(['id', 'name']);

        return Inertia::render('advance/management/inventory/inventory-adjustment', [
            'adjustments' => $adjustments,
            'stats' => $stats,
            'inventoryItems' => $inventoryItems,
            'branches' => $branches,
            'is_branch_manager' => $user->isBranchManager(),
            'filters' => $request->only('date', 'search', 'branch_id', 'status'),
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

        $validated = $request->validate([
            'inventory_item_id' => 'required|exists:inventory_items,id',
            'branch_id' => 'required|exists:branches,id',
            'note' => 'required|string|max:255',
            'type' => 'required|in:in,out',
            'quantity' => 'required|integer|min:1',
            'date' => 'required|date',
        ]);

        if ($user->isBranchManager()) {
            abort_if((int) $validated['branch_id'] !== $user->branch_id, 403);
        }

        $item = Item::where('company_id', $user->company_id)->findOrFail($validated['inventory_item_id']);
        $branch = Branch::where('id', $validated['branch_id'])->where('company_id', $user->company_id)->firstOrFail();

        $qtyChange = $validated['type'] === 'in' ? $validated['quantity'] : -$validated['quantity'];

        DB::transaction(function () use ($validated, $branch, $item, $qtyChange) {
            $stock = BranchStock::firstOrCreate(
                ['branch_id' => $branch->id, 'inventory_item_id' => $item->id],
                ['current_stock' => 0, 'min_stock' => 0],
            );
            $stock->update(['current_stock' => max(0, $stock->current_stock + $qtyChange)]);

            Adjustment::create([
                'inventory_item_id' => $item->id,
                'branch_id' => $branch->id,
                'note' => $validated['note'],
                'qty_change' => $qtyChange,
                'financial_change' => $qtyChange * (float) $item->price,
                'date' => $validated['date'],
            ]);
        });

        return redirect()->route('dashboard.inventory.adjustments.index')->with('success', 'Perubahan stok berhasil dicatat!');
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
        //
    }

    public function destroy(string $id)
    {
        /** @var User $user */
        $user = Auth::user();

        $adjustment = Adjustment::with('item')
            ->whereHas('item', fn($q) => $q->where('company_id', $user->company_id))
            ->findOrFail($id);

        if ($user->isBranchManager()) {
            abort_if($adjustment->branch_id !== $user->branch_id, 403);
        }

        // Balikin efek stoknya sebelum hapus record — dari BranchStock, bukan Item.
        DB::transaction(function () use ($adjustment) {
            $stock = BranchStock::where('branch_id', $adjustment->branch_id)
                ->where('inventory_item_id', $adjustment->inventory_item_id)
                ->first();

            if ($stock) {
                $stock->update(['current_stock' => max(0, $stock->current_stock - $adjustment->qty_change)]);
            }

            $adjustment->delete();
        });

        return redirect()->route('dashboard.inventory.adjustments.index')->with('success', 'Riwayat perubahan berhasil dihapus!');
    }
}
