<?php

namespace App\Services\Chatbot\Tools;

use App\Models\Advance\Management\Inventory\BranchStock;
use App\Models\Advance\Management\Inventory\PurchaseOrder;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class UpdatePurchaseOrderStatusTool implements ToolInterface
{
  public function name(): string
  {
    return 'update_purchase_order_status';
  }

  public function description(): string
  {
    return 'Selesaikan atau batalkan pembelian (purchase order) yang masih menunggu. '
      . 'Selesaikan ("success") berarti barang sudah diterima — stok cabang otomatis bertambah sesuai isi PO. '
      . 'Kalau user tidak sebutkan PO mana, atau ada lebih dari satu PO yang masih menunggu, JANGAN menebak — '
      . 'sistem akan otomatis menampilkan daftar PO yang bisa dipilih.';
  }

  public function parameters(): array
  {
    return [
      'type' => 'object',
      'properties' => [
        'po_number' => ['type' => 'string', 'description' => 'Nomor PO yang mau diubah statusnya.'],
        'new_status' => ['type' => 'string', 'enum' => ['success', 'cancelled'], 'description' => '"success" kalau barang sudah diterima (selesaikan), "cancelled" kalau dibatalkan.'],
      ],
      'required' => ['po_number', 'new_status'],
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

  private function findPo(User $user, string $poNumber): ?PurchaseOrder
  {
    $query = PurchaseOrder::where('company_id', $user->company_id)->where('po_number', $poNumber);

    if ($user->isBranchManager()) {
      $query->where('branch_id', $user->branch_id);
    }

    return $query->first();
  }

  public function summarize(User $user, array $args): array
  {
    $po = $this->findPo($user, $args['po_number'] ?? '');

    if (!$po) {
      return ['po_number' => $args['po_number'] ?? null, 'po_valid' => false];
    }

    return [
      'po_number' => $po->po_number,
      'po_valid' => true,
      'supplier_name' => $po->supplier?->name,
      'current_status' => $po->status,
      'already_final' => $po->status !== 'waiting_fulfilment',
      'new_status' => $args['new_status'] ?? null,
      'total_price' => (float) $po->total_price,
    ];
  }

  public function execute(User $user, array $args): array
  {
    $validated = Validator::make($args, [
      'po_number' => 'required|string',
      'new_status' => 'required|in:success,cancelled',
    ])->validate();

    $po = $this->findPo($user, $validated['po_number']);

    if (!$po) {
      throw new \RuntimeException("PO \"{$validated['po_number']}\" tidak ditemukan.");
    }
    if ($po->status !== 'waiting_fulfilment') {
      throw new \RuntimeException("PO \"{$po->po_number}\" sudah berstatus \"{$po->status}\", tidak bisa diubah lagi.");
    }

    DB::transaction(function () use ($po, $validated) {
      $po->update(['status' => $validated['new_status']]);

      // Selesai = barang diterima → tambah stok cabang sesuai isi PO.
      if ($validated['new_status'] === 'success') {
        foreach ($po->items as $poItem) {
          BranchStock::updateOrCreate(
            ['branch_id' => $po->branch_id, 'inventory_item_id' => $poItem->inventory_item_id],
            []
          )->increment('current_stock', $poItem->quantity);
        }
      }
    });

    return ['po_number' => $po->po_number, 'new_status' => $validated['new_status']];
  }

  public function formFields(User $user, array $currentArgs): array
  {
    $query = PurchaseOrder::where('company_id', $user->company_id)
      ->where('status', 'waiting_fulfilment')
      ->with('supplier:id,name');

    if ($user->isBranchManager()) {
      $query->where('branch_id', $user->branch_id);
    }

    $poNumbers = $query->orderByDesc('date')->get()->pluck('po_number');

    return [
      ['name' => 'po_number', 'label' => 'Nomor PO', 'type' => 'select', 'required' => true, 'value' => $currentArgs['po_number'] ?? '', 'options' => $poNumbers->values()->all()],
      ['name' => 'new_status', 'label' => 'Status Baru', 'type' => 'select', 'required' => true, 'value' => $currentArgs['new_status'] ?? 'success', 'options' => ['success', 'cancelled']],
    ];
  }
}
