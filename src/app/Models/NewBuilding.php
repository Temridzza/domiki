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
}


