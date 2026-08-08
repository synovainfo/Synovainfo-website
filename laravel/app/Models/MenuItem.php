<?php

namespace App\Models;

use App\Models\Concerns\HasCamelCaseColumns;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MenuItem extends Model
{
    use HasUlids, HasCamelCaseColumns;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'menu_id',
        'parent_id',
        'label',
        'url',
        'target',
        'icon',
        'order',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'status' => 'boolean',
        ];
    }

    public function menu(): BelongsTo
    {
        return $this->belongsTo(Menu::class, 'menuId');
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(MenuItem::class, 'parentId');
    }

    public function children(): HasMany
    {
        return $this->hasMany(MenuItem::class, 'parentId');
    }
}
