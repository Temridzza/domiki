<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Apartment extends Model
{
    use HasFactory;

    protected $fillable = [
        'apartment_type_id',
        'floor',
        'entrance',
        'number',
        'price',
        'status',
    ];

    public function type()
    {
        return $this->belongsTo(ApartmentType::class, 'apartment_type_id');
    }
}
