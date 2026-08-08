<?php

namespace App\Models;

use App\Enums\RedirectType;
use App\Models\Concerns\HasCamelCaseColumns;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

class Redirect extends Model
{
    use HasUlids, HasCamelCaseColumns;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'source',
        'target',
        'type',
        'is_wildcard',
        'status',
        'hit_count',
        'last_hit_at',
    ];

    protected function casts(): array
    {
        return [
            'type' => RedirectType::class,
            'is_wildcard' => 'boolean',
            'status' => 'boolean',
            'last_hit_at' => 'datetime',
        ];
    }
}
