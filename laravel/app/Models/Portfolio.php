<?php

namespace App\Models;

use App\Models\Concerns\HasCamelCaseColumns;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Portfolio extends Model
{
    use HasUlids, HasCamelCaseColumns, SoftDeletes;

    protected const DELETED_AT = 'deleted_at';

    public $incrementing = false;
    protected $keyType = 'string';
    protected $table = 'portfolios';

    protected $fillable = [
        'title',
        'slug',
        'description',
        'client_name',
        'featured_image',
        'gallery',
        'project_url',
        'category',
        'tech_stack',
        'status',
        'published_at',
        'seo_title',
        'seo_description',
        'created_by_id',
        'updated_by_id',
    ];

    protected function casts(): array
    {
        return [
            'gallery'      => 'array',
            'tech_stack'   => 'array',
            'status'       => 'boolean',
            'published_at' => 'datetime',
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
}
