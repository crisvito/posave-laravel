@component('mail::message')
    # {{ $companyName ?? 'POSAVE' }}

    Terima kasih sudah berbelanja! Berikut rincian struk untuk transaksi **{{ $transaction->invoice_no }}**.

    **Tanggal:** {{ $transaction->transacted_at->translatedFormat('d F Y, H:i') }}
    **Metode Pembayaran:** {{ strtoupper($transaction->payment_method) }}

    @component('mail::table')
        | Barang | Qty | Harga | Subtotal |
        | :----- | :-: | ----: | -------: |
        @foreach ($transaction->items as $item)
            | {{ $item->product_name }} | {{ $item->qty }} | Rp {{ number_format($item->unit_price, 0, ',', '.') }} | Rp
            {{ number_format($item->subtotal, 0, ',', '.') }} |
        @endforeach
    @endcomponent

    **Total: Rp {{ number_format($transaction->total_amount, 0, ',', '.') }}**

    Terima kasih,<br>
    {{ $companyName ?? config('app.name') }}
@endcomponent
