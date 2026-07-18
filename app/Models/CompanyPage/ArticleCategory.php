<?php

namespace App\Models\CompanyPage;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ArticleCategory extends Model
{
    protected $fillable = [
        'name',
        'name_en',
        'slug',
        'sort_order',
    ];

    public function articles(): HasMany
    {
        return $this->hasMany(Article::class);
    }
}
