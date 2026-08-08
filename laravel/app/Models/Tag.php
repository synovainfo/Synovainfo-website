<?php

namespace App\Models;

use App\Models\Concerns\HasCamelCaseColumns;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Tag extends Model
{
    use HasUlids, HasCamelCaseColumns;

    public $incrementing = false;
    protected $keyType = 'string';
    
    protected $fillable = [
        'name',
        'slug'
    ];
    
    public function posts(): BelongsToMany
    {
        return $this->belongsToMany(BlogPost::class, 'tags_on_posts', 'tagId', 'postId')
                    ->using(TagOnPost::class)
                    ->withPivot(['id']);
    }
}
