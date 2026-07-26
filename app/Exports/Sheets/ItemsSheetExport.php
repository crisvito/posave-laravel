<?php

namespace App\Exports\Sheets;

use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithTitle;

class ItemsSheetExport implements FromCollection, WithHeadings, WithMapping, WithTitle
{
  public function __construct(private Collection $rows) {}

  public function collection(): Collection
  {
    return $this->rows;
  }

  public function headings(): array
  {
    return ['Nama Barang', 'SKU', 'Kategori', 'Harga Jual (Rp)', 'HPP (Rp)'];
  }

  public function map($row): array
  {
    return [
      $row->name,
      $row->sku,
      $row->category->name,
      $row->price,
      $row->cost,
    ];
  }

  public function title(): string
  {
    return 'Barang';
  }
}
