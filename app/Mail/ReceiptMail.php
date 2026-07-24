<?php

namespace App\Mail;

use App\Models\Advance\Transaction\Transaction;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ReceiptMail extends Mailable
{
  use Queueable, SerializesModels;

  public function __construct(
    public Transaction $transaction,
    public ?string $companyName = null,
  ) {
    $this->transaction->loadMissing('items');
  }

  public function envelope(): Envelope
  {
    return new Envelope(
      subject: 'Struk Belanja ' . $this->transaction->invoice_no . ($this->companyName ? ' - ' . $this->companyName : ''),
    );
  }

  public function content(): Content
  {
    return new Content(
      markdown: 'emails.receipt',
      with: [
        'transaction' => $this->transaction,
        'companyName' => $this->companyName,
      ],
    );
  }
}
