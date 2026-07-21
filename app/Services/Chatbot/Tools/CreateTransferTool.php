<?php

namespace App\Services\Chatbot\Tools;

use App\Models\Advance\Management\Inventory\BranchStock;
use App\Models\Advance\Management\Inventory\Item;
use App\Models\Advance\Management\Inventory\Transfer;
use App\Models\Auth\Branch;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class CreateTransferTool implements ToolInterface
{
  public function name(): string
  {
    return 'create_transfer';
  }

  public function description(): string
  {
    return 'Kirim transfer stok dari satu cabang ke cabang lain, berisi satu atau lebih barang. '
      . 'Transfer selalu mengalir dari cabang PENGIRIM ke cabang PENERIMA — tidak ada konsep "minta dikirimin". '
      . 'Untuk Branch Manager, cabang pengirim otomatis cabangnya sendiri. '
      . 'Stok baru berpindah setelah cabang penerima menyetujui lewat tool respond_transfer — transfer ini cuma bikin permintaan pengiriman.';
  }

  public function parameters(): array
  {
    return [
      'type' => 'object',
      'properties' => [
        'sender_branch_name' => ['type' => 'string', 'description' => 'Nama cabang pengirim. Untuk Branch Manager, wajib cabangnya sendiri — kalau tidak, tolak dan jelaskan bahwa dia cuma bisa mengirim dari cabangnya.'],
        'receiver_branch_name' => ['type' => 'string', 'description' => 'Nama cabang penerima'],
        'items' => [
          'type' => 'array',
          'description' => 'Daftar barang yang dikirim',
          'items' => [
            'type' => 'object',
            'properties' => [
              'item_name' => ['type' => 'string', 'description' => 'Nama barang'],
              'quantity' => ['type' => 'integer', 'description' => 'Jumlah yang dikirim'],
            ],
            'required' => ['item_name', 'quantity'],
          ],
        ],
        'date' => ['type' => 'string', 'description' => 'Tanggal transfer format YYYY-MM-DD. Kalau tidak disebut, pakai hari ini.'],
      ],
      'required' => ['sender_branch_name', 'receiver_branch_name', 'items'],
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

  private function resolveBranches(User $user, array $args): array
  {
    $sender = Branch::where('company_id', $user->company_id)
      ->where('name', 'like', $args['sender_branch_name'] ?? '')
      ->first();
    $receiver = Branch::where('company_id', $user->company_id)
      ->where('name', 'like', $args['receiver_branch_name'] ?? '')
      ->first();

    return [$sender, $receiver];
  }

  public function summarize(User $user, array $args): array
  {
    [$sender, $receiver] = $this->resolveBranches($user, $args);

    $branchMismatch = $user->isBranchManager() && $sender && $sender->id !== $user->branch_id;

    $items = collect($args['items'] ?? [])->map(function ($row) use ($user, $sender) {
      $item = Item::where('company_id', $user->company_id)
        ->where('name', 'like', $row['item_name'] ?? '')
        ->first();

      $stock = $item && $sender
        ? BranchStock::where('branch_id', $sender->id)->where('inventory_item_id', $item->id)->value('current_stock')
        : null;

      $qty = (int) ($row['quantity'] ?? 0);

      return [
        'item_name' => $item?->name ?? ($row['item_name'] ?? 'Tidak ditemukan'),
        'item_valid' => (bool) $item,
        'quantity' => $qty,
        'sender_stock_available' => $stock,
        'stock_sufficient' => $stock !== null ? $stock >= $qty : null,
      ];
    });

    return [
      'sender_branch' => $sender?->name ?? ($args['sender_branch_name'] ?? 'Tidak ditemukan'),
      'sender_branch_valid' => (bool) $sender,
      'sender_branch_allowed' => !$branchMismatch,
      'receiver_branch' => $receiver?->name ?? ($args['receiver_branch_name'] ?? 'Tidak ditemukan'),
      'receiver_branch_valid' => (bool) $receiver,
      'same_branch_error' => $sender && $receiver && $sender->id === $receiver->id,
      'items' => $items->values(),
      'date' => $args['date'] ?? now()->toDateString(),
    ];
  }

  public function execute(User $user, array $args): array
  {
    $validated = Validator::make($args, [
      'sender_branch_name' => 'required|string',
      'receiver_branch_name' => 'required|string',
      'items' => 'required|array|min:1',
      'items.*.item_name' => 'required|string',
      'items.*.quantity' => 'required|integer|min:1',
      'date' => 'nullable|date',
    ])->validate();

    [$sender, $receiver] = $this->resolveBranches($user, $validated);

    if (!$sender || !$receiver) {
      throw new \RuntimeException('Cabang pengirim atau penerima tidak ditemukan.');
    }
    if ($sender->id === $receiver->id) {
      throw new \RuntimeException('Cabang pengirim dan penerima tidak boleh sama.');
    }
    if ($user->isBranchManager() && $sender->id !== $user->branch_id) {
      throw new \RuntimeException('Kamu cuma bisa mengirim stok dari cabangmu sendiri.');
    }

    $itemRows = [];
    foreach ($validated['items'] as $row) {
      $item = Item::where('company_id', $user->company_id)
        ->where('name', $row['item_name'])
        ->firstOrFail();

      $itemRows[] = ['inventory_item_id' => $item->id, 'quantity' => $row['quantity']];
    }

    $transfer = DB::transaction(function () use ($user, $sender, $receiver, $itemRows, $validated) {
      $transfer = Transfer::create([
        'company_id' => $user->company_id,
        'transfer_number' => 'PENDING-' . uniqid(),
        'sender_branch_id' => $sender->id,
        'receiver_branch_id' => $receiver->id,
        'requested_by_branch_id' => $user->isBranchManager() ? $user->branch_id : null,
        'status' => 'waiting',
        'date' => $validated['date'] ?? now()->toDateString(),
      ]);

      $transfer->update(['transfer_number' => 'KI-' . str_pad($transfer->id, 4, '0', STR_PAD_LEFT)]);

      foreach ($itemRows as $row) {
        $transfer->items()->create($row);
      }

      return $transfer;
    });

    return ['transfer_number' => $transfer->transfer_number, 'sender_branch' => $sender->name, 'receiver_branch' => $receiver->name];
  }

  public function formFields(User $user, array $currentArgs): array
  {
    $branches = Branch::where('company_id', $user->company_id)->orderBy('name')->pluck('name');
    $fields = [];

    if ($user->isOwner()) {
      $fields[] = ['name' => 'sender_branch_name', 'label' => 'Cabang Pengirim', 'type' => 'select', 'required' => true, 'value' => $currentArgs['sender_branch_name'] ?? '', 'options' => $branches->values()->all()];
    }

    $fields[] = ['name' => 'receiver_branch_name', 'label' => 'Cabang Penerima', 'type' => 'select', 'required' => true, 'value' => $currentArgs['receiver_branch_name'] ?? '', 'options' => $branches->values()->all()];

    return $fields;
  }
}
