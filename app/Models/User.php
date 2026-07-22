<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use App\Models\Advance\Messaging\Broadcast;
use App\Models\Advance\Messaging\Conversation;
use App\Models\Advance\Messaging\Message;
use App\Models\Advance\Messaging\Note;
use App\Models\Auth\Branch;
use App\Models\Auth\Company;
use App\Models\Auth\UserProfile;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'company_id',
        'google_id',
        'branch_id',
        'role',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    public function profile(): HasOne
    {
        return $this->hasOne(UserProfile::class);
    }

    public function isOwner(): bool
    {
        return $this->role === 'owner';
    }

    public function isBranchManager(): bool
    {
        return $this->role === 'branch_manager';
    }

    public function isCashier(): bool
    {
        return $this->role === 'cashier';
    }

    public function isAdvance(): bool
    {
        return $this->company?->type === 'advance';
    }

    public function isLite(): bool
    {
        return $this->company?->type === 'lite';
    }
    public function conversations(): BelongsToMany
    {
        return $this->belongsToMany(Conversation::class, 'conversation_user')
            ->withPivot('last_read_at')
            ->withTimestamps();
    }

    public function messages(): HasMany
    {
        return $this->hasMany(Message::class);
    }

    public function notes(): HasMany
    {
        return $this->hasMany(Note::class);
    }

    public function broadcasts(): HasMany
    {
        return $this->hasMany(Broadcast::class);
    }
}
