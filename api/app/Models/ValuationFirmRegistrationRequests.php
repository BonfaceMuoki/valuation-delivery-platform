<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ValuationFirmRegistrationRequests extends Model
{
    use HasFactory;
    protected $fillable=[
      'invite_email',
      'invite_phone',
      'isk_number',
      'vrb_number',
      'valauaion_firm_name',
      'director_name',
    ];
}
