<?php

namespace App\Models;

use App\Models\Concerns\HasAuthorship;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Service extends Model
{
    use HasAuthorship;
    use HasUlids;
    use SoftDeletes;

    protected $fillable = [
        'title',
        'slug',
        'short_description',
        'full_description',
        'icon',
        'category',
        'benefits',
        'business_outcomes',
        'status',
        'seo_title',
        'seo_description',
        'seo_keywords',
        'created_by_id',
        'updated_by_id',
    ];

    protected function casts(): array
    {
        return [
            'benefits' => 'array',
            'business_outcomes' => 'array',
            'status' => 'boolean',
        ];
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function technologies(): BelongsToMany
    {
        return $this->belongsToMany(Technology::class, 'service_technologies')
            ->using(ServiceTechnology::class)
            ->withPivot('id');
    }

    public function industries(): BelongsToMany
    {
        return $this->belongsToMany(Industry::class, 'service_industries')
            ->using(ServiceIndustry::class)
            ->withPivot('id');
    }

    public function serviceTechnologies(): HasMany
    {
        return $this->hasMany(ServiceTechnology::class);
    }

    public function serviceIndustries(): HasMany
    {
        return $this->hasMany(ServiceIndustry::class);
    }

    /**
     * The pivot tables carry their own ULID primary key, which attach() cannot
     * populate because it bypasses model events. Use these helpers instead of
     * technologies()->attach() / industries()->attach().
     *
     * @param  array<int, string>  $technologyIds
     */
    public function syncTechnologies(array $technologyIds): void
    {
        $this->serviceTechnologies()
            ->whereNotIn('technology_id', $technologyIds)
            ->delete();

        $existing = $this->serviceTechnologies()->pluck('technology_id')->all();

        foreach (array_diff($technologyIds, $existing) as $technologyId) {
            $this->serviceTechnologies()->create(['technology_id' => $technologyId]);
        }
    }

    /**
     * @param  array<int, string>  $industryIds
     */
    public function syncIndustries(array $industryIds): void
    {
        $this->serviceIndustries()
            ->whereNotIn('industry_id', $industryIds)
            ->delete();

        $existing = $this->serviceIndustries()->pluck('industry_id')->all();

        foreach (array_diff($industryIds, $existing) as $industryId) {
            $this->serviceIndustries()->create(['industry_id' => $industryId]);
        }
    }

    public function scopeActive($query)
    {
        return $query->where('status', true);
    }
}
