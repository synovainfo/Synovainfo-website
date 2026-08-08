<?php

namespace App\Models;

use App\Models\Concerns\HasCamelCaseColumns;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Form extends Model
{
    use HasUlids, HasCamelCaseColumns;

    public $incrementing = false;
    protected $keyType = 'string';
    
    protected $fillable = [
        'name',
        'slug',
        'description',
        'submit_button_text',
        'success_message',
        'email_notification',
        'status'
    ];
    
    protected function casts(): array
    {
        return [
            'status' => 'boolean',
        ];
    }
    
    public function fields(): HasMany
    {
        return $this->hasMany(FormField::class, 'formId');
    }
    
    public function submissions(): HasMany
    {
        return $this->hasMany(FormSubmission::class, 'formId');
    }
}
