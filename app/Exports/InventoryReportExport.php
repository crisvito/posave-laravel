<?php

namespace App\Exports;

use App\Exports\Sheets\AdjustmentsSheetExport;
use App\Exports\Sheets\ItemsSheetExport;
use App\Exports\Sheets\PurchaseOrdersSheetExport;
use App\Exports\Sheets\TransfersSheetExport;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;

class InventoryReportExport implements WithMultipleSheets
{
    public function __construct(
        private array|Collection $data,
        private string $type,
    ) {}

    public function sheets(): array
    {
        if ($this->type === 'all') {
            return [
                new TransfersSheetExport($this->data['transfers']),
                new AdjustmentsSheetExport($this->data['adjustments']),
                new PurchaseOrdersSheetExport($this->data['purchase_orders']),
                new ItemsSheetExport($this->data['items']),
            ];
        }

        return match ($this->type) {
            'transfers' => [new TransfersSheetExport($this->data)],
            'adjustments' => [new AdjustmentsSheetExport($this->data)],
            'purchase_orders' => [new PurchaseOrdersSheetExport($this->data)],
            'items' => [new ItemsSheetExport($this->data)],
            default => [],
        };
    }
}
