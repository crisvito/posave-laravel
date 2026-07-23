<?php

namespace App\Http\Controllers\Advance\Management\Employee;

use App\Http\Controllers\Controller;
use App\Mail\EmployeeInvitation;
use App\Models\Advance\Management\Employee\Employee;
use App\Models\Advance\Messaging\Conversation;
use App\Models\Auth\Branch;
use App\Models\User;
use App\Models\Auth\UserProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class EmployeeController extends Controller
{
    public function index(Request $request)
    {
        /** @var User $user */
        $user = Auth::user();

        $employeesQuery = Employee::where('company_id', $user->company_id)
            ->with(['branch', 'user'])
            ->when($request->search, function ($query) use ($request) {
                $query->where(function ($q) use ($request) {
                    $q->where('name', 'like', '%' . $request->search . '%')
                        ->orWhereHas('user', fn($uq) => $uq->where('email', 'like', '%' . $request->search . '%'));
                });
            })
            ->when($request->status && $request->status !== 'all', function ($query) use ($request) {
                $query->where('is_active', $request->status === 'active');
            });

        if ($user->isBranchManager()) {
            $employeesQuery->where('branch_id', $user->branch_id);
        } else {
            $employeesQuery->when($request->branch && $request->branch !== 'all', function ($query) use ($request) {
                $query->where('branch_id', $request->branch);
            });
        }

        $employees = $employeesQuery->paginate($request->integer('per_page') ?: 5)->withQueryString();
        $employees->getCollection()->transform(function (Employee $employee) {
            return [
                'id' => $employee->id,
                'name' => $employee->name,
                'role' => $employee->role,
                'branch_id' => $employee->branch_id,
                'branch' => $employee->branch ? ['id' => $employee->branch->id, 'name' => $employee->branch->name] : null,
                'active_date' => $employee->active_date?->format('Y-m-d'),
                'slot_status' => $employee->slot_status,
                'is_active' => $employee->is_active,
                'user' => $employee->user ? ['id' => $employee->user->id, 'email' => $employee->user->email] : null,
            ];
        });

        $branches = $user->isBranchManager()
            ? Branch::where('id', $user->branch_id)->get(['id', 'name'])
            : Branch::where('company_id', $user->company_id)->get(['id', 'name']);

        return Inertia::render('advance/management/employee/employee-list', [
            'employees' => $employees,
            'branches' => $branches,
            'filters' => $request->only('branch', 'per_page', 'search', 'status'),
            'is_branch_manager' => $user->isBranchManager(),
        ]);
    }

    public function create()
    {
        /** @var User $user */
        $user = Auth::user();
        abort_if($user->isBranchManager(), 403);

        $branches = Branch::where('company_id', $user->company_id)->get(['id', 'name']);

        return Inertia::render('advance/management/employee/employee-create', [
            'roles' => Employee::ASSIGNABLE_ROLES,
            'branches' => $branches,
            'is_branch_manager' => $user->isBranchManager(),
        ]);
    }

    public function store(Request $request)
    {
        /** @var User $user */
        $user = Auth::user();
        abort_if($user->isBranchManager(), 403);

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'role' => ['required', 'string', Rule::in(Employee::ASSIGNABLE_ROLES)],
            'branch_id' => 'required|exists:branches,id',
            'active_date' => 'required|date',
            'slot_status' => 'required|string',
        ]);

        $branch = Branch::where('id', $request->branch_id)
            ->where('company_id', $user->company_id)
            ->firstOrFail();

        $temporaryPassword = Str::random(10);

        [$newUser, $employee] = DB::transaction(function () use ($request, $user, $branch, $temporaryPassword) {
            $newUser = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($temporaryPassword),
                'company_id' => $user->company_id,
                'branch_id' => $branch->id,
                'role' => $request->role,
            ]);

            UserProfile::create(['user_id' => $newUser->id]);

            $employee = Employee::create([
                'user_id' => $newUser->id,
                'company_id' => $user->company_id,
                'branch_id' => $branch->id,
                'name' => $request->name,
                'role' => $request->role,
                'active_date' => $request->active_date,
                'slot_status' => $request->slot_status,
            ]);

            $branchConversation = Conversation::where('branch_id', $branch->id)->where('type', 'group')->first();
            if ($branchConversation) {
                $branchConversation->members()->attach($newUser->id, ['last_read_at' => now()]);
            }

            return [$newUser, $employee];
        });

        Mail::to($newUser->email)->send(new EmployeeInvitation($newUser, $temporaryPassword, $user->company->profile));

        return redirect()->route('dashboard.employees.index')->with('success', 'Karyawan berhasil ditambahkan dan undangan telah dikirim.');
    }

    public function update(Request $request, string $id)
    {
        /** @var User $user */
        $user = Auth::user();

        $employeeQuery = Employee::where('id', $id)->where('company_id', $user->company_id);

        if ($user->isBranchManager()) {
            $employeeQuery->where('branch_id', $user->branch_id)->where('role', 'cashier');
        }

        $employee = $employeeQuery->firstOrFail();

        $request->validate([
            'name' => 'required|string|max:255',
            'role' => ['required', 'string', Rule::in(Employee::ASSIGNABLE_ROLES)],
            'branch_id' => 'required|exists:branches,id',
            'active_date' => 'required|date',
            'slot_status' => 'required|string',
        ]);

        if ($user->isBranchManager()) {
            abort_if((int) $request->branch_id !== $user->branch_id, 403);
            abort_if($request->role !== 'cashier', 403);
        }

        $branch = Branch::where('id', $request->branch_id)->where('company_id', $user->company_id)->firstOrFail();

        DB::transaction(function () use ($employee, $request, $branch) {
            $employee->update([
                'branch_id' => $branch->id,
                'name' => $request->name,
                'role' => $request->role,
                'active_date' => $request->active_date,
                'slot_status' => $request->slot_status,
            ]);

            if ($employee->user) {
                $employee->user->update(['name' => $request->name, 'branch_id' => $branch->id]);
            }
        });

        return redirect()->route('dashboard.employees.index')->with('success', 'Data karyawan berhasil diperbarui.');
    }

    /**
     * Nonaktifkan/aktifkan karyawan — TIDAK menghapus data, tetap tampil di list.
     * Nonaktif juga memblokir login (soft-delete User), dipulihkan lagi saat diaktifkan ulang.
     */
    public function toggleActive(string $id)
    {
        /** @var User $user */
        $user = Auth::user();

        $employeeQuery = Employee::where('id', $id)->where('company_id', $user->company_id);

        if ($user->isBranchManager()) {
            $employeeQuery->where('branch_id', $user->branch_id)->where('role', 'cashier');
        }

        $employee = $employeeQuery->firstOrFail();
        $newActive = !$employee->is_active;

        DB::transaction(function () use ($employee, $newActive) {
            $employee->update(['is_active' => $newActive]);

            if ($employee->user_id) {
                $linkedUser = User::withTrashed()->find($employee->user_id);

                if ($linkedUser) {
                    if ($newActive && $linkedUser->trashed()) {
                        $linkedUser->restore();
                    } elseif (!$newActive && !$linkedUser->trashed()) {
                        $linkedUser->delete();
                    }
                }
            }
        });

        return redirect()->route('dashboard.employees.index')->with(
            'success',
            $newActive
                ? 'Karyawan diaktifkan kembali, akun login juga dipulihkan.'
                : 'Karyawan dinonaktifkan, akun login diblokir.',
        );
    }

    public function destroy(string $id)
    {
        /** @var User $user */
        $user = Auth::user();

        $employeeQuery = Employee::where('id', $id)->where('company_id', $user->company_id);

        if ($user->isBranchManager()) {
            $employeeQuery->where('branch_id', $user->branch_id)->where('role', 'cashier');
        }

        $employee = $employeeQuery->firstOrFail();

        if ($employee->user) {
            $employee->user->update(['email' => 'deleted_' . $employee->user->id . '_' . $employee->user->email]);
            $employee->user->delete();
        }
        $employee->delete();

        return redirect()->route('dashboard.employees.index')->with('success', 'Karyawan berhasil dihapus.');
    }
}
