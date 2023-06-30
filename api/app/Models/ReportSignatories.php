<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReportSignatories extends Model
{
    use HasFactory;
    protected $table='report_signatories';
    protected $fillable=[
        'OTP_code',
        'signature_status',
        'user_id',
        'report_id'
    ];
}
