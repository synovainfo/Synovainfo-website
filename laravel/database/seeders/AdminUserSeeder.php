<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        User::firstOrCreate(
            ['email' => 'admin@synovainfo.com'],
            [
                'id' => Str::ulid()->toBase32(),
                'name' => 'Super Admin',
                'password' => Hash::make('password123'),
                'role' => 'SUPER_ADMIN',
                'is_active' => true,
                // NOTE: no email_verified_at — the Prisma `users` table has no
                // such column (only createdAt/updatedAt), and Eloquent maps it
                // through HasCamelCaseColumns to `emailVerifiedAt`.
            ]
        );
    }
}
