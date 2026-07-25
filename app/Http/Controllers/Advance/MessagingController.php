<?php

namespace App\Http\Controllers\Advance;

use App\Events\Messaging\BroadcastCreated;
use App\Events\Messaging\MessageSent;
use App\Http\Controllers\Controller;
use App\Models\Advance\Messaging\Broadcast;
use App\Models\Advance\Messaging\Conversation;
use App\Models\Advance\Messaging\Message;
use App\Models\Advance\Messaging\MessageAttachment;
use App\Models\Advance\Messaging\Note;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class MessagingController extends Controller
{
    private function getUser(): User
    {
        /** @var User $user */
        $user = Auth::user();
        return $user;
    }

    // ─── Halaman utama ─────────────────────────────────────────────

    public function index()
    {
        $user = $this->getUser();

        $conversations = $user->conversations()
            ->with(['members', 'latestMessage.sender'])
            ->get()
            ->map(function ($conv) use ($user) {
                $lastReadAt = $conv->pivot->last_read_at;
                $conv->unread_count = $conv->messages()
                    ->where('user_id', '!=', $user->id)
                    ->when($lastReadAt, fn($q) => $q->where('created_at', '>', $lastReadAt))
                    ->count();
                return $conv;
            })
            ->sortByDesc(fn($c) => $c->latestMessage?->created_at)
            ->values();

        $broadcasts = $this->getRelevantBroadcasts($user);
        $notes      = $user->notes()->orderByDesc('created_at')->get();

        $contacts = User::where('company_id', $user->company_id)
            ->where('id', '!=', $user->id)
            ->select('id', 'name', 'email', 'role')
            ->get();

        return Inertia::render('advance/messaging/message', [
            'conversations' => $conversations,
            'broadcasts'    => $broadcasts,
            'notes'         => $notes,
            'contacts'      => $contacts,
            'auth_user'     => [
                'id'   => $user->id,
                'name' => $user->name,
                'role' => $user->role,
                'company_id' => $user->company_id
            ],
        ]);
    }

    // ─── Ambil pesan ───────────────────────────────────────────────
    public function unreadCount()
    {
        $user = $this->getUser();

        $count = $user->conversations()
            ->get()
            ->sum(function ($conv) use ($user) {
                $lastReadAt = $conv->pivot->last_read_at;
                return $conv->messages()
                    ->where('user_id', '!=', $user->id)
                    ->when($lastReadAt, fn($q) => $q->where('created_at', '>', $lastReadAt))
                    ->count();
            });

        return response()->json(['unread_count' => $count]);
    }

    public function getMessages(Conversation $conversation)
    {
        $user = $this->getUser();

        abort_if(
            !$conversation->members()->where('user_id', $user->id)->exists(),
            403
        );

        $messages = $conversation->messages()
            ->with(['sender', 'attachments'])
            ->orderBy('created_at')
            ->get()
            ->map(fn($msg) => [
                'id'          => $msg->id,
                'body'        => $msg->body,
                'sender'      => ['id' => $msg->sender->id, 'name' => $msg->sender->name],
                'attachments' => $msg->attachments->map(fn($a) => [
                    'id'        => $a->id,
                    'file_name' => $a->file_name,
                    'file_type' => $a->file_type,
                    'url'       => $a->url(),
                ]),
                'created_at' => $msg->created_at->toISOString(),
                'is_mine'    => $msg->user_id === $user->id,
            ]);

        $conversation->members()->updateExistingPivot($user->id, [
            'last_read_at' => now(),
        ]);

        return response()->json([
            'conversation' => [
                'id'      => $conversation->id,
                'name'    => $conversation->name,
                'type'    => $conversation->type,
                'members' => $conversation->members->map(fn($m) => [
                    'id'   => $m->id,
                    'name' => $m->name,
                ]),
            ],
            'messages' => $messages,
        ]);
    }

    // ─── Kirim pesan ───────────────────────────────────────────────
    public function markRead(Conversation $conversation)
    {
        $user = $this->getUser();

        abort_if(
            !$conversation->members()->where('user_id', $user->id)->exists(),
            403
        );

        $conversation->members()->updateExistingPivot($user->id, [
            'last_read_at' => now(),
        ]);

        return response()->json(['success' => true]);
    }

    public function sendMessage(Request $request, Conversation $conversation)
    {
        $user = $this->getUser();

        abort_if(
            !$conversation->members()->where('user_id', $user->id)->exists(),
            403
        );

        $request->validate([
            'body'          => 'nullable|string|max:5000',
            'attachments'   => 'nullable|array|max:5',
            'attachments.*' => 'file|max:10240',
        ]);

        abort_if(!$request->body && !$request->hasFile('attachments'), 422);

        $message = Message::create([
            'conversation_id' => $conversation->id,
            'user_id'         => $user->id,
            'body'            => $request->body,
        ]);

        $conversation->members()->updateExistingPivot($user->id, [
            'last_read_at' => now(),
        ]);

        if ($request->hasFile('attachments')) {
            foreach ($request->file('attachments') as $file) {
                $path = $file->store('messages/attachments', 'public');

                MessageAttachment::create([
                    'message_id' => $message->id,
                    'file_path'  => $path,
                    'file_name'  => $file->getClientOriginalName(),
                    'file_type'  => $file->getMimeType(),
                    'file_size'  => $file->getSize(),
                ]);
            }
        }

        broadcast(new MessageSent($message))->toOthers();

        return response()->json(['success' => true]);
    }

    // ─── Buat private conversation ─────────────────────────────────

    public function startPrivateConversation(Request $request)
    {
        $user = $this->getUser();

        $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

        $targetUser = User::where('id', $request->user_id)
            ->where('company_id', $user->company_id)
            ->firstOrFail();

        $existing = Conversation::where('company_id', $user->company_id)
            ->where('type', 'private')
            ->whereHas('members', fn($q) => $q->where('user_id', $user->id))
            ->whereHas('members', fn($q) => $q->where('user_id', $targetUser->id))
            ->first();

        if ($existing) {
            return response()->json(['conversation_id' => $existing->id]);
        }

        $conversation = Conversation::create([
            'company_id' => $user->company_id,
            'type'       => 'private',
            'name'       => null,
        ]);

        $conversation->members()->attach([
            $user->id       => ['last_read_at' => now()],
            $targetUser->id => ['last_read_at' => null],
        ]);

        return response()->json(['conversation_id' => $conversation->id]);
    }

    // ─── Broadcast ─────────────────────────────────────────────────

    public function storeBroadcast(Request $request)
    {
        $user = $this->getUser();

        abort_if(!$user->isOwner() && !$user->isBranchManager(), 403);

        $request->validate([
            'content' => 'required|string|max:1000',
        ]);

        $broadcast = Broadcast::create([
            'company_id' => $user->company_id,
            'branch_id'  => $user->isBranchManager() ? $user->branch_id : null,
            'user_id'    => $user->id,
            'content'    => $request->content,
        ]);

        broadcast(new BroadcastCreated($broadcast));

        return response()->json(['success' => true]);
    }

    // ─── Note ──────────────────────────────────────────────────────

    public function storeNote(Request $request)
    {
        $user = $this->getUser();

        $request->validate(['content' => 'required|string|max:2000']);

        $note = Note::create([
            'user_id' => $user->id,
            'content' => $request->content,
        ]);

        return response()->json($note);
    }

    public function updateNote(Request $request, Note $note)
    {
        $user = $this->getUser();
        abort_if($note->user_id !== $user->id, 403);

        $request->validate(['content' => 'required|string|max:2000']);

        $note->update(['content' => $request->content]);

        return response()->json($note);
    }

    public function destroyNote(Note $note)
    {
        $user = $this->getUser();
        abort_if($note->user_id !== $user->id, 403);

        $note->delete();

        return response()->json(['success' => true]);
    }

    // ─── Helper ────────────────────────────────────────────────────

    private function getRelevantBroadcasts(User $user)
    {
        return Broadcast::where('company_id', $user->company_id)
            ->where(function ($query) use ($user) {
                if ($user->isOwner()) {
                    $query->whereNull('branch_id')
                        ->orWhereNotNull('branch_id');
                } else {
                    $query->whereNull('branch_id')
                        ->orWhere('branch_id', $user->branch_id);
                }
            })
            ->with('sender')
            ->orderByDesc('created_at')
            ->take(10)
            ->get()
            ->map(fn($b) => [
                'id'         => $b->id,
                'content'    => $b->content,
                'sender'     => ['id' => $b->sender->id, 'name' => $b->sender->name],
                'branch_id'  => $b->branch_id,
                'created_at' => $b->created_at->toISOString(),
            ]);
    }
}
