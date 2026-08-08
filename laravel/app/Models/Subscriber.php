<?php

namespace App\Models;

use App\Models\Concerns\HasCamelCaseColumns;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Subscriber extends Model
{
    use HasUlids, HasCamelCaseColumns;

    public $incrementing = false;
    protected $keyType = 'string';
    
    const UPDATED_AT = null;
    
    protected $fillable = [
        'email',
        'name',
        'status',
        'source',
        'subscribed_at',
        'unsubscribed_at'
    ];
    
    protected function casts(): array
    {
        return [
            'subscribed_at' => 'datetime',
            'unsubscribed_at' => 'datetime',
        ];
    }
    
    public function newsletterSends(): HasMany
    {
        return $this->hasMany(NewsletterSend::class, 'subscriberId');
    }
}
