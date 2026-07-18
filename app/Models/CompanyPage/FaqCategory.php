<?php

namespace App\Models\CompanyPage;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class FaqCategory extends Model
{
    protected $fillable = ['name', 'slug', 'sort_order', 'name_en'];

    public function faqs(): HasMany
    {
        return $this->hasMany(Faq::class);
    }
}
