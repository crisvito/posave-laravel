<?php

namespace App\Services\Chatbot\Tools;

use App\Models\Advance\Management\Inventory\Item;
use App\Models\Auth\Branch;
use App\Models\User;

class GetInventorySummaryTool implements ToolInterface
{
  public function name(): string
  {
    return 'get_inventory_summary';
  }

  public function description(): string
  {
    return 'Ambil informasi stok barang secara fleksibel — bisa difilter, diurutkan, dan dibatasi jumlahnya. '
      . 'Gunakan ini untuk SEMUA pertanyaan soal stok/inventory: ringkasan barang habis/mau habis, '
      . '"barang termahal/termurah", "barang dengan stok paling banyak/sedikit", "top 3 barang di kategori X", '
      . '"cari barang bernama Y", dll. Kalau user cuma nanya "stok gimana" tanpa detail, panggil tanpa parameter '
      . 'untuk dapat ringkasan barang habis & mau habis.';
  }

  public function parameters(): array
  {
    return [
      'type' => 'object',
      'properties' => [
        'item_name' => ['type' => 'string', 'description' => 'Filter nama barang (pencarian sebagian, opsional).'],
        'category_name' => ['type' => 'string', 'description' => 'Filter kategori tertentu (opsional).'],
        'branch_name' => ['type' => 'string', 'description' => 'Filter cabang tertentu. Hanya berlaku untuk Owner — diabaikan untuk Branch Manager/Cashier karena mereka cuma bisa lihat cabangnya sendiri. Kalau Owner tidak sebutkan cabang, stok dijumlahkan dari semua cabang.'],
        'stock_status' => ['type' => 'string', 'enum' => ['all', 'out', 'low', 'safe'], 'description' => 'Filter status stok: habis, mau habis, atau aman. Default "all".'],
        'sort_by' => ['type' => 'string', 'enum' => ['name', 'price', 'stock'], 'description' => 'Urutkan berdasarkan apa. Default "name".'],
        'order' => ['type' => 'string', 'enum' => ['asc', 'desc'], 'description' => 'Urutan naik ("asc", untuk termurah/tersedikit) atau turun ("desc", untuk termahal/terbanyak). Default "asc".'],
        'limit' => ['type' => 'integer', 'description' => 'Jumlah hasil maksimal. Pakai untuk "top 3", "5 barang termahal", dll. Default 20, maksimal 100.'],
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
    return true; // semua role boleh nanya stok
  }

  public function execute(User $user, array $args): array
  {
    $companyId = $user->company_id;
    $companyBranchIds = Branch::where('company_id', $companyId)->pluck('id');

    // --- Tentukan scoping cabang ---
    $singleBranchId = null;
    if (!$user->isOwner()) {
      // Branch Manager & Cashier selalu dikunci ke cabang mereka sendiri.
      $singleBranchId = $user->branch_id;
    } elseif (!empty($args['branch_name'])) {
      $branch = Branch::whereIn('id', $companyBranchIds)
        ->where('name', 'like', '%' . $args['branch_name'] . '%')
        ->first();

      if (!$branch) {
        return ['note' => 'Cabang "' . $args['branch_name'] . '" tidak ditemukan.', 'results' => []];
      }
      $singleBranchId = $branch->id;
    }
    // Kalau Owner tanpa branch_name, $singleBranchId tetap null → stok dijumlahkan semua cabang.

    $query = Item::where('company_id', $companyId)->with(['category:id,name']);

    if ($singleBranchId) {
      $query->with(['branchStocks' => fn($q) => $q->where('branch_id', $singleBranchId)]);
    } else {
      $query->with(['branchStocks' => fn($q) => $q->whereIn('branch_id', $companyBranchIds)]);
    }

    if (!empty($args['item_name'])) {
      $query->where('name', 'like', '%' . $args['item_name'] . '%');
    }

    if (!empty($args['category_name'])) {
      $query->whereHas('category', fn($q) => $q->where('name', 'like', '%' . $args['category_name'] . '%'));
    }

    $items = $query->get();

    // --- Hitung stok efektif per barang (dijumlahkan kalau lintas cabang) ---
    $rows = $items->map(function (Item $item) {
      $current = (int) $item->branchStocks->sum('current_stock');
      $min = (int) $item->branchStocks->sum('min_stock');

      $status = 'safe';
      if ($current === 0) {
        $status = 'out';
      } elseif ($current <= $min) {
        $status = 'low';
      }

      return [
        'name' => $item->name,
        'sku' => $item->sku,
        'category_name' => $item->category?->name,
        'price' => (float) $item->price,
        'current_stock' => $current,
        'min_stock' => $min,
        'status' => $status,
      ];
    });

    $statusFilter = $args['stock_status'] ?? 'all';
    if ($statusFilter !== 'all') {
      $rows = $rows->filter(fn($r) => $r['status'] === $statusFilter);
    }

    $sortBy = $args['sort_by'] ?? 'name';
    $order = $args['order'] ?? 'asc';
    $sortKey = match ($sortBy) {
      'price' => 'price',
      'stock' => 'current_stock',
      default => 'name',
    };
    $rows = $order === 'desc' ? $rows->sortByDesc($sortKey) : $rows->sortBy($sortKey);

    $limit = min((int) ($args['limit'] ?? 20), 100);
    $rows = $rows->values()->take($limit);

    return [
      'count' => $rows->count(),
      'out_of_stock_count' => $items->filter(fn($item) => (int) $item->branchStocks->sum('current_stock') === 0)->count(),
      'low_stock_count' => $items->filter(function ($item) {
        $current = (int) $item->branchStocks->sum('current_stock');
        $min = (int) $item->branchStocks->sum('min_stock');
        return $current > 0 && $current <= $min;
      })->count(),
      'results' => $rows->all(),
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
