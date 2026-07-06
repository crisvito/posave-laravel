<?php

namespace App\Models\Settings;

use Illuminate\Database\Eloquent\Model;

class Company extends Model
{
    protected $fillable = [
        'user_id', 
        'name', 
        'description', 
        'phone', 
        'address', 
        'province', 
        'city', 
        'zip_code', 
        'email', 
        'instagram', 
        'youtube', 
        'linkedin', 
        'twitter', 
        'avatar'
    ];

    /**
     * Relasi balik ke model User
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function branches()
    {
        return $this->hasMany(Branch::class);
    }
}
