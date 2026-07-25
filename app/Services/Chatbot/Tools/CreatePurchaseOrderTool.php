<?php

namespace App\Services\Chatbot\Tools;

use App\Models\Advance\Management\Inventory\Item;
use App\Models\Advance\Management\Inventory\PurchaseOrder;
use App\Models\Advance\Management\Inventory\PurchaseOrderItem;
use App\Models\Advance\Management\Inventory\Supplier;
use App\Models\Auth\Branch;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class CreatePurchaseOrderTool implements ToolInterface
{
  public function name(): string
  {
    return 'create_purchase_order';
  }

  public function description(): string
  {
    return 'Buat pembelian (purchase order) baru ke supplier, berisi satu atau lebih barang. '
      . 'WAJIB tanya user dulu kalau supplier atau daftar barang belum jelas. '
      . 'PO baru selalu berstatus menunggu (belum menambah stok) — stok baru bertambah setelah PO diselesaikan lewat tool update_purchase_order_status. '
      . 'Tool ini cuma nyiapin draft, belum langsung nyimpen — user tetap harus konfirmasi lewat tombol yang muncul.';
  }

  public function parameters(): array
  {
    return [
      'type' => 'object',
      'properties' => [
        'supplier_name' => ['type' => 'string', 'description' => 'Nama supplier (harus salah satu supplier yang sudah ada)'],
        'branch_name' => ['type' => 'string', 'description' => 'Cabang tujuan PO. Wajib diisi untuk Owner. Diabaikan untuk Branch Manager karena otomatis pakai cabangnya sendiri.'],
        'items' => [
          'type' => 'array',
          'description' => 'Daftar barang yang dibeli',
          'items' => [
            'type' => 'object',
            'properties' => [
              'item_name' => ['type' => 'string', 'description' => 'Nama barang'],
              'quantity' => ['type' => 'integer', 'description' => 'Jumlah yang dibeli'],
              'price' => ['type' => 'number', 'description' => 'Harga beli per unit dari supplier ini (bisa beda dari harga modal biasa)'],
            ],
            'required' => ['item_name', 'quantity', 'price'],
          ],
        ],
        'date' => ['type' => 'string', 'description' => 'Tanggal PO format YYYY-MM-DD. Kalau tidak disebut, pakai hari ini.'],
      ],
      'required' => ['supplier_name', 'items'],
    ];
  }

  public function isReadOnly(): bool
  {
    return false;
  }

  public function isAvailableFor(User $user): bool
  {
    if ($user->company?->isLite()) {
      return true;
    }
    return $user->isOwner() || $user->isBranchManager();
  }

  private function resolveBranchId(User $user, array $args): ?int
  {
    if ($user->isBranchManager()) {
      return $user->branch_id;
    }

    if (!empty($args['branch_name'])) {
      $branch = Branch::where('company_id', $user->company_id)
        ->where('name', 'like', '%' . $args['branch_name'] . '%')
        ->first();
      return $branch?->id;
    }

    return null;
  }

  public function summarize(User $user, array $args): array
  {
    $supplier = Supplier::where('company_id', $user->company_id)
      ->where('name', 'like', $args['supplier_name'] ?? '')
      ->first();

    $branchId = $this->resolveBranchId($user, $args);
    $branch = $branchId ? Branch::find($branchId) : null;

    $items = collect($args['items'] ?? [])->map(function ($row) use ($user) {
      $item = Item::where('company_id', $user->company_id)
        ->where('name', 'like', $row['item_name'] ?? '')
        ->first();

      $qty = (int) ($row['quantity'] ?? 0);
      $price = (float) ($row['price'] ?? 0);

      return [
        'item_name' => $item?->name ?? ($row['item_name'] ?? 'Tidak ditemukan'),
        'item_valid' => (bool) $item,
        'quantity' => $qty,
        'price' => $price,
        'subtotal' => $qty * $price,
      ];
    });

    return [
      'supplier_name' => $supplier?->name ?? ($args['supplier_name'] ?? 'Tidak ditemukan'),
      'supplier_valid' => (bool) $supplier,
      'branch_name' => $branch?->name ?? 'Tidak ditentukan',
      'branch_valid' => (bool) $branch,
      'items' => $items->values(),
      'total_price' => $items->sum('subtotal'),
      'items_warning' => $items->isEmpty() ? 'BELUM ADA BARANG DIPILIH — jangan konfirmasi, minta AI tanya barang & jumlahnya dulu.' : null,
      'date' => $args['date'] ?? now()->toDateString(),
    ];
  }

  public function execute(User $user, array $args): array
  {
    $validated = Validator::make($args, [
      'supplier_name' => 'required|string',
      'items' => 'required|array|min:1',
      'items.*.item_name' => 'required|string',
      'items.*.quantity' => 'required|integer|min:1',
      'items.*.price' => 'required|numeric|min:0',
      'date' => 'nullable|date',
    ])->validate();

    $supplier = Supplier::where('company_id', $user->company_id)
      ->where('name', $validated['supplier_name'])
      ->firstOrFail();

    $branchId = $this->resolveBranchId($user, $args);
    if (!$branchId) {
      throw new \RuntimeException('Cabang tujuan PO tidak ditemukan atau belum ditentukan.');
    }

    $po = DB::transaction(function () use ($user, $supplier, $branchId, $validated) {
      $lastId = PurchaseOrder::where('company_id', $user->company_id)->max('id') ?? 0;
      $poNumber = 'PO-' . str_pad($lastId + 1, 5, '0', STR_PAD_LEFT);

      $total = 0;
      $rows = [];

      foreach ($validated['items'] as $row) {
        $item = Item::where('company_id', $user->company_id)
          ->where('name', $row['item_name'])
          ->firstOrFail();

        $subtotal = $row['quantity'] * $row['price'];
        $total += $subtotal;

        $rows[] = [
          'inventory_item_id' => $item->id,
          'quantity' => $row['quantity'],
          'price' => $row['price'],
        ];
      }

      $po = PurchaseOrder::create([
        'company_id' => $user->company_id,
        'po_number' => $poNumber,
        'branch_id' => $branchId,
        'supplier_id' => $supplier->id,
        'total_price' => $total,
        'status' => 'waiting_fulfilment',
        'date' => $validated['date'] ?? now()->toDateString(),
      ]);

      foreach ($rows as $row) {
        PurchaseOrderItem::create($row + ['purchase_order_id' => $po->id]);
      }

      return $po;
    });

    return ['po_id' => $po->id, 'po_number' => $po->po_number, 'total_price' => (float) $po->total_price];
  }

  public function formFields(User $user, array $currentArgs): array
  {
    $suppliers = Supplier::where('company_id', $user->company_id)->orderBy('name')->pluck('name');
    $fields = [
      ['name' => 'supplier_name', 'label' => 'Supplier', 'type' => 'select', 'required' => true, 'value' => $currentArgs['supplier_name'] ?? '', 'options' => $suppliers->values()->all()],
    ];

    if ($user->isOwner()) {
      $branches = Branch::where('company_id', $user->company_id)->orderBy('name')->pluck('name');
      $fields[] = ['name' => 'branch_name', 'label' => 'Cabang Tujuan', 'type' => 'select', 'required' => true, 'value' => $currentArgs['branch_name'] ?? '', 'options' => $branches->values()->all()];
    }

    return $fields;
  }
}
