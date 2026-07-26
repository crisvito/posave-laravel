<?php

namespace App\Exports\Sheets;

use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithTitle;

class AdjustmentsSheetExport implements FromCollection, WithHeadings, WithMapping, WithTitle
{
  public function __construct(private Collection $rows) {}

  public function collection(): Collection
  {
    return $this->rows;
  }

  public function headings(): array
  {
    return ['Tanggal', 'Barang', 'SKU', 'Cabang', 'Catatan', 'Perubahan Qty', 'Perubahan Nilai (Rp)'];
  }

  public function map($row): array
  {
    return [
      $row->date,
      $row->item->name,
      $row->item->sku,
      $row->branch->name,
      $row->note,
      $row->qty_change,
      $row->financial_change,
    ];
  }

  public function title(): string
  {
    return 'Perubahan Stok';
  }
}
