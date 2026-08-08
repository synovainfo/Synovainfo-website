<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Relations\Pivot;

class TagOnPost extends Pivot
{
    use HasUlids;

    public $incrementing = false;
    protected $keyType = 'string';
    
    protected $table = 'tags_on_posts';

    // The pivot table has no timestamp columns.
    public $timestamps = false;

    protected $fillable = ['postId', 'tagId'];
}
