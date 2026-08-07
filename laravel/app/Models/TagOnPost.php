<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\Pivot;

/**
 * Explicit pivot for blog_posts <-> tags, mirroring Prisma's TagOnPost model.
 */
class TagOnPost extends Pivot
{
    use HasUlids;

    protected $table = 'tags_on_posts';

    public $incrementing = false;

    public $timestamps = false;

    protected $fillable = [
        'post_id',
        'tag_id',
    ];

    public function post(): BelongsTo
    {
        return $this->belongsTo(BlogPost::class, 'post_id');
    }

    public function tag(): BelongsTo
    {
        return $this->belongsTo(Tag::class);
    }
}
