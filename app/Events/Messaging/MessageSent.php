<?php

namespace App\Events\Messaging;

use App\Models\Advance\Messaging\Message;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class MessageSent implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public Message $message,
    ) {
        $this->message->load(['sender', 'attachments']);
        $this->message->loadMissing('conversation.members');
    }

    public function broadcastOn(): array
    {
        $channels = [
            new PresenceChannel('conversation.' . $this->message->conversation_id),
        ];

        foreach ($this->message->conversation->members as $member) {
            if ($member->id === $this->message->user_id) {
                continue;
            }
            $channels[] = new PrivateChannel('App.Models.User.' . $member->id);
        }

        return $channels;
    }

    public function broadcastWith(): array
    {
        return [
            'id'              => $this->message->id,
            'conversation_id' => $this->message->conversation_id,
            'body'            => $this->message->body,
            'sender'          => [
                'id'   => $this->message->sender->id,
                'name' => $this->message->sender->name,
            ],
            'attachments' => $this->message->attachments->map(fn($a) => [
                'id'        => $a->id,
                'file_name' => $a->file_name,
                'file_type' => $a->file_type,
                'url'       => $a->url(),
            ]),
            'created_at' => $this->message->created_at->toISOString(),
        ];
    }

    public function broadcastAs(): string
    {
        return 'message.sent';
    }
}
