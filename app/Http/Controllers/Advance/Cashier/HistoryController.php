<?php

namespace App\Http\Controllers\Advance\Cashier;

use App\Http\Controllers\Controller;
use App\Mail\ReceiptMail;
use App\Models\Advance\Transaction\Transaction;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class HistoryController extends Controller
{
    public function index(Request $request)
    {
        /** @var User $user */
        $user = Auth::user();

        $date = $request->filled('date')
            ? Carbon::parse($request->input('date'))->startOfDay()
            : Carbon::today();

        $transactions = Transaction::with('items')
            ->where('branch_id', $user->branch_id)   // riwayat = cabang si kasir, bukan cabang lain
            ->whereBetween('transacted_at', [$date->copy()->startOfDay(), $date->copy()->endOfDay()])
            ->when($request->search, function ($query) use ($request) {
                $query->where('invoice_no', 'like', '%' . $request->search . '%');
            })
            ->when($request->payment_method && $request->payment_method !== 'all', function ($query) use ($request) {
                $query->where('payment_method', $request->payment_method);
            })
            ->orderByDesc('transacted_at')
            ->get()
            ->map(fn(Transaction $t) => [
                'id' => $t->id,
                'invoice' => $t->invoice_no,
                'time' => $t->transacted_at->format('H:i'),
                'date' => $t->transacted_at->translatedFormat('d F Y'),
                'dateLabel' => $t->transacted_at->translatedFormat('l, d M Y'),
                'paymentMethod' => $t->payment_method,
                'total' => (float) $t->total_amount,
                'discount' => (float) $t->discount_amount,
                'status' => $t->status,   // 'completed' | 'refunded' | 'void'
                'items' => $t->items->map(fn($i) => [
                    'name' => $i->product_name,
                    'price' => (float) $i->unit_price,
                    'qty' => $i->qty,
                    'note' => $i->note,
                ]),
            ]);

        return Inertia::render('advance/cashier/history/history', [
            'transactions' => $transactions,
            'filters' => [
                'date' => $date->toDateString(),
                'search' => $request->search,
                'payment_method' => $request->payment_method ?? 'all',
            ],
        ]);
    }
    public function sendReceiptEmail(Request $request, string $id)
    {
        /** @var User $user */
        $user = Auth::user();

        $request->validate([
            'email' => 'required|email',
        ]);

        $transaction = Transaction::with('items')
            ->where('branch_id', $user->branch_id)
            ->findOrFail($id);

        Mail::to($request->email)->send(new ReceiptMail($transaction, $user->company?->profile?->name));

        return response()->json(['success' => true]);
    }
}
