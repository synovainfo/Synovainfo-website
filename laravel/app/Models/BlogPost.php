<?php

namespace App\Models;

use App\Enums\BlogPostStatus;
use App\Models\Concerns\HasCamelCaseColumns;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BlogPost extends Model
{
    use HasUlids, HasCamelCaseColumns, SoftDeletes;

    protected const DELETED_AT = 'deleted_at';


    public $incrementing = false;
    protected $keyType = 'string';
    protected $table = 'blog_posts';
    
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
        'view_count'
    ];
    
    protected function casts(): array
    {
        return [
            'status' => BlogPostStatus::class,
            'published_at' => 'datetime',
            'scheduled_at' => 'datetime',
        ];
    }
    
    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'authorId');
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(BlogCategory::class, 'categoryId');
    }
    
    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class, 'tags_on_posts', 'postId', 'tagId')
                    ->using(TagOnPost::class);
    }

    /**
     * Raw pivot rows for tags_on_posts (carries its own ULID primary key, so
     * attach() cannot be used — sync through tagLinks() instead).
     */
    public function tagLinks(): HasMany
    {
        return $this->hasMany(TagOnPost::class, 'postId');
    }
}
