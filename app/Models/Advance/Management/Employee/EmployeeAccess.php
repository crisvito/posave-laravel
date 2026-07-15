<?php

namespace App\Models\Advance\Management\Employee;

use Illuminate\Database\Eloquent\Model;

class EmployeeAccess extends Model
{
    //
    protected $fillable = ['name', 'company_id'];

    public function employees()
    {
        return $this->hasMany(Employee::class, 'role', 'name');
    }
}
