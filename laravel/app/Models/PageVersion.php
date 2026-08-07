<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PageVersion extends Model
{
    use HasUlids;

    /**
     * The Prisma model only records createdAt.
     */
    public const UPDATED_AT = null;

    protected $fillable = [
        'page_id',
        'version_number',
        'content',
        'title',
        'slug',
        'status',
        'published_at',
        'created_by_id',
    ];

    protected function casts(): array
    {
        return [
            'content' => 'array',
            'version_number' => 'integer',
            'published_at' => 'datetime',
        ];
    }

    public function page(): BelongsTo
    {
        return $this->belongsTo(Page::class);
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by_id');
    }
}
