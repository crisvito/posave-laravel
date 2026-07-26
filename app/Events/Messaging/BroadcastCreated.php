<?php

namespace App\Events\Messaging;

use App\Models\Advance\Messaging\Broadcast;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class BroadcastCreated implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public Broadcast $broadcast,
    ) {
        $this->broadcast->load('sender');
    }

    public function broadcastOn(): array
    {
        // Kalau company-wide (branch_id null) → broadcast ke channel company
        // Kalau per-branch → broadcast ke channel branch
        if ($this->broadcast->isCompanyWide()) {
            return [
                new Channel('company.' . $this->broadcast->company_id . '.broadcasts'),
            ];
        }

        return [
            new Channel('branch.' . $this->broadcast->branch_id . '.broadcasts'),
        ];
    }

    public function broadcastWith(): array
    {
        return [
            'id'      => $this->broadcast->id,
            'content' => $this->broadcast->content,
            'sender'  => [
                'id'   => $this->broadcast->sender->id,
                'name' => $this->broadcast->sender->name,
            ],
            'branch_id'  => $this->broadcast->branch_id,
            'created_at' => $this->broadcast->created_at->toISOString(),
        ];
    }

    public function broadcastAs(): string
    {
        return 'broadcast.created';
    }
}
