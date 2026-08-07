<?php

namespace App\Models;

use App\Models\Concerns\HasAuthorship;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Technology extends Model
{
    use HasAuthorship;
    use HasUlids;

    protected $fillable = [
        'name',
        'slug',
        'category',
        'description',
        'icon',
        'website_url',
        'proficiency_level',
        'status',
        'created_by_id',
        'updated_by_id',
    ];

    protected function casts(): array
    {
        return [
            'proficiency_level' => 'integer',
            'status' => 'boolean',
        ];
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function services(): BelongsToMany
    {
        return $this->belongsToMany(Service::class, 'service_technologies')
            ->using(ServiceTechnology::class)
            ->withPivot('id');
    }

    public function serviceTechnologies(): HasMany
    {
        return $this->hasMany(ServiceTechnology::class);
    }

    public function scopeActive($query)
    {
        return $query->where('status', true);
    }
}
