<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

/**
 * Per-route SEO overrides. No Prisma counterpart — added to back the admin
 * "seo" module.
 */
class SeoMeta extends Model
{
    use HasUlids;

    protected $table = 'seo_meta';

    protected $fillable = [
        'path',
        'title',
        'description',
        'keywords',
        'canonical_url',
        'og_title',
        'og_description',
        'og_image',
        'robots',
        'structured_data',
    ];

    protected function casts(): array
    {
        return [
            'structured_data' => 'array',
        ];
    }

    public static function forPath(string $path): ?self
    {
        return static::where('path', '/'.ltrim($path, '/'))->first();
    }
}
