<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ValuationFirmInvite extends Model
{
    use HasFactory;
    protected $fillable=[
     'invite_token',
     'registration_url',
     'login_url',
     'invite_email',
     'valauaion_firm_name',
     'vrb_number',
     'isk_number',
     'director_name'
    ];
}
