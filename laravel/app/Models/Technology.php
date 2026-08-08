<?php

namespace App\Models;

use App\Models\Concerns\HasCamelCaseColumns;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Technology extends Model
{
    use HasUlids, HasCamelCaseColumns;

    public $incrementing = false;
    protected $keyType = 'string';
    protected $table = 'technologies';
    
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
        'updated_by_id'
    ];
    
    protected function casts(): array
    {
        return [
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
    
    public function services(): BelongsToMany
    {
        return $this->belongsToMany(Service::class, 'service_technologies', 'technologyId', 'serviceId')
                    ->using(ServiceTechnology::class);
    }
}
