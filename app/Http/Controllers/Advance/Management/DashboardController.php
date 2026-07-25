<?php

namespace App\Http\Controllers\Advance\Management;

use App\Http\Controllers\Controller;
use App\Models\Advance\Management\Inventory\Category;
use App\Models\Advance\Transaction\Transaction;
use App\Models\Advance\Transaction\TransactionItem;
use App\Models\Auth\Branch;
use App\Models\Advance\Management\Inventory\Transfer;
use App\Models\User;
use App\Support\SalesFilter;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Collection;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        /** @var User $owner */
        $owner = Auth::user();

        $companyBranchIds = Branch::where('company_id', $owner->company_id)->pluck('id');

        $filter = SalesFilter::fromRequest($request);
        if ($owner->isBranchManager()) {
            $filter = new SalesFilter($owner->branch_id, $filter->start, $filter->end, $filter->preset);
        }
        [$prevStart, $prevEnd] = $filter->previousPeriod();

        $current = $this->metricsFor($companyBranchIds, $filter->outletId, $filter->start, $filter->end);
        $previous = $this->metricsFor($companyBranchIds, $filter->outletId, $prevStart, $prevEnd);

        $base = $this->baseQuery($companyBranchIds, $filter->outletId, $filter->start, $filter->end);
        $itemBase = $this->itemBase($companyBranchIds, $filter->outletId, $filter->start, $filter->end);

        $pendingTransfersCollection = Transfer::pendingApprovalFor($owner);

        $pendingTransfers = $pendingTransfersCollection->take(5)->map(fn(Transfer $t) => [
            'id' => $t->id,
            'transfer_number' => $t->transfer_number,
            'date' => $t->date,
            'items_count' => $t->items_count,
            'sender_branch_name' => $t->senderBranch->name,
            'receiver_branch_name' => $t->receiverBranch->name,
        ])->values();

        $pendingTransfersCount = $pendingTransfersCollection->count();

        return Inertia::render('advance/management/dashboard/dashboard', [
            'filters' => $filter->toArray(),
            'outlets' => $owner->isBranchManager()
                ? Branch::where('id', $owner->branch_id)->get(['id', 'name'])
                : Branch::where('company_id', $owner->company_id)->orderBy('name')->get(['id', 'name']),
            'pendingTransfers' => $pendingTransfers,
            'pendingTransfersCount' => $pendingTransfersCount,
            'kpis' => [
                'totalSales' => $this->kpi($current['totalSales'], $previous['totalSales']),
                'totalTransactions' => $this->kpi($current['totalTransactions'], $previous['totalTransactions']),
                'productsSold' => $this->kpi($current['productsSold'], $previous['productsSold']),
                'averageSale' => $this->kpi($current['averageSale'], $previous['averageSale']),
                'grossProfit' => $this->kpi($current['grossProfit'], $previous['grossProfit']),
                'margin' => $this->kpi($current['margin'], $previous['margin']),
            ],
            'salesTrend' => $this->salesTrend($companyBranchIds, $filter, $prevStart, $prevEnd),
            'hourlySales' => $this->hourlySales($base),
            'paymentBreakdown' => $this->paymentBreakdown($base),
            'categorySummary' => $this->categorySummary($itemBase, $owner->company_id),
            'topProducts' => $this->topProducts($itemBase),
            'recentTransactions' => $this->recentTransactions($base),
            'messaging' => $this->messagingSummary($owner),
        ]);
    }

    /** Query dasar transaksi: selalu dibatasi ke branch-branch company ini. */
    private function baseQuery(Collection $companyBranchIds, ?int $branchId, $start, $end)
    {
        return Transaction::query()
            ->revenue()
            ->whereIn('branch_id', $companyBranchIds)
            ->forBranch($branchId)
            ->withinPeriod($start, $end);
    }

    private function messagingSummary(User $owner): array
    {
        $conversations = $owner->conversations()
            ->with(['members', 'latestMessage.sender'])
            ->get()
            ->map(function ($conv) use ($owner) {
                $lastReadAt = $conv->pivot->last_read_at;

                $conv->unread_count = $conv->messages()
                    ->where('user_id', '!=', $owner->id)
                    ->when($lastReadAt, fn($q) => $q->where('created_at', '>', $lastReadAt))
                    ->count();

                return $conv;
            })
            ->sortByDesc(fn($c) => $c->latestMessage?->created_at)
            ->values();

        $items = $conversations->take(5)->map(fn($conv) => [
            'id' => $conv->id,
            'name' => $conv->name,
            'type' => $conv->type,
            'members' => $conv->members->map(fn($m) => ['id' => $m->id, 'name' => $m->name])->values(),
            'latest_message' => $conv->latestMessage ? [
                'body' => $conv->latestMessage->body,
                'sender' => ['id' => $conv->latestMessage->sender?->id, 'name' => $conv->latestMessage->sender?->name],
                'created_at' => $conv->latestMessage->created_at->toISOString(),
            ] : null,
            'unread_count' => $conv->unread_count,
        ])->values();

        return [
            'items' => $items,
            'total_unread' => $conversations->sum('unread_count'),
        ];
    }

    /** Query item yang sudah di-join + dibatasi ke branch-branch company ini. */
    private function itemBase(Collection $companyBranchIds, ?int $branchId, $start, $end)
    {
        return TransactionItem::query()
            ->join('transactions', 'transactions.id', '=', 'transaction_items.transaction_id')
            ->where('transactions.status', '!=', 'void')
            ->whereIn('transactions.branch_id', $companyBranchIds)
            ->when($branchId, fn($q) => $q->where('transactions.branch_id', $branchId))
            ->whereBetween('transactions.transacted_at', [$start, $end]);
    }

    private function metricsFor(Collection $companyBranchIds, ?int $branchId, $start, $end): array
    {
        $t = $this->baseQuery($companyBranchIds, $branchId, $start, $end)
            ->selectRaw(implode(', ', [
                'COUNT(*) as trx',
                'COALESCE(SUM(total_amount), 0) as total',
                'COALESCE(SUM(cogs_amount), 0) as cogs',
                'COALESCE(SUM(gross_amount - discount_amount - refund_amount), 0) as nett',
            ]))
            ->first();

        $qty = (int) $this->itemBase($companyBranchIds, $branchId, $start, $end)->sum('transaction_items.qty');

        $total = (float) $t->total;
        $trx = (int) $t->trx;
        $nett = (float) $t->nett;
        $profit = $nett - (float) $t->cogs;

        return [
            'totalSales' => $total,
            'totalTransactions' => $trx,
            'productsSold' => $qty,
            'averageSale' => $trx > 0 ? round($total / $trx) : 0,
            'grossProfit' => $profit,
            'margin' => $nett > 0 ? round($profit / $nett * 100, 1) : 0,
        ];
    }

    private function kpi(float|int $value, float|int $previous): array
    {
        if ($previous == 0) {
            $delta = $value > 0 ? 100.0 : 0.0;
        } else {
            $delta = round((($value - $previous) / abs($previous)) * 100, 1);
        }

        return [
            'value' => $value,
            'previous' => $previous,
            'deltaPct' => $delta,
        ];
    }

    private function salesTrend(Collection $companyBranchIds, SalesFilter $filter, $prevStart, $prevEnd): array
    {
        $cur = $this->baseQuery($companyBranchIds, $filter->outletId, $filter->start, $filter->end)
            ->selectRaw('DATE(transacted_at) as d, SUM(total_amount) as total, COUNT(*) as cnt')
            ->groupBy('d')->get()->keyBy('d');

        $prev = $this->baseQuery($companyBranchIds, $filter->outletId, $prevStart, $prevEnd)
            ->selectRaw('DATE(transacted_at) as d, SUM(total_amount) as total, COUNT(*) as cnt')
            ->groupBy('d')->get()->keyBy('d');

        $curDays = $this->dateKeys($filter->start, $filter->end);
        $prevDays = $this->dateKeys(Carbon::parse($prevStart), Carbon::parse($prevEnd));

        $series = [];
        foreach ($curDays as $i => $date) {
            $prevDate = $prevDays[$i] ?? null;
            $series[] = [
                'date' => $date,
                'label' => Carbon::parse($date)->translatedFormat('d M'),
                'total' => (float) ($cur[$date]->total ?? 0),
                'count' => (int) ($cur[$date]->cnt ?? 0),
                'prevTotal' => (float) ($prevDate ? ($prev[$prevDate]->total ?? 0) : 0),
                'prevCount' => (int) ($prevDate ? ($prev[$prevDate]->cnt ?? 0) : 0),
            ];
        }

        return $series;
    }

    private function hourlySales($base): array
    {
        $byHour = (clone $base)
            ->selectRaw('HOUR(transacted_at) as h, SUM(total_amount) as total, COUNT(*) as cnt')
            ->groupBy('h')->get()->keyBy('h');

        $hours = [];
        for ($h = 0; $h < 24; $h++) {
            $hours[] = [
                'hour' => sprintf('%02d', $h),
                'total' => (float) ($byHour[$h]->total ?? 0),
                'count' => (int) ($byHour[$h]->cnt ?? 0),
            ];
        }

        return $hours;
    }

    private function paymentBreakdown($base): array
    {
        $meta = [
            'cash' => ['label' => 'Tunai', 'color' => '#16a34a'],
            'qris' => ['label' => 'QRIS', 'color' => '#3d8ab8'],
            'debit' => ['label' => 'Kartu Debit', 'color' => '#9f6fd5'],
            'transfer' => ['label' => 'Transfer', 'color' => '#e75f1a'],
        ];

        $rows = (clone $base)
            ->selectRaw('payment_method, SUM(total_amount) as total, COUNT(*) as cnt')
            ->groupBy('payment_method')->get()->keyBy('payment_method');

        return collect($meta)->map(fn($m, $key) => [
            'method' => $key,
            'label' => $m['label'],
            'color' => $m['color'],
            'total' => (float) ($rows[$key]->total ?? 0),
            'count' => (int) ($rows[$key]->cnt ?? 0),
        ])->values()->all();
    }

    private function categorySummary($itemBase, int $companyId): array
    {
        $colors = Category::where('company_id', $companyId)->pluck('color', 'name');

        return (clone $itemBase)
            ->selectRaw('transaction_items.category_name as name, SUM(transaction_items.subtotal) as omzet')
            ->groupBy('transaction_items.category_name')
            ->orderByDesc('omzet')
            ->get()
            ->map(fn($row) => [
                'name' => $row->name ?? 'Lainnya',
                'omzet' => (float) $row->omzet,
                'color' => $colors[$row->name] ?? '#94a3b8',
            ])
            ->all();
    }

    private function topProducts($itemBase): array
    {
        return (clone $itemBase)
            ->selectRaw('transaction_items.product_name as name, SUM(transaction_items.qty) as qty, SUM(transaction_items.subtotal) as omzet')
            ->groupBy('transaction_items.product_name')
            ->orderByDesc('qty')
            ->limit(5)
            ->get()
            ->map(fn($row) => [
                'name' => $row->name,
                'qty' => (int) $row->qty,
                'omzet' => (float) $row->omzet,
            ])
            ->all();
    }

    private function recentTransactions($base): array
    {
        return (clone $base)
            ->latest('transacted_at')
            ->limit(6)
            ->get(['invoice_no', 'total_amount', 'status', 'payment_method', 'transacted_at'])
            ->map(fn(Transaction $t) => [
                'invoice' => $t->invoice_no,
                'total' => (float) $t->total_amount,
                'status' => $t->status,
                'payment' => $t->payment_method,
                'time' => Carbon::parse($t->transacted_at)->translatedFormat('d M Y, H:i'),
            ])
            ->all();
    }

    private function dateKeys(Carbon $start, Carbon $end): array
    {
        $keys = [];
        for ($day = $start->copy()->startOfDay(); $day->lte($end); $day->addDay()) {
            $keys[] = $day->toDateString();
        }

        return $keys;
    }
}
