<?php

namespace App\Services\Chatbot\Tools;

use App\Models\Advance\Management\Inventory\Adjustment;
use App\Models\Auth\Branch;
use App\Models\User;
use Carbon\Carbon;

class GetAdjustmentsTool implements ToolInterface
{
  public function name(): string
  {
    return 'get_adjustments';
  }

  public function description(): string
  {
    return 'Ambil daftar penyesuaian stok (adjustment) — barang rusak, hilang, ketemu lebih, dll. '
      . 'Bisa difilter, diurutkan, dan dibatasi jumlahnya. Gunakan ini untuk pertanyaan seperti '
      . '"barang apa yang paling sering rusak", "adjustment terbesar bulan ini", "3 penyesuaian '
      . 'dengan kerugian terbesar", "riwayat adjustment barang X", dll.';
  }

  public function parameters(): array
  {
    return [
      'type' => 'object',
      'properties' => [
        'period' => [
          'type' => 'string',
          'enum' => ['today', '7d', '30d', 'all'],
          'description' => 'Rentang waktu. Default "30d" kalau user gak sebutkan.',
        ],
        'item_name' => [
          'type' => 'string',
          'description' => 'Filter berdasarkan nama barang tertentu (pencarian sebagian, opsional).',
        ],
        'branch_name' => [
          'type' => 'string',
          'description' => 'Filter berdasarkan nama cabang tertentu. Hanya berlaku untuk Owner — diabaikan untuk Branch Manager karena dia cuma bisa lihat cabangnya sendiri.',
        ],
        'direction' => [
          'type' => 'string',
          'enum' => ['in', 'out', 'all'],
          'description' => 'Filter stok bertambah ("in") atau berkurang ("out") saja. Default "all".',
        ],
        'sort_by' => [
          'type' => 'string',
          'enum' => ['date', 'qty_change', 'financial_change', 'item_name'],
          'description' => 'Urutkan berdasarkan apa. Pakai "financial_change" untuk pertanyaan soal kerugian/nilai rupiah. Default "date".',
        ],
        'order' => [
          'type' => 'string',
          'enum' => ['asc', 'desc'],
          'description' => 'Urutan naik ("asc", untuk "terkecil"/"terburuk" dari sisi qty negatif) atau turun ("desc", default, untuk "terbesar"/"terbaru").',
        ],
        'limit' => [
          'type' => 'integer',
          'description' => 'Jumlah hasil maksimal. Pakai ini untuk "top 3", "5 adjustment terakhir", dll. Default 10, maksimal 50.',
        ],
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
    // Sama seperti data keuangan — Owner & Branch Manager boleh, Cashier tidak.
    if ($user->company?->isLite()) {
      return true;
    }
    return $user->isOwner() || $user->isBranchManager();
  }

  public function execute(User $user, array $args): array
  {
    $period = $args['period'] ?? '30d';
    [$start, $end] = $this->resolvePeriod($period);

    $companyBranchIds = Branch::where('company_id', $user->company_id)->pluck('id');

    $query = Adjustment::query()
      ->with(['item:id,name,sku', 'branch:id,name'])
      ->whereIn('branch_id', $companyBranchIds);

    if ($period !== 'all') {
      $query->whereBetween('date', [$start->toDateString(), $end->toDateString()]);
    }

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

    if (!empty($args['item_name'])) {
      $query->whereHas('item', fn($q) => $q->where('name', 'like', '%' . $args['item_name'] . '%'));
    }

    if (($args['direction'] ?? 'all') === 'in') {
      $query->where('qty_change', '>', 0);
    } elseif (($args['direction'] ?? 'all') === 'out') {
      $query->where('qty_change', '<', 0);
    }

    $sortBy = $args['sort_by'] ?? 'date';
    $order = $args['order'] ?? 'desc';
    $limit = min((int) ($args['limit'] ?? 10), 50);

    if ($sortBy === 'item_name') {
      $query->join('inventory_items', 'inventory_items.id', '=', 'inventory_adjustments.inventory_item_id')
        ->orderBy('inventory_items.name', $order)
        ->select('inventory_adjustments.*');
    } else {
      $query->orderBy($sortBy, $order);
    }

    $results = $query->limit($limit)->get();

    return [
      'period' => $period,
      'count' => $results->count(),
      'results' => $results->map(fn(Adjustment $a) => [
        'item_name' => $a->item?->name,
        'item_sku' => $a->item?->sku,
        'branch_name' => $a->branch?->name,
        'qty_change' => (int) $a->qty_change,
        'financial_change' => (float) $a->financial_change,
        'note' => $a->note,
        'date' => $a->date,
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

  private function resolvePeriod(string $period): array
  {
    return match ($period) {
      '7d' => [Carbon::today()->subDays(6), Carbon::today()->endOfDay()],
      '30d' => [Carbon::today()->subDays(29), Carbon::today()->endOfDay()],
      'all' => [Carbon::createFromTimestamp(0), Carbon::today()->endOfDay()],
      default => [Carbon::today(), Carbon::today()->endOfDay()],
    };
  }
}
