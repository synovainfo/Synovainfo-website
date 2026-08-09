<?php

namespace App\Models;

use App\Models\Concerns\HasCamelCaseColumns;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Service extends Model
{
    use HasUlids, HasCamelCaseColumns, SoftDeletes;

    protected const DELETED_AT = 'deleted_at';


    public $incrementing = false;
    protected $keyType = 'string';
    protected $table = 'services';
    
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
        'updated_by_id'
    ];
    
    protected function casts(): array
    {
        return [
            'benefits' => 'array',
            'business_outcomes' => 'array',
            'status' => 'boolean',
        ];
    }
    
    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'createdById');
    }

    public function updatedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updatedById');
    }
    
    public function technologies(): BelongsToMany
    {
        return $this->belongsToMany(Technology::class, 'service_technologies', 'serviceId', 'technologyId')
                    ->using(ServiceTechnology::class);
    }
    
    public function industries(): BelongsToMany
    {
        return $this->belongsToMany(Industry::class, 'service_industries', 'serviceId', 'industryId')
                    ->using(ServiceIndustry::class);
    }
}
