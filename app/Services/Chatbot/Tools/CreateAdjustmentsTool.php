<?php

namespace App\Services\Chatbot\Tools;

use App\Models\Advance\Management\Inventory\Adjustment;
use App\Models\Advance\Management\Inventory\Item;
use App\Models\User;
use Illuminate\Support\Facades\Validator;

class CreateAdjustmentsTool implements ToolInterface
{
  public function name(): string
  {
    return 'create_adjustment';
  }

  public function description(): string
  {
    return 'Catat penyesuaian stok (adjustment) — barang rusak, hilang, kadaluarsa, atau ketemu lebih saat hitung ulang. '
      . 'WAJIB tanya user dulu kalau barang/jumlah/arah (bertambah atau berkurang) belum jelas — jangan asal isi sendiri. '
      . 'Tool ini cuma nyiapin draft, belum langsung nyimpen — user tetap harus konfirmasi lewat tombol yang muncul.';
  }

  public function parameters(): array
  {
    return [
      'type' => 'object',
      'properties' => [
        'item_name' => ['type' => 'string', 'description' => 'Nama barang yang disesuaikan stoknya'],
        'direction' => ['type' => 'string', 'enum' => ['in', 'out'], 'description' => '"in" kalau stok bertambah (misal ketemu lebih), "out" kalau stok berkurang (misal rusak/hilang)'],
        'quantity' => ['type' => 'integer', 'description' => 'Jumlah barang yang disesuaikan, selalu angka positif'],
        'note' => ['type' => 'string', 'description' => 'Alasan/catatan, misal "Barang rusak", "Hilang", "Ketemu lebih saat hitung ulang"'],
        'date' => ['type' => 'string', 'description' => 'Tanggal adjustment format YYYY-MM-DD. Kalau tidak disebut, pakai hari ini.'],
      ],
      'required' => ['item_name', 'direction', 'quantity', 'note'],
    ];
  }

  public function isReadOnly(): bool
  {
    return false;
  }

  public function isAvailableFor(User $user): bool
  {
    // Sama batasannya kayak GetAdjustmentsTool — yang boleh LIAT data adjustment,
    // boleh juga BIKIN adjustment (Branch Manager pegang stok cabangnya sendiri).
    if ($user->company?->isLite()) {
      return true;
    }
    return $user->isOwner() || $user->isBranchManager();
  }

  /** Dipanggil pas nyiapin draft — validasi & hitung dampak finansial di sini, TAPI belum nulis ke database. */
  public function summarize(User $user, array $args): array
  {
    $item = Item::where('company_id', $user->company_id)
      ->where('name', 'like', $args['item_name'] ?? '')
      ->first();

    $quantity = (int) ($args['quantity'] ?? 0);
    $direction = ($args['direction'] ?? 'out') === 'in' ? 1 : -1;
    $qtyChange = $quantity * $direction;

    // Nilai finansial dihitung dari harga modal (cost), bukan harga jual —
    // adjustment mencerminkan kerugian/pertambahan nilai persediaan riil.
    $financialChange = $item ? (float) $item->cost * $qtyChange : 0;

    return [
      'item_name' => $item?->name ?? ($args['item_name'] ?? 'Tidak ditemukan'),
      'item_valid' => (bool) $item,
      'direction' => $args['direction'] ?? 'out',
      'quantity' => $quantity,
      'qty_change' => $qtyChange,
      'financial_change' => $financialChange,
      'note' => $args['note'] ?? null,
      'date' => $args['date'] ?? now()->toDateString(),
    ];
  }

  /** Dipanggil CUMA setelah user klik tombol Konfirmasi. */
  public function execute(User $user, array $args): array
  {
    $validated = Validator::make($args, [
      'item_name' => 'required|string',
      'direction' => 'required|in:in,out',
      'quantity' => 'required|integer|min:1',
      'note' => 'required|string|max:255',
      'date' => 'nullable|date',
    ])->validate();

    $item = Item::where('company_id', $user->company_id)
      ->where('name', $validated['item_name'])
      ->firstOrFail();

    $qtyChange = $validated['quantity'] * ($validated['direction'] === 'in' ? 1 : -1);
    $financialChange = (float) $item->cost * $qtyChange;

    $adjustment = Adjustment::create([
      'inventory_item_id' => $item->id,
      'branch_id' => $user->branch_id,
      'note' => $validated['note'],
      'qty_change' => $qtyChange,
      'financial_change' => $financialChange,
      'date' => $validated['date'] ?? now()->toDateString(),
    ]);

    return ['adjustment_id' => $adjustment->id, 'item_name' => $item->name, 'qty_change' => $qtyChange];
  }

  public function formFields(User $user, array $currentArgs): array
  {
    $items = Item::where('company_id', $user->company_id)->orderBy('name')->pluck('name');

    return [
      ['name' => 'item_name', 'label' => 'Nama Barang', 'type' => 'select', 'required' => true, 'value' => $currentArgs['item_name'] ?? '', 'options' => $items->values()->all()],
      ['name' => 'direction', 'label' => 'Arah', 'type' => 'select', 'required' => true, 'value' => $currentArgs['direction'] ?? 'out', 'options' => ['in', 'out']],
      ['name' => 'quantity', 'label' => 'Jumlah', 'type' => 'number', 'required' => true, 'value' => $currentArgs['quantity'] ?? ''],
      ['name' => 'note', 'label' => 'Catatan', 'type' => 'text', 'required' => true, 'value' => $currentArgs['note'] ?? ''],
      ['name' => 'date', 'label' => 'Tanggal', 'type' => 'date', 'required' => false, 'value' => $currentArgs['date'] ?? now()->toDateString()],
    ];
  }
}
