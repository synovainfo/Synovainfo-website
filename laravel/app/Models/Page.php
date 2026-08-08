<?php

namespace App\Models;

use App\Enums\PageStatus;
use App\Models\Concerns\HasCamelCaseColumns;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Page extends Model
{
    use HasUlids, HasCamelCaseColumns, SoftDeletes;

    protected const DELETED_AT = 'deletedAt';


    public $incrementing = false;
    protected $keyType = 'string';
    protected $table = 'pages';

    protected $fillable = [
        'title',
        'slug',
        'content',
        'excerpt',
        'status',
        'featured_image',
        'template',
        'published_at',
        'scheduled_at',
        'author_id',
        'parent_id',
        'custom_css',
    ];

    protected function casts(): array
    {
        return [
            'content' => 'array',
            'status' => PageStatus::class,
            'published_at' => 'datetime',
            'scheduled_at' => 'datetime',
        ];
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'authorId');
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(Page::class, 'parentId');
    }

    public function children(): HasMany
    {
        return $this->hasMany(Page::class, 'parentId');
    }

    public function sections(): HasMany
    {
        return $this->hasMany(PageSection::class, 'pageId');
    }

    public function versions(): HasMany
    {
        return $this->hasMany(PageVersion::class, 'pageId');
    }
}
