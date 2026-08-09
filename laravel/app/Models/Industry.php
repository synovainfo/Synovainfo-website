<?php

namespace App\Models;

use App\Models\Concerns\HasCamelCaseColumns;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Industry extends Model
{
    use HasUlids, HasCamelCaseColumns, SoftDeletes;

    protected const DELETED_AT = 'deleted_at';


    public $incrementing = false;
    protected $keyType = 'string';
    protected $table = 'industries';
    
    protected $fillable = [
        'name',
        'slug',
        'description',
        'icon',
        'capabilities',
        'status',
        'created_by_id',
        'updated_by_id'
    ];
    
    protected function casts(): array
    {
        return [
            'capabilities' => 'array',
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
        return $this->belongsToMany(Service::class, 'service_industries', 'industryId', 'serviceId')
                    ->using(ServiceIndustry::class);
    }
}
