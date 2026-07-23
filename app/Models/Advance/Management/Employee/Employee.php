<?php

namespace App\Models\Advance\Management\Employee;

use App\Models\Auth\Branch;
use App\Models\Auth\Company;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Employee extends Model
{
    use HasFactory, SoftDeletes;

    public const ASSIGNABLE_ROLES = ['branch_manager', 'cashier'];

    protected $fillable = [
        'user_id',
        'company_id',
        'branch_id',
        'name',
        'role',
        'active_date',
        'slot_status',
        'is_active',
    ];

    protected $casts = [
        'active_date' => 'date',
        'is_active' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }
}
