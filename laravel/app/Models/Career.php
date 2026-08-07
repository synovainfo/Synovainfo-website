<?php

namespace App\Models;

use App\Enums\CareerType;
use App\Models\Concerns\HasAuthorship;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Career extends Model
{
    use HasAuthorship;
    use HasUlids;
    use SoftDeletes;

    protected $fillable = [
        'title',
        'slug',
        'department',
        'location',
        'type',
        'description',
        'requirements',
        'benefits',
        'salary_min',
        'salary_max',
        'status',
        'created_by_id',
        'updated_by_id',
    ];

    protected function casts(): array
    {
        return [
            'type' => CareerType::class,
            'requirements' => 'array',
            'benefits' => 'array',
            'salary_min' => 'integer',
            'salary_max' => 'integer',
            'status' => 'boolean',
        ];
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function applications(): HasMany
    {
        return $this->hasMany(CareerApplication::class);
    }

    public function scopeOpen($query)
    {
        return $query->where('status', true);
    }
}
