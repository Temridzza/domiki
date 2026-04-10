<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\District;

class NewBuilding extends Model
{
    use HasFactory;

    public function district()
    {
        return $this->belongsTo(District::class);
    }

    protected $fillable = [
        'district_id',
        'name',
        'image',
        'address',
        'completion_date',
        'developer_pdf',
        'advantages',
    ];

    public function apartmentTypes()
    {
        return $this->hasMany(ApartmentType::class, 'building_id');
    }
}


