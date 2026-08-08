<?php

namespace App\Models;

use App\Models\Concerns\HasCamelCaseColumns;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Newsletter extends Model
{
    use HasUlids, HasCamelCaseColumns;

    public $incrementing = false;
    protected $keyType = 'string';
    
    protected $fillable = [
        'subject',
        'body',
        'sent_at',
        'status',
        'recipient_count'
    ];
    
    protected function casts(): array
    {
        return [
            'sent_at' => 'datetime',
        ];
    }
    
    public function sends(): HasMany
    {
        return $this->hasMany(NewsletterSend::class, 'newsletterId');
    }
}
