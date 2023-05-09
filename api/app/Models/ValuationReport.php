<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ValuationReport extends Model
{
    use HasFactory;
    
    protected $fillable=[
    'report_uploading_from',
    'report_description',
    'report_uploading_user',
    'report_uploading_from',
    'market_value',
    'forced_market_value',
    'property_lr',
    'valuation_date',
    'approving_director',
    'encumberrence_details',
    'qr_code',
    'receiving_company_id',
    'receiving_company_read_code',
    'unique_random_code',
    'upload_link',

    ];
}
