<?php

namespace App\Exports\Sheets;

use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithTitle;

class TransfersSheetExport implements FromCollection, WithHeadings, WithMapping, WithTitle
{
  public function __construct(private Collection $rows) {}

  public function collection(): Collection
  {
    return $this->rows;
  }

  public function headings(): array
  {
    return ['Tanggal', 'Nomor Kiriman', 'Cabang Pengirim', 'Cabang Penerima', 'Jumlah Barang', 'Status', 'Catatan Penolakan'];
  }

  public function map($row): array
  {
    $statusLabel = match ($row->status) {
      'waiting' => 'Menunggu',
      'success' => 'Diterima',
      'rejected' => 'Ditolak',
      default => $row->status,
    };

    return [
      $row->date,
      $row->transfer_number,
      $row->senderBranch->name,
      $row->receiverBranch->name,
      $row->items_count,
      $statusLabel,
      $row->rejection_note ?? '-',
    ];
  }

  public function title(): string
  {
    return 'Kiriman';
  }
}
