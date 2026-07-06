<?php

namespace App\Models\Settings;

use Illuminate\Database\Eloquent\Model;

class Branch extends Model
{
    protected $fillable = ['company_id', 'name', 'address', 'phone', 'status'];

    public function company()
    {
        return $this->belongsTo(Company::class);
    }
}