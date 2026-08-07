<?php

namespace App\Models;

use App\Models\Concerns\HasAuthorship;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    use HasAuthorship;
    use HasUlids;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'logo',
        'website_url',
        'industry',
        'order',
        'status',
        'created_by_id',
        'updated_by_id',
    ];

    protected function casts(): array
    {
        return [
            'status' => 'boolean',
            'order' => 'integer',
        ];
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function scopeActive($query)
    {
        return $query->where('status', true);
    }
}
