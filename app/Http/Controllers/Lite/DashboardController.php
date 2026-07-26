<?php

namespace App\Http\Controllers\Lite;

use App\Http\Controllers\Controller;
use App\Models\Advance\Management\Inventory\BranchStock;
use App\Models\Advance\Management\Inventory\Item;
use App\Models\Advance\Transaction\Transaction;
use App\Models\Advance\Transaction\TransactionItem;
use App\Models\User;
use App\Support\SalesFilter;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        /** @var User $user */
        $user = Auth::user();
        $branchId = $user->branch_id;

        $filter = SalesFilter::fromRequest($request);

        $base = Transaction::query()
            ->revenue()
            ->where('branch_id', $branchId)
            ->withinPeriod($filter->start, $filter->end);

        $totalSales = (float) (clone $base)->sum('total_amount');
        $totalTransactions = (clone $base)->count();

        $itemBase = TransactionItem::query()
            ->join('transactions', 'transactions.id', '=', 'transaction_items.transaction_id')
            ->where('transactions.status', '!=', 'void')
            ->where('transactions.branch_id', $branchId)
            ->whereBetween('transactions.transacted_at', [$filter->start, $filter->end]);

        $productsSold = (int) (clone $itemBase)->sum('transaction_items.qty');

        $topItems = (clone $itemBase)
            ->selectRaw('transaction_items.product_name as name, SUM(transaction_items.qty) as qty, SUM(transaction_items.subtotal) as omzet')
            ->groupBy('transaction_items.product_name')
            ->orderByDesc('qty')
            ->limit(5)
            ->get()
            ->map(fn($r) => ['name' => $r->name, 'qty' => (int) $r->qty, 'omzet' => (float) $r->omzet])
            ->all();

        // Ringkasan stok — logic yang SAMA persis kayak di Daftar Barang,
        // biar angkanya selalu konsisten di mana pun ditampilkan.
        $allItemIds = Item::where('company_id', $user->company_id)->pluck('id');
        $stocks = BranchStock::where('branch_id', $branchId)->whereIn('inventory_item_id', $allItemIds)->get();

        $stockSummary = [
            'out_of_stock' => $stocks->where('current_stock', 0)->count(),
            'low_stock' => $stocks->filter(fn($s) => $s->current_stock > 0 && $s->current_stock <= $s->min_stock)->count(),
        ];

        $recentTransactions = (clone $base)
            ->latest('transacted_at')
            ->limit(5)
            ->get(['id', 'invoice_no', 'total_amount', 'payment_method', 'transacted_at'])
            ->map(fn(Transaction $t) => [
                'invoice' => $t->invoice_no,
                'total' => (float) $t->total_amount,
                'payment' => $t->payment_method,
                'time' => Carbon::parse($t->transacted_at)->translatedFormat('d M, H:i'),
            ])
            ->all();

        return Inertia::render('lite/dashboard/dashboard', [
            'filters' => $filter->toArray(),
            'kpis' => [
                'totalSales' => $totalSales,
                'totalTransactions' => $totalTransactions,
                'productsSold' => $productsSold,
            ],
            'stockSummary' => $stockSummary,
            'topItems' => $topItems,
            'recentTransactions' => $recentTransactions,
        ]);
    }
}
