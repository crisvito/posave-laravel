<?php

namespace App\Services\Chatbot\Tools;

use App\Models\Advance\Management\Inventory\BranchStock;
use App\Models\Advance\Management\Inventory\Item;
use App\Models\Advance\Management\Inventory\Transfer;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class RespondTransferTool implements ToolInterface
{
  public function name(): string
  {
    return 'respond_transfer';
  }

  public function description(): string
  {
    return 'Setujui (terima) atau tolak transfer stok yang masuk ke cabang ini. '
      . 'Menyetujui berarti stok beneran berpindah dari cabang pengirim ke cabang ini. '
      . 'Menolak wajib disertai alasan. Kalau user tidak sebutkan transfer mana, atau ada lebih dari satu yang menunggu, '
      . 'JANGAN menebak — sistem akan otomatis menampilkan daftar transfer yang bisa dipilih.';
  }

  public function parameters(): array
  {
    return [
      'type' => 'object',
      'properties' => [
        'transfer_number' => ['type' => 'string', 'description' => 'Nomor transfer yang mau direspon.'],
        'decision' => ['type' => 'string', 'enum' => ['accept', 'reject'], 'description' => '"accept" untuk menyetujui/menerima, "reject" untuk menolak.'],
        'rejection_note' => ['type' => 'string', 'description' => 'Alasan penolakan. Wajib diisi kalau decision = "reject".'],
      ],
      'required' => ['transfer_number', 'decision'],
    ];
  }

  public function isReadOnly(): bool
  {
    return false;
  }

  public function isAvailableFor(User $user): bool
  {
    if ($user->company?->isLite()) {
      return false;
    }
    return $user->isOwner() || $user->isBranchManager();
  }

  private function findTransfer(User $user, string $transferNumber): ?Transfer
  {
    return Transfer::with('items.inventoryItem')
      ->where('company_id', $user->company_id)
      ->where('transfer_number', $transferNumber)
      ->first();
  }

  public function summarize(User $user, array $args): array
  {
    $transfer = $this->findTransfer($user, $args['transfer_number'] ?? '');

    if (!$transfer) {
      return ['transfer_number' => $args['transfer_number'] ?? null, 'transfer_valid' => false];
    }

    $isApprover = $transfer->approver_branch_id === $user->branch_id;

    return [
      'transfer_number' => $transfer->transfer_number,
      'transfer_valid' => true,
      'sender_branch' => $transfer->senderBranch?->name,
      'receiver_branch' => $transfer->receiverBranch?->name,
      'current_status' => $transfer->status,
      'already_final' => $transfer->status !== 'waiting',
      'user_is_authorized_approver' => $isApprover,
      'decision' => $args['decision'] ?? null,
      'items' => $transfer->items->map(fn($i) => ['name' => $i->inventoryItem?->name, 'quantity' => $i->quantity])->values(),
    ];
  }

  public function execute(User $user, array $args): array
  {
    $validated = Validator::make($args, [
      'transfer_number' => 'required|string',
      'decision' => 'required|in:accept,reject',
      'rejection_note' => 'required_if:decision,reject|string|max:500',
    ])->validate();

    $transfer = $this->findTransfer($user, $validated['transfer_number']);

    if (!$transfer) {
      throw new \RuntimeException("Transfer \"{$validated['transfer_number']}\" tidak ditemukan.");
    }
    if ($transfer->approver_branch_id !== $user->branch_id) {
      throw new \RuntimeException('Kamu bukan pihak yang berwenang merespon transfer ini.');
    }
    if ($transfer->status !== 'waiting') {
      throw new \RuntimeException("Transfer \"{$transfer->transfer_number}\" sudah berstatus \"{$transfer->status}\", tidak bisa diubah lagi.");
    }

    if ($validated['decision'] === 'reject') {
      $transfer->update(['status' => 'rejected', 'rejection_note' => $validated['rejection_note']]);
      return ['transfer_number' => $transfer->transfer_number, 'new_status' => 'rejected'];
    }

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
      throw new \RuntimeException(collect($e->errors())->flatten()->first());
    }

    return ['transfer_number' => $transfer->transfer_number, 'new_status' => 'success'];
  }

  public function formFields(User $user, array $currentArgs): array
  {
    $pending = Transfer::pendingApprovalFor($user)->pluck('transfer_number');

    return [
      ['name' => 'transfer_number', 'label' => 'Nomor Transfer', 'type' => 'select', 'required' => true, 'value' => $currentArgs['transfer_number'] ?? '', 'options' => $pending->values()->all()],
      ['name' => 'decision', 'label' => 'Keputusan', 'type' => 'select', 'required' => true, 'value' => $currentArgs['decision'] ?? 'accept', 'options' => ['accept', 'reject']],
      ['name' => 'rejection_note', 'label' => 'Alasan Penolakan (isi kalau menolak)', 'type' => 'text', 'required' => false, 'value' => $currentArgs['rejection_note'] ?? ''],
    ];
  }
}
