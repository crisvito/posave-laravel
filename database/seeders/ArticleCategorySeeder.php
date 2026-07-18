<?php

namespace Database\Seeders;

use App\Models\CompanyPage\ArticleCategory;
use Illuminate\Database\Seeder;

class ArticleCategorySeeder extends Seeder
{
  public function run(): void
  {
    $categories = [
      ['name' => 'Tips Bisnis', 'name_en' => 'Business Tips', 'slug' => 'tips-bisnis', 'sort_order' => 1],
      ['name' => 'Keuangan', 'name_en' => 'Finance', 'slug' => 'keuangan', 'sort_order' => 2],
      ['name' => 'Teknologi', 'name_en' => 'Technology', 'slug' => 'teknologi', 'sort_order' => 3],
      ['name' => 'Manajemen Toko', 'name_en' => 'Store Management', 'slug' => 'manajemen-toko', 'sort_order' => 4],
    ];

    foreach ($categories as $category) {
      ArticleCategory::create($category);
    }
  }
}
