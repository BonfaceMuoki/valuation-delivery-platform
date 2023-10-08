<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CachedReport extends Model
{
    use HasFactory;
    protected $fillable = ['user_id', 'organization_id', 'file_name', 'recipient_id', 'propertyLR'];
}
