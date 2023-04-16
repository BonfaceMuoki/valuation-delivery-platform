<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReportConsumer extends Model
{
    use HasFactory;
    protected $fillable = [
        'organization_name',
        'organization_phone',
        'organization_email',
        'organization_logo',
        'organization_type',
        'created_by',
    ];
      public function users()
      {
        return $this->belongsToMany(User::class, 'report_consumer_users');
      }
}
