<?php

namespace App\Http\Controllers\Advance\Management\Inventory;

use App\Http\Controllers\Controller;
use App\Models\Advance\Management\Inventory\BranchStock;
use App\Models\Advance\Management\Inventory\Item;
use App\Models\Advance\Management\Inventory\Transfer;
use App\Models\Auth\Branch;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class TransferController extends Controller
{
    public function index(Request $request)
    {
        /** @var User $user */
        $user = Auth::user();

        $transfersQuery = Transfer::with(['senderBranch', 'receiverBranch'])
            ->withCount('items')
            ->where('company_id', $user->company_id);

        if ($user->isBranchManager()) {
            $transfersQuery->where(function ($q) use ($user) {
                $q->where('sender_branch_id', $user->branch_id)
                    ->orWhere('receiver_branch_id', $user->branch_id);
            });
        }

        if ($request->view === 'incoming') {
            $transfersQuery->where('receiver_branch_id', $user->branch_id)->where('status', 'waiting');
        }

        $transfersQuery
            ->when($request->date, fn($q) => $q->whereDate('date', $request->date))
            ->when($request->status, fn($q) => $q->where('status', $request->status))
            ->when($request->search, fn($q) => $q->where('transfer_number', 'like', '%' . $request->search . '%'));

        $transfers = $transfersQuery->orderByDesc('date')->orderByDesc('id')->paginate($request->per_page ?? 6)->withQueryString();

        $incomingPendingCount = Transfer::pendingApprovalFor($user)->count();

        $branches = Branch::where('company_id', $user->company_id)->get(['id', 'name']);

        $branchStocks = BranchStock::whereIn('branch_id', $branches->pluck('id'))
            ->get(['branch_id', 'inventory_item_id', 'current_stock'])
            ->groupBy('branch_id')
            ->map(fn($stocks) => $stocks->pluck('current_stock', 'inventory_item_id'));

        return Inertia::render('advance/management/inventory/inventory-transfer', [
            'transfers' => $transfers,
            'inventoryItems' => Item::where('company_id', $user->company_id)->where('is_active', true)->select('id', 'name', 'sku')->get(),
            'branchStocks' => $branchStocks,
            'branches' => $branches,
            'my_branch_id' => $user->branch_id,
            'incoming_pending_count' => $incomingPendingCount,
            'filters' => $request->only('date', 'status', 'search', 'per_page', 'view'),
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
            'sender_branch_id' => 'required|exists:branches,id|different:receiver_branch_id',
            'receiver_branch_id' => 'required|exists:branches,id',
            'date' => 'required|date',
            'items' => 'required|array|min:1',
            'items.*.inventory_item_id' => 'required|exists:inventory_items,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        $validCompanyBranchIds = Branch::where('company_id', $user->company_id)->pluck('id');
        abort_if(!$validCompanyBranchIds->contains($validated['sender_branch_id']), 403);
        abort_if(!$validCompanyBranchIds->contains($validated['receiver_branch_id']), 403);

        if ($user->isBranchManager()) {
            $involved = in_array($user->branch_id, [$validated['sender_branch_id'], $validated['receiver_branch_id']]);
            abort_if(!$involved, 403);
        }

        $transfer = DB::transaction(function () use ($validated, $user) {
            $transfer = Transfer::create([
                'company_id' => $user->company_id,
                'transfer_number' => 'PENDING-' . uniqid(),
                'sender_branch_id' => $validated['sender_branch_id'],
                'receiver_branch_id' => $validated['receiver_branch_id'],
                'requested_by_branch_id' => $user->isBranchManager() ? $user->branch_id : null,
                'status' => 'waiting',
                'date' => $validated['date'],
            ]);

            $transfer->update(['transfer_number' => 'KI-' . str_pad($transfer->id, 4, '0', STR_PAD_LEFT)]);

            foreach ($validated['items'] as $item) {
                $transfer->items()->create($item);
            }

            return $transfer;
        });

        return redirect()->route('dashboard.inventory.transfers.index')->with('success', 'Permintaan kiriman berhasil dibuat, menunggu konfirmasi cabang penerima.');
    }

    public function show(string $id)
    {
        //
    }

    public function edit(string $id)
    {
        //
    }

    /** Cabang penerima menerima transfer — stok beneran berpindah. */
    public function accept(Request $request, string $id)
    {
        /** @var User $user */
        $user = Auth::user();
        $transfer = Transfer::with('items')->where('company_id', $user->company_id)->findOrFail($id);

        abort_if($transfer->approver_branch_id !== $user->branch_id, 403, 'Cuma cabang yang berwenang yang bisa menerima kiriman ini.');
        abort_if($transfer->status !== 'waiting', 422, 'Kiriman ini sudah diputuskan sebelumnya.');

        try {
            DB::transaction(function () use ($transfer) {
                foreach ($transfer->items as $line) {
                    $senderStock = BranchStock::where('branch_id', $transfer->sender_branch_id)
                        ->where('inventory_item_id', $line->inventory_item_id)
                        ->lockForUpdate()
                        ->first();

                    if (!$senderStock || $senderStock->current_stock < $line->quantity) {
                        $itemName = Item::find($line->inventory_item_id)?->name ?? 'Barang';
                        throw ValidationException::withMessages(['items' => "Stok {$itemName} di cabang pengirim tidak mencukupi."]);
                    }

                    $senderStock->decrement('current_stock', $line->quantity);

                    $receiverStock = BranchStock::firstOrCreate(
                        ['branch_id' => $transfer->receiver_branch_id, 'inventory_item_id' => $line->inventory_item_id],
                        ['current_stock' => 0, 'min_stock' => 0],
                    );
                    $receiverStock->increment('current_stock', $line->quantity);
                }

                $transfer->update(['status' => 'success']);
            });
        } catch (ValidationException $e) {
            return back()->withErrors($e->errors());
        }

        return redirect()->route('dashboard.inventory.transfers.index')->with('success', 'Kiriman diterima, stok berhasil dipindahkan.');
    }

    /** Cabang penerima menolak transfer — wajib kasih alasan. */
    public function reject(Request $request, string $id)
    {
        /** @var User $user */
        $user = Auth::user();
        $transfer = Transfer::where('company_id', $user->company_id)->findOrFail($id);

        abort_if($transfer->approver_branch_id !== $user->branch_id, 403, 'Cuma cabang yang berwenang yang bisa menolak kiriman ini.');
        abort_if($transfer->status !== 'waiting', 422, 'Kiriman ini sudah diputuskan sebelumnya.');

        $validated = $request->validate(['note' => 'required|string|max:500']);

        $transfer->update(['status' => 'rejected', 'rejection_note' => $validated['note']]);

        return redirect()->route('dashboard.inventory.transfers.index')->with('success', 'Kiriman ditolak.');
    }

    /** Cuma boleh hapus selama masih "waiting", dan cuma pihak pengirim. */
    public function destroy(string $id)
    {
        /** @var User $user */
        $user = Auth::user();
        $transfer = Transfer::where('company_id', $user->company_id)->findOrFail($id);

        abort_if($transfer->status !== 'waiting', 422, 'Kiriman yang sudah diputuskan tidak bisa dihapus.');

        if ($user->isBranchManager()) {
            $isInvolved = in_array($user->branch_id, [$transfer->sender_branch_id, $transfer->receiver_branch_id]);
            abort_if(!$isInvolved, 403);
        }

        $transfer->delete();

        return redirect()->route('dashboard.inventory.transfers.index')->with('success', 'Permintaan kiriman dibatalkan.');
    }
}
