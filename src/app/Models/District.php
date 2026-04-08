<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\NewBuilding;


class District extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'slug', 'description', 'advantages', 'image'];

    public function newBuildings()
    {
        return $this->hasMany(NewBuilding::class);
    }
}


