<?php

namespace App\Http\Controllers\Advance\Management\Employee;

use App\Http\Controllers\Controller;
use App\Mail\EmployeeInvitation;
use App\Models\Advance\Management\Employee\Employee;
use App\Models\Advance\Management\Employee\EmployeeAccess;
use App\Models\Advance\Messaging\Conversation;
use App\Models\Auth\Branch;
use App\Models\User;
use App\Models\Auth\UserProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Inertia\Inertia;

class EmployeeController extends Controller
{
    public function index(Request $request)
    {
        /** @var User $user */
        $user = Auth::user();

        $employeesQuery = Employee::where('company_id', $user->company_id)->with(['branch', 'user']);

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
                'user' => $employee->user ? ['id' => $employee->user->id, 'email' => $employee->user->email] : null,
            ];
        });

        $branches = $user->isBranchManager()
            ? Branch::where('id', $user->branch_id)->get(['id', 'name'])
            : Branch::where('company_id', $user->company_id)->get(['id', 'name']);

        return Inertia::render('advance/management/employee/employee-list', [
            'employees' => $employees,
            'branches' => $branches,
            'filters' => $request->only('branch', 'per_page'),
            'is_branch_manager' => $user->isBranchManager(),
        ]);
    }

    public function create()
    {
        /** @var User $user */
        $user = Auth::user();
        abort_if($user->isBranchManager(), 403);
        $roles = $user->isBranchManager() ? collect(['cashier']) : EmployeeAccess::pluck('name');

        $branches = $user->isBranchManager()
            ? Branch::where('id', $user->branch_id)->get(['id', 'name'])
            : Branch::where('company_id', $user->company_id)->get(['id', 'name']);

        return Inertia::render('advance/management/employee/employee-create', [
            'roles' => $roles,
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
            'role' => 'required|string|max:255',
            'branch_id' => 'required|exists:branches,id',
            'active_date' => 'required|date',
            'slot_status' => 'required|string',
        ]);

        if ($user->isBranchManager()) {
            abort_if((int) $request->branch_id !== $user->branch_id, 403);
            abort_if($request->role !== 'cashier', 403);
        }

        $branch = Branch::where('id', $request->branch_id)
            ->where('company_id', $user->company_id)
            ->firstOrFail();

        $temporaryPassword = Str::random(10);

        $newUser = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($temporaryPassword),
            'company_id' => $user->company_id,
            'branch_id' => $branch->id,
            'role' => $request->role,
        ]);

        UserProfile::create(['user_id' => $newUser->id]);

        Employee::create([
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
            'role' => 'required|string|max:255',
            'branch_id' => 'required|exists:branches,id',
            'active_date' => 'required|date',
            'slot_status' => 'required|string',
        ]);

        if ($user->isBranchManager()) {
            abort_if((int) $request->branch_id !== $user->branch_id, 403);
            abort_if($request->role !== 'cashier', 403);
        }

        $branch = Branch::where('id', $request->branch_id)->where('company_id', $user->company_id)->firstOrFail();

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

        return redirect()->route('dashboard.employees.index')->with('success', 'Data karyawan berhasil diperbarui.');
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
