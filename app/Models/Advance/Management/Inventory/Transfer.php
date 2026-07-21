<?php

namespace App\Models\Advance\Management\Inventory;

use App\Models\Auth\Branch;
use App\Models\Auth\Company;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\User;

class Transfer extends Model
{
    protected $fillable = [
        'company_id',
        'transfer_number',
        'sender_branch_id',
        'receiver_branch_id',
        'status',
        'rejection_note',
        'requested_by_branch_id',
        'date',
    ];
    protected $appends = ['approver_branch_id'];

    public function items(): HasMany
    {
        return $this->hasMany(TransferItem::class, 'transfer_id');
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function senderBranch(): BelongsTo
    {
        return $this->belongsTo(Branch::class, 'sender_branch_id');
    }

    public function receiverBranch(): BelongsTo
    {
        return $this->belongsTo(Branch::class, 'receiver_branch_id');
    }

    public function requestedByBranch(): BelongsTo
    {
        return $this->belongsTo(Branch::class, 'requested_by_branch_id');
    }

    public function getApproverBranchIdAttribute(): int
    {
        if ($this->requested_by_branch_id === null) {
            return $this->receiver_branch_id;
        }

        return $this->requested_by_branch_id === $this->sender_branch_id
            ? $this->receiver_branch_id
            : $this->sender_branch_id;
    }

    public static function pendingApprovalFor(User $user)
    {
        return static::where('company_id', $user->company_id)
            ->where('status', 'waiting')
            ->with(['senderBranch', 'receiverBranch'])
            ->get()
            ->filter(fn(self $t) => $t->approver_branch_id === $user->branch_id)
            ->values();
    }
}
