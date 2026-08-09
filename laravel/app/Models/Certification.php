<?php

namespace App\Models;

use App\Models\Concerns\HasCamelCaseColumns;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Certification extends Model
{
    use HasUlids, HasCamelCaseColumns, SoftDeletes;

    protected const DELETED_AT = 'deleted_at';

    public $incrementing = false;
    protected $keyType = 'string';
    
    protected $fillable = [
        'name',
        'issuer',
        'description',
        'icon',
        'order',
        'status',
        'is_verified'
    ];
    
    protected function casts(): array
    {
        return [
            'status' => 'boolean',
            'is_verified' => 'boolean',
        ];
    }
}
