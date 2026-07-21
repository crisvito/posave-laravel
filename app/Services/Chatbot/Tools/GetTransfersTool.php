<?php

namespace App\Services\Chatbot\Tools;

use App\Models\Advance\Management\Inventory\Transfer;
use App\Models\Auth\Branch;
use App\Models\User;

class GetTransfersTool implements ToolInterface
{
  public function name(): string
  {
    return 'get_transfers';
  }

  public function description(): string
  {
    return 'Ambil daftar transfer stok antar-cabang — bisa difilter status, cabang, barang, diurutkan, dan dibatasi jumlahnya. '
      . 'Gunakan untuk pertanyaan seperti "transfer apa yang masih menunggu", "ada kiriman yang perlu aku setujui gak", '
      . '"riwayat transfer ke cabang X", "transfer yang mengandung barang Y", dll.';
  }

  public function parameters(): array
  {
    return [
      'type' => 'object',
      'properties' => [
        'status' => ['type' => 'string', 'enum' => ['all', 'waiting', 'success', 'rejected'], 'description' => 'Filter status transfer. Default "all".'],
        'only_pending_my_approval' => ['type' => 'boolean', 'description' => 'Kalau true, cuma tampilkan transfer yang menunggu persetujuan dari cabang user ini. Pakai untuk pertanyaan "ada yang perlu aku setujui?".'],
        'branch_name' => ['type' => 'string', 'description' => 'Filter cabang tertentu (baik sebagai pengirim maupun penerima). Untuk Branch Manager otomatis terkunci ke cabangnya sendiri.'],
        'item_name' => ['type' => 'string', 'description' => 'Filter transfer yang mengandung barang tertentu (opsional).'],
        'period' => ['type' => 'string', 'enum' => ['today', '7d', '30d', 'all'], 'description' => 'Rentang tanggal. Default "30d".'],
        'sort_by' => ['type' => 'string', 'enum' => ['date', 'items_count'], 'description' => 'Urutkan berdasarkan apa. Default "date".'],
        'order' => ['type' => 'string', 'enum' => ['asc', 'desc'], 'description' => 'Urutan naik atau turun. Default "desc".'],
        'limit' => ['type' => 'integer', 'description' => 'Jumlah hasil maksimal. Default 10, maksimal 50.'],
      ],
      'required' => [],
    ];
  }

  public function isReadOnly(): bool
  {
    return true;
  }

  public function isAvailableFor(User $user): bool
  {
    // Beda dari tool lain: transfer antar-cabang gak relevan buat Lite (cuma 1 cabang).
    if ($user->company?->isLite()) {
      return false;
    }
    return $user->isOwner() || $user->isBranchManager();
  }

  public function execute(User $user, array $args): array
  {
    $query = Transfer::where('company_id', $user->company_id)
      ->with(['senderBranch:id,name', 'receiverBranch:id,name'])
      ->withCount('items');

    if ($user->isBranchManager()) {
      $query->where(fn($q) => $q->where('sender_branch_id', $user->branch_id)->orWhere('receiver_branch_id', $user->branch_id));
    } elseif (!empty($args['branch_name'])) {
      $branch = Branch::where('company_id', $user->company_id)
        ->where('name', 'like', '%' . $args['branch_name'] . '%')
        ->first();

      if (!$branch) {
        return ['note' => 'Cabang "' . $args['branch_name'] . '" tidak ditemukan.', 'results' => []];
      }
      $query->where(fn($q) => $q->where('sender_branch_id', $branch->id)->orWhere('receiver_branch_id', $branch->id));
    }

    $status = $args['status'] ?? 'all';
    if ($status !== 'all') {
      $query->where('status', $status);
    }

    if (!empty($args['item_name'])) {
      $query->whereHas('items.inventoryItem', fn($q) => $q->where('name', 'like', '%' . $args['item_name'] . '%'));
    }

    $period = $args['period'] ?? '30d';
    if ($period !== 'all') {
      [$start, $end] = match ($period) {
        '7d' => [now()->subDays(6)->toDateString(), now()->toDateString()],
        'today' => [now()->toDateString(), now()->toDateString()],
        default => [now()->subDays(29)->toDateString(), now()->toDateString()],
      };
      $query->whereBetween('date', [$start, $end]);
    }

    $sortBy = $args['sort_by'] ?? 'date';
    $order = $args['order'] ?? 'desc';
    $limit = min((int) ($args['limit'] ?? 10), 50);

    $transfers = $query->orderBy($sortBy === 'items_count' ? 'items_count' : 'date', $order)->get();

    if (!empty($args['only_pending_my_approval'])) {
      $transfers = $transfers->filter(fn(Transfer $t) => $t->status === 'waiting' && $t->approver_branch_id === $user->branch_id)->values();
    }

    $transfers = $transfers->take($limit);

    return [
      'count' => $transfers->count(),
      'results' => $transfers->map(fn(Transfer $t) => [
        'transfer_number' => $t->transfer_number,
        'sender_branch' => $t->senderBranch?->name,
        'receiver_branch' => $t->receiverBranch?->name,
        'status' => $t->status,
        'items_count' => $t->items_count,
        'rejection_note' => $t->rejection_note,
        'date' => $t->date,
        'awaiting_approval_from' => $t->status === 'waiting' ? ($t->approver_branch_id === $t->receiver_branch_id ? $t->receiverBranch?->name : $t->senderBranch?->name) : null,
      ])->values(),
    ];
  }

  public function summarize(User $user, array $args): array
  {
    return [];
  }

  public function formFields(User $user, array $currentArgs): array
  {
    return [];
  }
}
