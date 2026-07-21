<?php

namespace App\Services\Chatbot\Tools;

use App\Models\Advance\Management\Employee\Employee;
use App\Models\Auth\Branch;
use App\Models\User;

class GetEmployeesTool implements ToolInterface
{
  public function name(): string
  {
    return 'get_employees';
  }

  public function description(): string
  {
    return 'Ambil daftar karyawan — bisa difilter nama, role, cabang, diurutkan, dan dibatasi jumlahnya. '
      . 'Gunakan untuk pertanyaan seperti "siapa aja karyawan cabang X", "berapa karyawan yang aktif", '
      . '"cari karyawan bernama Y", "karyawan dengan role branch manager", dll.';
  }

  public function parameters(): array
  {
    return [
      'type' => 'object',
      'properties' => [
        'name' => ['type' => 'string', 'description' => 'Filter nama karyawan (pencarian sebagian, opsional).'],
        'role' => ['type' => 'string', 'description' => 'Filter berdasarkan role tertentu (opsional).'],
        'branch_name' => ['type' => 'string', 'description' => 'Filter cabang tertentu. Diabaikan untuk Branch Manager karena otomatis terkunci ke cabangnya sendiri.'],
        'sort_by' => ['type' => 'string', 'enum' => ['name', 'active_date'], 'description' => 'Urutkan berdasarkan apa. Default "name".'],
        'order' => ['type' => 'string', 'enum' => ['asc', 'desc'], 'description' => 'Urutan naik atau turun. Default "asc".'],
        'limit' => ['type' => 'integer', 'description' => 'Jumlah hasil maksimal. Default 20, maksimal 100.'],
      ],
      'required' => [],
    ];
  }

  public function isReadOnly(): bool
  {
    return true;
  }

  public function isAvailableFor(User $user): bool
  {
    // Lite tidak punya konsep karyawan (1 owner, 1 cabang). Cashier tidak berwenang sama sekali.
    if ($user->company?->isLite()) {
      return false;
    }
    return $user->isOwner() || $user->isBranchManager();
  }

  public function execute(User $user, array $args): array
  {
    $query = Employee::where('company_id', $user->company_id)->with('branch:id,name');

    if ($user->isBranchManager()) {
      $query->where('branch_id', $user->branch_id);
    } elseif (!empty($args['branch_name'])) {
      $branch = Branch::where('company_id', $user->company_id)
        ->where('name', 'like', '%' . $args['branch_name'] . '%')
        ->first();

      if (!$branch) {
        return ['note' => 'Cabang "' . $args['branch_name'] . '" tidak ditemukan.', 'results' => []];
      }
      $query->where('branch_id', $branch->id);
    }

    if (!empty($args['name'])) {
      $query->where('name', 'like', '%' . $args['name'] . '%');
    }

    if (!empty($args['role'])) {
      $query->where('role', 'like', '%' . $args['role'] . '%');
    }

    $sortBy = $args['sort_by'] ?? 'name';
    $order = $args['order'] ?? 'asc';
    $limit = min((int) ($args['limit'] ?? 20), 100);

    $employees = $query->orderBy($sortBy, $order)->limit($limit)->get();

    return [
      'count' => $employees->count(),
      'results' => $employees->map(fn(Employee $e) => [
        'name' => $e->name,
        'role' => $e->role,
        'branch_name' => $e->branch?->name,
        'slot_status' => $e->slot_status,
        'active_date' => $e->active_date?->toDateString(),
        'has_login_account' => (bool) $e->user_id,
      ])->values(),
    ];
  }

  public function summarize(User $user, array $args): array
  {
    return [];
  }

  public function formFields(User $user, array $currentArgs): array
  {
    return [];
  }
}
