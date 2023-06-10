<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ValuerfirmUserInvite extends Model
{
    use HasFactory;
    protected $fillable=[
        'invite_email',
        'full_name',
        'invite_token',
        'personal_phone',
        'invite_token',
        'isk_number',
        'vrb_number',
        'invite_instruction',
        'status',
        'role_id'
    ];
}
