<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AccesorUserInvite extends Model
{
    use HasFactory;
    protected $fillable=[
        'invite_email',
        'full_name',
        'invite_token',
        'personal_phone',
        'personal_email',
        'invite_instruction',
        'status',
        'role_id'
    ];
}
