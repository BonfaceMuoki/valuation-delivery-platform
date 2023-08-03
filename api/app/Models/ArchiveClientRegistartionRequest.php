<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ArchiveClientRegistartionRequest extends Model
{
    use HasFactory;
    protected $fillable=[
        'invite_email',
        'contact_person_name',
        'contact_person_phone',
        'institution_name'
    ];
}
