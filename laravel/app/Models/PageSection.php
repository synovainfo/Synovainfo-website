<?php

namespace App\Models;

use App\Models\Concerns\HasCamelCaseColumns;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PageSection extends Model
{
    use HasUlids, HasCamelCaseColumns;

    public $incrementing = false;
    protected $keyType = 'string';
    protected $table = 'page_sections';

    protected $fillable = [
        'page_id',
        'section_type',
        'title',
        'content',
        'order',
        'is_visible',
        'settings',
    ];

    protected function casts(): array
    {
        return [
            'content' => 'array',
            'is_visible' => 'boolean',
            'settings' => 'array',
        ];
    }

    public function page(): BelongsTo
    {
        return $this->belongsTo(Page::class, 'pageId');
    }
}
