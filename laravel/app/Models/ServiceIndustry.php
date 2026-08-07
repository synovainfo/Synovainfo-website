<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\Pivot;

/**
 * Explicit pivot: carries its own ULID primary key, mirroring Prisma's
 * ServiceIndustry model. No timestamps in the source schema.
 */
class ServiceIndustry extends Pivot
{
    use HasUlids;

    protected $table = 'service_industries';

    public $incrementing = false;

    public $timestamps = false;

    protected $fillable = [
        'service_id',
        'industry_id',
    ];

    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }

    public function industry(): BelongsTo
    {
        return $this->belongsTo(Industry::class);
    }
}
