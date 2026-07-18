<?php

namespace App\Models\CompanyPage;

use Illuminate\Database\Eloquent\Model;

class Testimonial extends Model
{
    protected $fillable = [
        'name',
        'position',
        'company',
        'message',
        'photo',
        'logo',
        'message_en'
    ];
}
