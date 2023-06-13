<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReportUser extends Model
{
    use HasFactory;
    protected $fillable=[
        'name',
        'phone',,
        'email',
        'access_code',
        'valuation_report_id',
        'no_accessed'
    ];
}
