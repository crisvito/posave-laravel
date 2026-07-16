<?php

namespace App\Models\Auth;

use App\Models\Advance\Messaging\Broadcast;
use App\Models\Advance\Management\Settings\ReceiptSetting;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use App\Models\User;

class Company extends Model
{
    use HasFactory;

    protected $fillable = ['owner_id', 'type'];

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function profile(): HasOne
    {
        return $this->hasOne(CompanyProfile::class);
    }

    public function branches(): HasMany
    {
        return $this->hasMany(Branch::class);
    }

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function isLite(): bool
    {
        return $this->type === 'lite';
    }

    public function isAdvance(): bool
    {
        return $this->type === 'advance';
    }
    public function receiptSetting(): HasOne
    {
        return $this->hasOne(ReceiptSetting::class);
    }
    public function broadcasts(): HasMany
    {
        return $this->hasMany(Broadcast::class);
    }
}
