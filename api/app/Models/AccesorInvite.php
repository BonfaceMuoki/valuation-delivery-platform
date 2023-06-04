<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AccesorInvite extends Model
{
    use HasFactory;
    protected $fillable=[
        'invite_token',
        'registration_url',
        'login_url',
        'completed',
        'accessor_name',
        'contact_person_name',
        'contact_person_phone',
        'type'
    ];
}
