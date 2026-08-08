<?php

namespace App\Models;

use App\Models\Concerns\HasCamelCaseColumns;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CoreValue extends Model
{
    use HasUlids, HasCamelCaseColumns, SoftDeletes;

    protected const DELETED_AT = 'deletedAt';

    public $incrementing = false;
    protected $keyType = 'string';
    
    protected $fillable = [
        'title',
        'description',
        'icon',
        'order',
        'status'
    ];
    
    protected function casts(): array
    {
        return [
            'status' => 'boolean',
        ];
    }
}
