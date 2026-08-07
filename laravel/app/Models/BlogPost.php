<?php

namespace App\Models;

use App\Enums\BlogPostStatus;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class BlogPost extends Model
{
    use HasUlids;
    use SoftDeletes;

    protected $fillable = [
        'title',
        'slug',
        'content',
        'excerpt',
        'featured_image',
        'author_id',
        'category_id',
        'status',
        'published_at',
        'scheduled_at',
        'seo_title',
        'seo_description',
        'seo_keywords',
        'canonical_url',
        'og_image',
    ];

    protected function casts(): array
    {
        return [
            'status' => BlogPostStatus::class,
            'published_at' => 'datetime',
            'scheduled_at' => 'datetime',
            'view_count' => 'integer',
        ];
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(BlogCategory::class, 'category_id');
    }

    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class, 'tags_on_posts', 'post_id', 'tag_id')
            ->using(TagOnPost::class)
            ->withPivot('id');
    }

    public function tagLinks(): HasMany
    {
        return $this->hasMany(TagOnPost::class, 'post_id');
    }

    /**
     * tags_on_posts carries its own ULID primary key, so attach() cannot be used.
     *
     * @param  array<int, string>  $tagIds
     */
    public function syncTags(array $tagIds): void
    {
        $this->tagLinks()->whereNotIn('tag_id', $tagIds)->delete();

        $existing = $this->tagLinks()->pluck('tag_id')->all();

        foreach (array_diff($tagIds, $existing) as $tagId) {
            $this->tagLinks()->create(['tag_id' => $tagId]);
        }
    }

    public function scopePublished($query)
    {
        return $query->where('status', BlogPostStatus::PUBLISHED)
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now());
    }

    public function incrementViewCount(): void
    {
        $this->newQuery()->whereKey($this->getKey())->increment('view_count');
    }
}
