<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@gmail.com'], // condition
            [
                'username' => 'admin',
                'password' => Hash::make('Password@123'),
                'role' => 'admin',
                'email_verified_at' => now(),
            ]
        );
    }
} 