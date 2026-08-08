<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

abstract class BasePolicy
{
    use HandlesAuthorization;

    protected string $entity;

    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo("view {$this->entity}");
    }

    public function view(User $user, $model): bool
    {
        return $user->hasPermissionTo("view {$this->entity}");
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo("create {$this->entity}");
    }

    public function update(User $user, $model): bool
    {
        return $user->hasPermissionTo("edit {$this->entity}");
    }

    public function delete(User $user, $model): bool
    {
        return $user->hasPermissionTo("delete {$this->entity}");
    }

    public function restore(User $user, $model): bool
    {
        return $user->hasPermissionTo("delete {$this->entity}"); // Using delete permission for restore
    }

    public function forceDelete(User $user, $model): bool
    {
        return $user->hasPermissionTo("delete {$this->entity}");
    }
}
