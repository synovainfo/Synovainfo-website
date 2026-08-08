<?php

namespace App\Models;

use App\Models\Concerns\HasCamelCaseColumns;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NewsletterSend extends Model
{
    use HasUlids, HasCamelCaseColumns;

    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;
    
    protected $fillable = [
        'newsletter_id',
        'subscriber_id',
        'sent_at',
        'opened_at',
        'clicked_at'
    ];
    
    protected function casts(): array
    {
        return [
            'sent_at' => 'datetime',
            'opened_at' => 'datetime',
            'clicked_at' => 'datetime',
        ];
    }
    
    public function newsletter(): BelongsTo
    {
        return $this->belongsTo(Newsletter::class, 'newsletterId');
    }
    
    public function subscriber(): BelongsTo
    {
        return $this->belongsTo(Subscriber::class, 'subscriberId');
    }
}
