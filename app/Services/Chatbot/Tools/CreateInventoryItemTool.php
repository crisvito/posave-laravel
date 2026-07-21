<?php

namespace App\Services\Chatbot\Tools;

use App\Models\Advance\Management\Inventory\BranchStock;
use App\Models\Advance\Management\Inventory\Category;
use App\Models\Advance\Management\Inventory\Item;
use App\Models\User;
use Illuminate\Support\Facades\Validator;

class CreateInventoryItemTool implements ToolInterface
{
  public function name(): string
  {
    return 'create_inventory_item';
  }

  public function description(): string
  {
    return 'Tambah barang baru ke katalog. WAJIB tanya user dulu kalau nama/harga/kategori belum lengkap — jangan asal isi sendiri. '
      . 'Harga modal (cost) opsional tapi sebaiknya diisi supaya laporan margin & penyesuaian stok nanti akurat. '
      . 'Tool ini cuma nyiapin draft, belum langsung nyimpen — user tetap harus konfirmasi lewat tombol yang muncul.';
  }

  public function parameters(): array
  {
    return [
      'type' => 'object',
      'properties' => [
        'name' => ['type' => 'string', 'description' => 'Nama barang'],
        'price' => ['type' => 'number', 'description' => 'Harga jual dalam Rupiah'],
        'cost' => ['type' => 'number', 'description' => 'Harga modal / HPP dalam Rupiah. Opsional — kalau tidak disebut, disimpan 0 dan bisa diisi belakangan.'],
        'category_name' => ['type' => 'string', 'description' => 'Nama kategori (harus salah satu kategori yang sudah ada)'],
        'initial_stock' => ['type' => 'integer', 'description' => 'Stok awal, default 0 kalau tidak disebut'],
      ],
      'required' => ['name', 'price', 'category_name'],
    ];
  }

  public function isReadOnly(): bool
  {
    return false;
  }

  public function isAvailableFor(User $user): bool
  {
    // Katalog itu keputusan level company — sama persis batasan yang udah
    // kita terapin di ItemController: cuma Owner (Advance) atau siapapun di Lite.
    if ($user->company?->isLite()) {
      return true;
    }
    return $user->isOwner();
  }

  /** Dipanggil pas nyiapin draft — validasi di sini, TAPI belum nulis ke database. */
  public function summarize(User $user, array $args): array
  {
    $category = Category::where('company_id', $user->company_id)
      ->where('name', 'like', $args['category_name'] ?? '')
      ->first();

    return [
      'name' => $args['name'] ?? null,
      'price' => (float) ($args['price'] ?? 0),
      'cost' => (float) ($args['cost'] ?? 0),
      'category_name' => $category?->name ?? ($args['category_name'] ?? 'Tidak ditemukan'),
      'category_valid' => (bool) $category,
      'initial_stock' => (int) ($args['initial_stock'] ?? 0),
    ];
  }

  /** Dipanggil CUMA setelah user klik tombol Konfirmasi. */
  public function execute(User $user, array $args): array
  {
    $validated = Validator::make($args, [
      'name' => 'required|string|max:255',
      'price' => 'required|numeric|min:0',
      'cost' => 'nullable|numeric|min:0',
      'category_name' => 'required|string',
      'initial_stock' => 'nullable|integer|min:0',
    ])->validate();

    $category = Category::where('company_id', $user->company_id)
      ->where('name', $validated['category_name'])
      ->firstOrFail();

    $item = Item::create([
      'company_id' => $user->company_id,
      'name' => $validated['name'],
      'category_id' => $category->id,
      'price' => $validated['price'],
      'cost' => $validated['cost'] ?? 0,
      'is_active' => true,
      'sku' => Item::generateSku(),
    ]);

    BranchStock::create([
      'branch_id' => $user->branch_id,
      'inventory_item_id' => $item->id,
      'current_stock' => $validated['initial_stock'] ?? 0,
      'min_stock' => 0,
    ]);

    return ['item_id' => $item->id, 'name' => $item->name];
  }

  public function formFields(User $user, array $currentArgs): array
  {
    $categories = Category::where('company_id', $user->company_id)->orderBy('name')->pluck('name');

    return [
      ['name' => 'name', 'label' => 'Nama Barang', 'type' => 'text', 'required' => true, 'value' => $currentArgs['name'] ?? ''],
      ['name' => 'price', 'label' => 'Harga Jual (Rp)', 'type' => 'number', 'required' => true, 'value' => $currentArgs['price'] ?? ''],
      ['name' => 'cost', 'label' => 'Harga Modal / HPP (Rp, opsional)', 'type' => 'number', 'required' => false, 'value' => $currentArgs['cost'] ?? ''],
      ['name' => 'category_name', 'label' => 'Kategori', 'type' => 'select', 'required' => true, 'value' => $currentArgs['category_name'] ?? '', 'options' => $categories->values()->all()],
      ['name' => 'initial_stock', 'label' => 'Stok Awal (opsional)', 'type' => 'number', 'required' => false, 'value' => $currentArgs['initial_stock'] ?? 0],
    ];
  }
}
