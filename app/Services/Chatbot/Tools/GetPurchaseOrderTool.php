<?php

namespace App\Services\Chatbot\Tools;

use App\Models\Advance\Management\Inventory\PurchaseOrder;
use App\Models\Auth\Branch;
use App\Models\User;

class GetPurchaseOrderTool implements ToolInterface
{
  public function name(): string
  {
    return 'get_purchase_orders';
  }

  public function description(): string
  {
    return 'Ambil daftar pembelian (purchase order) dari supplier — bisa difilter status, supplier, diurutkan, dan dibatasi jumlahnya. '
      . 'Gunakan untuk pertanyaan seperti "PO apa saja yang masih menunggu", "pembelian terbesar bulan ini", '
      . '"riwayat pembelian dari supplier X", "3 PO terakhir yang dibatalkan", dll.';
  }

  public function parameters(): array
  {
    return [
      'type' => 'object',
      'properties' => [
        'status' => ['type' => 'string', 'enum' => ['all', 'waiting_fulfilment', 'success', 'cancelled'], 'description' => 'Filter status PO. Default "all".'],
        'supplier_name' => ['type' => 'string', 'description' => 'Filter nama supplier (pencarian sebagian, opsional).'],
        'branch_name' => ['type' => 'string', 'description' => 'Filter cabang tertentu. Hanya berlaku untuk Owner — diabaikan untuk Branch Manager karena dia cuma bisa lihat cabangnya sendiri.'],
        'period' => ['type' => 'string', 'enum' => ['today', '7d', '30d', 'all'], 'description' => 'Rentang tanggal PO. Default "30d".'],
        'sort_by' => ['type' => 'string', 'enum' => ['date', 'total_price'], 'description' => 'Urutkan berdasarkan apa. Default "date".'],
        'order' => ['type' => 'string', 'enum' => ['asc', 'desc'], 'description' => 'Urutan naik atau turun. Default "desc".'],
        'limit' => ['type' => 'integer', 'description' => 'Jumlah hasil maksimal. Pakai untuk "top 3", "5 PO terakhir", dll. Default 10, maksimal 50.'],
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
    if ($user->company?->isLite()) {
      return true;
    }
    return $user->isOwner() || $user->isBranchManager();
  }

  public function execute(User $user, array $args): array
  {
    $companyBranchIds = Branch::where('company_id', $user->company_id)->pluck('id');

    $query = PurchaseOrder::where('company_id', $user->company_id)
      ->with(['supplier:id,name', 'branch:id,name']);

    if ($user->isBranchManager()) {
      $query->where('branch_id', $user->branch_id);
    } elseif (!empty($args['branch_name'])) {
      $branch = Branch::whereIn('id', $companyBranchIds)
        ->where('name', 'like', '%' . $args['branch_name'] . '%')
        ->first();

      if (!$branch) {
        return ['note' => 'Cabang "' . $args['branch_name'] . '" tidak ditemukan.', 'results' => []];
      }
      $query->where('branch_id', $branch->id);
    }

    $status = $args['status'] ?? 'all';
    if ($status !== 'all') {
      $query->where('status', $status);
    }

    if (!empty($args['supplier_name'])) {
      $query->whereHas('supplier', fn($q) => $q->where('name', 'like', '%' . $args['supplier_name'] . '%'));
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

    $results = $query->orderBy($sortBy, $order)->limit($limit)->get();

    return [
      'count' => $results->count(),
      'results' => $results->map(fn(PurchaseOrder $po) => [
        'po_number' => $po->po_number,
        'supplier_name' => $po->supplier?->name,
        'branch_name' => $po->branch?->name,
        'status' => $po->status,
        'total_price' => (float) $po->total_price,
        'date' => $po->date,
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
