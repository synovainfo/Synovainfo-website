<?php

namespace App\Models;

use App\Enums\RedirectType;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

class Redirect extends Model
{
    use HasUlids;

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
            'hit_count' => 'integer',
            'last_hit_at' => 'datetime',
        ];
    }

    public function scopeActive($query)
    {
        return $query->where('status', true);
    }

    public function recordHit(): void
    {
        $this->forceFill([
            'hit_count' => $this->hit_count + 1,
            'last_hit_at' => now(),
        ])->saveQuietly();
    }
}
