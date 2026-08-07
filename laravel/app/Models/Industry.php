<?php

namespace App\Models;

use App\Models\Concerns\HasAuthorship;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Industry extends Model
{
    use HasAuthorship;
    use HasUlids;
    use SoftDeletes;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'icon',
        'capabilities',
        'status',
        'created_by_id',
        'updated_by_id',
    ];

    protected function casts(): array
    {
        return [
            'capabilities' => 'array',
            'status' => 'boolean',
        ];
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function services(): BelongsToMany
    {
        return $this->belongsToMany(Service::class, 'service_industries')
            ->using(ServiceIndustry::class)
            ->withPivot('id');
    }

    public function serviceIndustries(): HasMany
    {
        return $this->hasMany(ServiceIndustry::class);
    }

    public function scopeActive($query)
    {
        return $query->where('status', true);
    }
}
