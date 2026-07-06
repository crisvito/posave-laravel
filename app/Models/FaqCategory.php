<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class FaqCategory extends Model
{
    protected $fillable = [
        'name_id',
        'name_en',
        'slug',
        'sort_order',
    ];

    public function faqs(): HasMany
    {
        return $this->hasMany(Faq::class);
    }
}