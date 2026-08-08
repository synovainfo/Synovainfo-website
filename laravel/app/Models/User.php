<?php

namespace App\Models;

use App\Models\Concerns\HasCamelCaseColumns;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasUlids, HasCamelCaseColumns;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'name',
        'email',
        'password',
        'image',
        'role',
        'is_active',
        'last_login_at',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
            'last_login_at' => 'datetime',
        ];
    }

    public function authoredPages(): HasMany
    {
        return $this->hasMany(Page::class, 'author_id');
    }

    public function pageVersions(): HasMany
    {
        return $this->hasMany(PageVersion::class, 'created_by_id');
    }

    public function uploadedMedia(): HasMany
    {
        return $this->hasMany(Media::class, 'uploaded_by_id');
    }

    public function assignedLeads(): HasMany
    {
        return $this->hasMany(Lead::class, 'assigned_to_id');
    }

    public function assignedContacts(): HasMany
    {
        return $this->hasMany(Contact::class, 'assigned_to_id');
    }

    public function leadActivities(): HasMany
    {
        return $this->hasMany(LeadActivity::class, 'created_by_id');
    }

    public function auditLogs(): HasMany
    {
        return $this->hasMany(AuditLog::class, 'user_id');
    }

    public function activities(): HasMany
    {
        return $this->hasMany(Activity::class, 'user_id');
    }

    public function blogPosts(): HasMany
    {
        return $this->hasMany(BlogPost::class, 'author_id');
    }

    public function createdServices(): HasMany
    {
        return $this->hasMany(Service::class, 'created_by_id');
    }

    public function updatedServices(): HasMany
    {
        return $this->hasMany(Service::class, 'updated_by_id');
    }

    public function createdIndustries(): HasMany
    {
        return $this->hasMany(Industry::class, 'created_by_id');
    }

    public function updatedIndustries(): HasMany
    {
        return $this->hasMany(Industry::class, 'updated_by_id');
    }

    public function createdTechnologies(): HasMany
    {
        return $this->hasMany(Technology::class, 'created_by_id');
    }

    public function updatedTechnologies(): HasMany
    {
        return $this->hasMany(Technology::class, 'updated_by_id');
    }

    public function createdClients(): HasMany
    {
        return $this->hasMany(Client::class, 'created_by_id');
    }

    public function updatedClients(): HasMany
    {
        return $this->hasMany(Client::class, 'updated_by_id');
    }

    public function createdCareers(): HasMany
    {
        return $this->hasMany(Career::class, 'created_by_id');
    }

    public function updatedCareers(): HasMany
    {
        return $this->hasMany(Career::class, 'updated_by_id');
    }

    public function createdResources(): HasMany
    {
        return $this->hasMany(Resource::class, 'created_by_id');
    }

    public function updatedResources(): HasMany
    {
        return $this->hasMany(Resource::class, 'updated_by_id');
    }

    public function createdTestimonials(): HasMany
    {
        return $this->hasMany(Testimonial::class, 'created_by_id');
    }

    public function updatedTestimonials(): HasMany
    {
        return $this->hasMany(Testimonial::class, 'updated_by_id');
    }

    public function createdFAQs(): HasMany
    {
        return $this->hasMany(FAQ::class, 'created_by_id');
    }

    public function updatedFAQs(): HasMany
    {
        return $this->hasMany(FAQ::class, 'updated_by_id');
    }
}
