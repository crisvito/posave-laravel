<?php

namespace App\Http\Controllers\Advance\Cashier;

use App\Http\Controllers\Controller;
use App\Models\Advance\Management\Inventory\BranchStock;
use App\Models\Advance\Management\Inventory\Category;
use App\Models\Advance\Management\Inventory\Item;
use App\Models\Advance\Transaction\Transaction;
use App\Models\Advance\Transaction\TransactionItem;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index()
    {
        /** @var User $user */
        $user = Auth::user();
        $user->load('company.profile', 'company.receiptSetting');

        $items = Item::with('category')
            ->where('company_id', $user->company_id)
            ->where('is_active', true)
            ->get()
            ->map(function (Item $item) use ($user) {
                $stock = BranchStock::where('branch_id', $user->branch_id)
                    ->where('inventory_item_id', $item->id)
                    ->first();

                return [
                    'id' => $item->id,
                    'name' => $item->name,
                    'price' => (float) $item->price,
                    'category_id' => $item->category_id,
                    'category_name' => $item->category->name,
                    'image' => $item->image,
                    'available_stock' => $stock->current_stock ?? 0,
                ];
            })
            ->values();

        $categories = Category::where('company_id', $user->company_id)
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('advance/cashier/order/order', [
            'items' => $items,
            'categories' => $categories,
            'company_profile' => $user->company->profile,
            'receipt_notes' => $user->company->receiptSetting?->notes,
        ]);
    }

    public function store(Request $request)
    {
        /** @var User $user */
        $user = Auth::user();

        $validated = $request->validate([
            'items' => 'required|array|min:1',
            'items.*.item_id' => 'required|integer|exists:inventory_items,id',
            'items.*.qty' => 'required|integer|min:1',
            'items.*.note' => 'nullable|string|max:500',
            'payment_method' => 'required|in:cash,qris,debit,transfer',
        ]);

        try {
            $transaction = DB::transaction(function () use ($validated, $user) {
                $gross = 0;
                $cogs = 0;
                $lineRows = [];

                foreach ($validated['items'] as $line) {
                    $stock = BranchStock::where('branch_id', $user->branch_id)
                        ->where('inventory_item_id', $line['item_id'])
                        ->lockForUpdate()
                        ->first();

                    $item = Item::with('category')->findOrFail($line['item_id']);

                    if (! $stock || $stock->current_stock < $line['qty']) {
                        throw ValidationException::withMessages([
                            'items' => "Stok {$item->name} tidak mencukupi.",
                        ]);
                    }

                    $unitPrice = (float) $item->price;
                    $unitCost = (float) $item->cost;
                    $lineSubtotal = $unitPrice * $line['qty'];

                    $gross += $lineSubtotal;
                    $cogs += $unitCost * $line['qty'];

                    $lineRows[] = [
                        'item_id' => $item->id,
                        'product_name' => $item->name,
                        'category_name' => $item->category->name,
                        'qty' => $line['qty'],
                        'unit_price' => $unitPrice,
                        'unit_cost' => $unitCost,
                        'discount_amount' => 0,
                        'subtotal' => $lineSubtotal,
                        'note' => $line['note'] ?? null,
                    ];

                    $stock->decrement('current_stock', $line['qty']);
                }

                $transaction = Transaction::create([
                    'branch_id' => $user->branch_id,
                    'user_id' => $user->id,
                    'invoice_no' => 'PENDING-' . uniqid(),
                    'status' => 'completed',
                    'payment_method' => $validated['payment_method'],
                    'gross_amount' => $gross,
                    'discount_amount' => 0,
                    'refund_amount' => 0,
                    'tax_amount' => 0,
                    'gratuity_amount' => 0,
                    'rounding_amount' => 0,
                    'cogs_amount' => $cogs,
                    'total_amount' => $gross,
                    'transacted_at' => now(),
                ]);

                $transaction->update([
                    'invoice_no' => sprintf('INV/%s/%05d', now()->format('Ymd'), $transaction->id),
                ]);

                foreach ($lineRows as $row) {
                    $row['transaction_id'] = $transaction->id;
                    TransactionItem::create($row);
                }

                return $transaction;
            });
        } catch (ValidationException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }

        return response()->json([
            'success' => true,
            'invoice_no' => $transaction->invoice_no,
            'total' => (float) $transaction->total_amount,
        ]);
    }
}
