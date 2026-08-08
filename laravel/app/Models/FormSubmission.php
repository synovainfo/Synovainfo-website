<?php

namespace App\Models;

use App\Models\Concerns\HasCamelCaseColumns;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FormSubmission extends Model
{
    use HasUlids, HasCamelCaseColumns;

    public $incrementing = false;
    protected $keyType = 'string';
    
    const UPDATED_AT = null;
    
    protected $fillable = [
        'form_id',
        'data',
        'ip_address',
        'user_agent'
    ];
    
    protected function casts(): array
    {
        return [
            'data' => 'array',
        ];
    }
    
    public function form(): BelongsTo
    {
        return $this->belongsTo(Form::class, 'formId');
    }
}
