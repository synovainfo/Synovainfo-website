<?php

namespace App\Models;

use App\Models\Concerns\HasCamelCaseColumns;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class FAQCategory extends Model
{
    use HasUlids, HasCamelCaseColumns;

    public $incrementing = false;
    protected $keyType = 'string';
    protected $table = 'faq_categories';
    
    protected $fillable = [
        'name',
        'slug',
        'description',
        'order'
    ];
    
    public function faqs(): HasMany
    {
        return $this->hasMany(FAQ::class, 'categoryId');
    }
}
