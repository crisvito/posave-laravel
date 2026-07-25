<?php

namespace App\Models\Advance\Messaging;

use App\Models\Auth\Branch;
use App\Models\Auth\Company;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Conversation extends Model
{
    use HasFactory;

    protected $fillable = ['company_id', 'branch_id', 'type', 'name'];

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    public function members(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'conversation_user')
            ->withPivot('last_read_at')
            ->withTimestamps();
    }

    public function messages(): HasMany
    {
        return $this->hasMany(Message::class);
    }

    public function latestMessage(): HasOne
    {
        return $this->hasOne(Message::class)->latestOfMany();
    }

    public function isGroup(): bool
    {
        return $this->type === 'group';
    }

    public function isPrivate(): bool
    {
        return $this->type === 'private';
    }
    public static function unreadCountFor(User $user): int
    {
        return $user->conversations()
            ->get()
            ->sum(function ($conv) use ($user) {
                $lastReadAt = $conv->pivot->last_read_at;
                return $conv->messages()
                    ->where('user_id', '!=', $user->id)
                    ->when($lastReadAt, fn($q) => $q->where('created_at', '>', $lastReadAt))
                    ->count();
            });
    }
}
