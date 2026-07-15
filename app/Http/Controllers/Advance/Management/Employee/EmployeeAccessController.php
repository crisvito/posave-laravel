<?php

namespace App\Http\Controllers\Advance\Management\Employee;

use App\Http\Controllers\Controller;
use App\Models\Advance\Management\Employee\Employee;
use App\Models\Advance\Management\Employee\EmployeeAccess;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class EmployeeAccessController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {

        /** @var User $user */
        $user = Auth::user();

        $accesses = EmployeeAccess::where('company_id', $user->company_id)
            ->withCount('employees')
            ->when($request->search, function ($query) use ($request) {
                $query->where('name', 'like', '%' . $request->search . '%');
            })
            ->paginate($request->integer('per_page') ?: 5)
            ->withQueryString();

        return Inertia::render('advance/management/employee/employee-access-list', [
            'accesses' => $accesses,
            'filters' => $request->only('search', 'per_page'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:employee_accesses,name',
        ]);

        EmployeeAccess::create($validated);

        return redirect()->route('dashboard.employees-access.index')->with('success', 'Kategori berhasil ditambahkan!');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:employee_accesses,name,' . $id,
        ]);

        $access = EmployeeAccess::findOrFail($id);
        $oldName = $access->name;
        $access->update($validated);

        // sync nama role di tabel employees biar konsisten
        Employee::where('role', $oldName)->update(['role' => $validated['name']]);

        return redirect()->route('dashboard.employees-access.index')->with('success', 'Kategori berhasil diperbarui!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
        $access = EmployeeAccess::findOrFail($id);
        $access->delete();

        return redirect()->route('dashboard.employees-access.index')->with('success', 'Kategori berhasil dihapus!');
    }
}
