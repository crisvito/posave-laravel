<?php

namespace App\Services\Chatbot\Tools;

use App\Mail\EmployeeInvitation;
use App\Models\Advance\Management\Employee\Employee;
use App\Models\Advance\Management\Employee\EmployeeAccess;
use App\Models\Advance\Messaging\Conversation;
use App\Models\Auth\Branch;
use App\Models\Auth\UserProfile;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class CreateEmployeeTool implements ToolInterface
{
  public function name(): string
  {
    return 'create_employee';
  }

  public function description(): string
  {
    return 'Tambah karyawan baru. PENTING: ini membuat akun LOGIN sungguhan untuk karyawan tersebut dan langsung mengirim '
      . 'email undangan berisi password sementara — bukan cuma catatan data biasa. WAJIB tanya user dulu kalau nama/email/role/'
      . 'cabang belum lengkap dan jelas. Tool ini cuma nyiapin draft, belum langsung membuat akun — user tetap harus konfirmasi '
      . 'lewat tombol yang muncul, dan pastikan user benar-benar yakin sebelum konfirmasi karena email undangan akan langsung terkirim.';
  }

  public function parameters(): array
  {
    return [
      'type' => 'object',
      'properties' => [
        'name' => ['type' => 'string', 'description' => 'Nama lengkap karyawan'],
        'email' => ['type' => 'string', 'description' => 'Email karyawan, dipakai untuk login dan menerima undangan'],
        'role' => ['type' => 'string', 'description' => 'Role/jabatan karyawan — harus salah satu role yang sudah terdaftar di company ini'],
        'branch_name' => ['type' => 'string', 'description' => 'Nama cabang tempat karyawan ini ditugaskan'],
        'active_date' => ['type' => 'string', 'description' => 'Tanggal mulai aktif format YYYY-MM-DD. Kalau tidak disebut, pakai hari ini.'],
        'slot_status' => ['type' => 'string', 'description' => 'Status slot karyawan. Kalau tidak disebut, pakai "active".'],
      ],
      'required' => ['name', 'email', 'role', 'branch_name'],
    ];
  }

  public function isReadOnly(): bool
  {
    return false;
  }

  public function isAvailableFor(User $user): bool
  {
    // Lite tidak punya konsep Employee terpisah. Hanya Owner yang boleh menambah karyawan —
    // Branch Manager di-block eksplisit di EmployeeController (create & store).
    if ($user->company?->isLite()) {
      return false;
    }
    return $user->isOwner();
  }

  private function validRoleNames(User $user)
  {
    return EmployeeAccess::where('company_id', $user->company_id)->pluck('name');
  }

  /** Dipanggil pas nyiapin draft — validasi di sini, TAPI belum bikin akun/kirim email. */
  public function summarize(User $user, array $args): array
  {
    $validRoles = $this->validRoleNames($user);
    $roleValid = $validRoles->contains(fn($r) => strcasecmp($r, $args['role'] ?? '') === 0);

    $branch = Branch::where('company_id', $user->company_id)
      ->where('name', 'like', $args['branch_name'] ?? '')
      ->first();

    $emailTaken = !empty($args['email']) && User::where('email', $args['email'])->exists();

    return [
      'name' => $args['name'] ?? null,
      'email' => $args['email'] ?? null,
      'email_available' => !$emailTaken,
      'role' => $args['role'] ?? null,
      'role_valid' => $roleValid,
      'available_roles' => $validRoles->values(),
      'branch_name' => $branch?->name ?? ($args['branch_name'] ?? 'Tidak ditemukan'),
      'branch_valid' => (bool) $branch,
      'active_date' => $args['active_date'] ?? now()->toDateString(),
      'slot_status' => $args['slot_status'] ?? 'active',
      'warning' => 'Email undangan berisi password sementara akan langsung terkirim ke karyawan ini setelah dikonfirmasi.',
    ];
  }

  /** Dipanggil CUMA setelah user (Owner) klik tombol Konfirmasi. */
  public function execute(User $user, array $args): array
  {
    $validated = Validator::make($args, [
      'name' => 'required|string|max:255',
      'email' => 'required|email|unique:users,email',
      'role' => 'required|string|max:255',
      'branch_name' => 'required|string',
      'active_date' => 'nullable|date',
      'slot_status' => 'nullable|string',
    ])->validate();

    $branch = Branch::where('company_id', $user->company_id)
      ->where('name', $validated['branch_name'])
      ->firstOrFail();

    $validRoles = $this->validRoleNames($user);
    $matchedRole = $validRoles->first(fn($r) => strcasecmp($r, $validated['role']) === 0);
    if (!$matchedRole) {
      throw new \RuntimeException("Role \"{$validated['role']}\" tidak terdaftar untuk company ini.");
    }

    $temporaryPassword = Str::random(10);

    [$newUser, $employee] = DB::transaction(function () use ($user, $validated, $branch, $matchedRole, $temporaryPassword) {
      $newUser = User::create([
        'name' => $validated['name'],
        'email' => $validated['email'],
        'password' => Hash::make($temporaryPassword),
        'company_id' => $user->company_id,
        'branch_id' => $branch->id,
        'role' => $matchedRole,
      ]);

      UserProfile::create(['user_id' => $newUser->id]);

      $employee = Employee::create([
        'user_id' => $newUser->id,
        'company_id' => $user->company_id,
        'branch_id' => $branch->id,
        'name' => $validated['name'],
        'role' => $matchedRole,
        'active_date' => $validated['active_date'] ?? now()->toDateString(),
        'slot_status' => $validated['slot_status'] ?? 'active',
      ]);

      $branchConversation = Conversation::where('branch_id', $branch->id)->where('type', 'group')->first();
      if ($branchConversation) {
        $branchConversation->members()->attach($newUser->id, ['last_read_at' => now()]);
      }

      return [$newUser, $employee];
    });

    Mail::to($newUser->email)->send(new EmployeeInvitation($newUser, $temporaryPassword, $user->company->profile));

    return ['employee_id' => $employee->id, 'user_id' => $newUser->id, 'name' => $employee->name, 'email' => $newUser->email];
  }

  public function formFields(User $user, array $currentArgs): array
  {
    $roles = $this->validRoleNames($user);
    $branches = Branch::where('company_id', $user->company_id)->orderBy('name')->pluck('name');

    return [
      ['name' => 'name', 'label' => 'Nama Karyawan', 'type' => 'text', 'required' => true, 'value' => $currentArgs['name'] ?? ''],
      ['name' => 'email', 'label' => 'Email', 'type' => 'text', 'required' => true, 'value' => $currentArgs['email'] ?? ''],
      ['name' => 'role', 'label' => 'Role', 'type' => 'select', 'required' => true, 'value' => $currentArgs['role'] ?? '', 'options' => $roles->values()->all()],
      ['name' => 'branch_name', 'label' => 'Cabang', 'type' => 'select', 'required' => true, 'value' => $currentArgs['branch_name'] ?? '', 'options' => $branches->values()->all()],
      ['name' => 'active_date', 'label' => 'Tanggal Aktif', 'type' => 'date', 'required' => false, 'value' => $currentArgs['active_date'] ?? now()->toDateString()],
      ['name' => 'slot_status', 'label' => 'Status Slot', 'type' => 'text', 'required' => false, 'value' => $currentArgs['slot_status'] ?? 'active'],
    ];
  }
}
