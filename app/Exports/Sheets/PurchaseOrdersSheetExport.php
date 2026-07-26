<?php

namespace App\Exports\Sheets;

use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithTitle;

class PurchaseOrdersSheetExport implements FromCollection, WithHeadings, WithMapping, WithTitle
{
  public function __construct(private Collection $rows) {}

  public function collection(): Collection
  {
    return $this->rows;
  }

  public function headings(): array
  {
    return ['Tanggal', 'Nomor PO', 'Cabang', 'Pemasok', 'Total Harga (Rp)', 'Status'];
  }

  public function map($row): array
  {
    $statusLabel = match ($row->status) {
      'waiting_fulfilment' => 'Menunggu',
      'success' => 'Selesai',
      'cancelled' => 'Dibatalkan',
      default => $row->status,
    };

    return [
      $row->date,
      $row->po_number,
      $row->branch->name,
      $row->supplier->name,
      $row->total_price,
      $statusLabel,
    ];
  }

  public function title(): string
  {
    return 'Pembelian';
  }
}
