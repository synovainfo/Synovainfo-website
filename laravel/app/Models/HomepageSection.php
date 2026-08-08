<?php

namespace App\Models;

use App\Models\Concerns\HasCamelCaseColumns;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

class HomepageSection extends Model
{
    use HasUlids, HasCamelCaseColumns;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'section_type',
        'title',
        'content',
        'order',
        'is_visible',
        'settings',
    ];

    protected function casts(): array
    {
        return [
            'content' => 'array',
            'is_visible' => 'boolean',
            'settings' => 'array',
        ];
    }
}
