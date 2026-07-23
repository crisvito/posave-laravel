<?php

namespace App\Http\Controllers\Advance\Management\Inventory;

use App\Http\Controllers\Controller;
use App\Models\Advance\Management\Inventory\BranchStock;
use App\Models\Advance\Management\Inventory\Item;
use App\Models\Advance\Management\Inventory\PurchaseOrder;
use App\Models\Advance\Management\Inventory\PurchaseOrderItem;
use App\Models\Advance\Management\Inventory\Supplier;
use App\Models\Auth\Branch;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PurchaseOrderController extends Controller
{
    public function index(Request $request)
    {
        /** @var User $user */
        $user = Auth::user();

        $poQuery = PurchaseOrder::with(['supplier', 'branch'])
            ->withCount('items')
            ->where('company_id', $user->company_id);

        if ($user->isBranchManager()) {
            $poQuery->where('branch_id', $user->branch_id);
        } else {
            $poQuery->when($request->branch_id, fn($q) => $q->where('branch_id', $request->branch_id));
        }

        $poQuery
            ->when($request->date, fn($q) => $q->whereDate('date', $request->date))
            ->when($request->status, fn($q) => $q->where('status', $request->status))
            ->when($request->search, fn($q) => $q->where('po_number', 'like', '%' . $request->search . '%'));

        $purchaseOrders = $poQuery->orderByDesc('date')->orderByDesc('id')->paginate($request->per_page ?? 6)->withQueryString();

        $branches = $user->isBranchManager()
            ? Branch::where('id', $user->branch_id)->get(['id', 'name'])
            : Branch::where('company_id', $user->company_id)->get(['id', 'name']);

        $inventoryItems = Item::where('company_id', $user->company_id)->where('is_active', true)->select('id', 'name', 'sku', 'price')->get();

        // Ambil harga beli PALING TERAKHIR per barang, dari riwayat PO — bukan dari Item.cost
        // (Item tidak punya konsep harga modal statis; harga beli sepenuhnya hidup di riwayat PO).
        $lastPurchasePrices = PurchaseOrderItem::query()
            ->select('purchase_order_items.inventory_item_id', 'purchase_order_items.price')
            ->join('purchase_orders', 'purchase_orders.id', '=', 'purchase_order_items.purchase_order_id')
            ->where('purchase_orders.company_id', $user->company_id)
            ->whereIn('purchase_order_items.inventory_item_id', $inventoryItems->pluck('id'))
            ->orderByDesc('purchase_order_items.id')
            ->get()
            ->unique('inventory_item_id')
            ->pluck('price', 'inventory_item_id');

        return Inertia::render('advance/management/inventory/inventory-po', [
            'purchaseOrders' => $purchaseOrders,
            'suppliers' => Supplier::where('company_id', $user->company_id)->where('is_active', true)->select('id', 'name')->get(),
            'inventoryItems' => $inventoryItems,
            'lastPurchasePrices' => $lastPurchasePrices,
            'branches' => $branches,
            'my_branch_id' => $user->branch_id,
            'is_branch_manager' => $user->isBranchManager(),
            'filters' => $request->only('branch_id', 'date', 'status', 'search', 'per_page'),
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
            'branch_id' => 'required|exists:branches,id',
            'supplier_id' => 'required|exists:suppliers,id',
            'date' => 'required|date',
            'items' => 'required|array|min:1',
            'items.*.inventory_item_id' => 'required|exists:inventory_items,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric|min:0',
        ]);

        $branch = Branch::where('id', $validated['branch_id'])->where('company_id', $user->company_id)->firstOrFail();
        $supplier = Supplier::where('id', $validated['supplier_id'])->where('company_id', $user->company_id)->firstOrFail();

        if ($user->isBranchManager()) {
            abort_if($branch->id !== $user->branch_id, 403);
        }

        DB::transaction(function () use ($validated, $branch, $supplier, $user) {
            $totalPrice = 0;
            foreach ($validated['items'] as $item) {
                $totalPrice += $item['quantity'] * $item['price'];
            }

            $po = PurchaseOrder::create([
                'company_id' => $user->company_id,
                'po_number' => 'PENDING-' . uniqid(),
                'branch_id' => $branch->id,
                'supplier_id' => $supplier->id,
                'total_price' => $totalPrice,
                'date' => $validated['date'],
                'status' => 'waiting_fulfilment',
            ]);

            $po->update(['po_number' => 'PO-' . str_pad($po->id, 4, '0', STR_PAD_LEFT)]);

            foreach ($validated['items'] as $item) {
                $po->items()->create($item);
            }
        });

        return redirect()->route('dashboard.inventory.purchase-orders.index')->with('success', 'PO berhasil dibuat!');
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
        $po = PurchaseOrder::with('items')->where('company_id', $user->company_id)->findOrFail($id);

        if ($user->isBranchManager()) {
            abort_if($po->branch_id !== $user->branch_id, 403);
        }

        $validated = $request->validate(['status' => 'required|in:waiting_fulfilment,success,cancelled']);
        abort_if($po->status !== 'waiting_fulfilment', 422, 'PO ini sudah diputuskan sebelumnya.');

        DB::transaction(function () use ($po, $validated) {
            if ($validated['status'] === 'success') {
                foreach ($po->items as $line) {
                    $stock = BranchStock::firstOrCreate(
                        ['branch_id' => $po->branch_id, 'inventory_item_id' => $line->inventory_item_id],
                        ['current_stock' => 0, 'min_stock' => 0],
                    );
                    $stock->increment('current_stock', $line->quantity);
                }
            }

            $po->update(['status' => $validated['status']]);
        });

        return redirect()->route('dashboard.inventory.purchase-orders.index')->with('success', 'Status PO berhasil diperbarui!');
    }

    public function destroy(string $id)
    {
        /** @var User $user */
        $user = Auth::user();
        $po = PurchaseOrder::where('company_id', $user->company_id)->findOrFail($id);

        if ($user->isBranchManager()) {
            abort_if($po->branch_id !== $user->branch_id, 403);
        }

        abort_if($po->status === 'success', 422, 'PO yang sudah selesai tidak bisa dihapus — stoknya sudah tercatat dan mungkin sudah terpakai. Gunakan Perubahan Stok untuk koreksi.');

        $po->delete();

        return redirect()->route('dashboard.inventory.purchase-orders.index')->with('success', 'PO berhasil dihapus!');
    }
}
