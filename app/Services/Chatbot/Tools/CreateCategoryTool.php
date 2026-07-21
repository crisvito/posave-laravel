<?php

namespace App\Services\Chatbot\Tools;

use App\Models\Advance\Management\Inventory\Category;
use App\Models\User;
use Illuminate\Support\Facades\Validator;

class CreateCategoryTool implements ToolInterface
{
  public function name(): string
  {
    return 'create_category';
  }

  public function description(): string
  {
    return 'Tambah kategori barang baru. WAJIB tanya user dulu kalau nama belum jelas — jangan asal isi sendiri. Tool ini cuma nyiapin draft, belum langsung nyimpen — user tetap harus konfirmasi lewat tombol yang muncul.';
  }

  public function parameters(): array
  {
    return [
      'type' => 'object',
      'properties' => [
        'name' => ['type' => 'string', 'description' => 'Nama kategori'],
        'color' => ['type' => 'string', 'description' => 'Warna kategori dalam format hex, misal #94a3b8. Kalau tidak disebut, pakai warna default.'],
      ],
      'required' => ['name'],
    ];
  }

  public function isReadOnly(): bool
  {
    return false;
  }

  public function isAvailableFor(User $user): bool
  {
    if ($user->company?->isLite()) {
      return true;
    }
    return $user->isOwner();
  }

  public function summarize(User $user, array $args): array
  {
    $duplicate = Category::where('company_id', $user->company_id)
      ->where('name', 'like', $args['name'] ?? '')
      ->exists();

    return [
      'name' => $args['name'] ?? null,
      'color' => $args['color'] ?? '#94a3b8',
      'name_available' => !$duplicate,
    ];
  }

  public function execute(User $user, array $args): array
  {
    $validated = Validator::make($args, [
      'name' => 'required|string|max:255',
      'color' => 'nullable|regex:/^#[0-9a-fA-F]{6}$/',
    ])->validate();

    $exists = Category::where('company_id', $user->company_id)
      ->where('name', $validated['name'])
      ->exists();

    if ($exists) {
      throw new \RuntimeException("Kategori \"{$validated['name']}\" sudah ada.");
    }

    $category = Category::create([
      'company_id' => $user->company_id,
      'name' => $validated['name'],
      'color' => $validated['color'] ?? '#94a3b8',
    ]);

    return ['category_id' => $category->id, 'name' => $category->name];
  }

  public function formFields(User $user, array $currentArgs): array
  {
    return [
      ['name' => 'name', 'label' => 'Nama Kategori', 'type' => 'text', 'required' => true, 'value' => $currentArgs['name'] ?? ''],
      ['name' => 'color', 'label' => 'Warna', 'type' => 'select', 'required' => false, 'value' => $currentArgs['color'] ?? '#94a3b8', 'options' => [
        '#94a3b8',
        '#3b82f6',
        '#10b981',
        '#f59e0b',
        '#ef4444',
        '#8b5cf6',
        '#ec4899',
        '#14b8a6',
      ]],
    ];
  }
}
