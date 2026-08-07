<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Partner extends Model
{
    use HasUlids;
    use SoftDeletes;

    protected $fillable = [
        'name',
        'website',
        'description',
        'logo',
        'order',
        'status',
        'is_verified',
    ];

    protected function casts(): array
    {
        return [
            'status' => 'boolean',
            'is_verified' => 'boolean',
            'order' => 'integer',
        ];
    }

    public function scopeActive($query)
    {
        return $query->where('status', true);
    }

    public function scopeVerified($query)
    {
        return $query->where('is_verified', true);
    }
}
