<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ApartmentType extends Model
{
    use HasFactory;

    protected $fillable = [
        'building_id',
        'area',
        'base_price',
        'rooms',
    ];

    public function building()
    {
        return $this->belongsTo(NewBuilding::class);
    }

    public function apartments()
    {
        return $this->hasMany(Apartment::class);
    }
}
