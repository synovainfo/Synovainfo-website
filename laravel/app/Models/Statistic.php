<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Statistic extends Model
{
    use HasUlids;
    use SoftDeletes;

    protected $fillable = [
        'label',
        'value',
        'prefix',
        'suffix',
        'order',
        'is_visible',
    ];

    protected function casts(): array
    {
        return [
            'is_visible' => 'boolean',
            'order' => 'integer',
        ];
    }

    public function scopeVisible($query)
    {
        return $query->where('is_visible', true);
    }

    public function getDisplayValueAttribute(): string
    {
        return $this->prefix.$this->value.$this->suffix;
    }
}
