<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;

class Testimonial extends Model
{
    protected $fillable = [
        'name',
        'position',
        'company',
        'message_id',
        'message_en',
        'photo',
        'logo',
    ];

    protected $appends = [
        'message',
    ];

    protected function message(): Attribute
    {
        return Attribute::make(
            get: fn () => app()->getLocale() === 'en'
                ? $this->message_en
                : $this->message_id,
        );
    }
}
