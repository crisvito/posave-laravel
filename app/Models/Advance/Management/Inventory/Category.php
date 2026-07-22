<?php

namespace App\Models\Advance\Management\Inventory;

use App\Models\Auth\Company;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $table = 'inventory_categories';

    protected $fillable = ['name', 'company_id', 'color', 'is_active'];

    public function items()
    {
        return $this->hasMany(Item::class, 'category_id');
    }
    public function company()
    {
        return $this->belongsTo(Company::class);
    }
}
