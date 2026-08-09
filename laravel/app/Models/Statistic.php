<?php

namespace App\Models;

use App\Models\Concerns\HasCamelCaseColumns;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Statistic extends Model
{
    use HasUlids, HasCamelCaseColumns, SoftDeletes;

    protected const DELETED_AT = 'deleted_at';

    public $incrementing = false;
    protected $keyType = 'string';
    
    protected $fillable = [
        'label',
        'value',
        'prefix',
        'suffix',
        'order',
        'is_visible'
    ];
    
    protected function casts(): array
    {
        return [
            'is_visible' => 'boolean',
        ];
    }
}
