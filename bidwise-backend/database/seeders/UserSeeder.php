<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create a seller user
        User::create([
            'username' => 'seller1',
            'email' => 'seller1@bidwise.com',
            'password' => Hash::make('password'),
            'role' => 'seller',
        ]);

        // Create another seller user
        User::create([
            'username' => 'seller2',
            'email' => 'seller2@bidwise.com',
            'password' => Hash::make('password'),
            'role' => 'seller',
        ]);

        // Create a third seller user
        User::create([
            'username' => 'seller3',
            'email' => 'seller3@bidwise.com',
            'password' => Hash::make('password'),
            'role' => 'seller',
        ]);

        // Create buyer users
        User::create([
            'username' => 'buyer1',
            'email' => 'buyer1@bidwise.com',
            'password' => Hash::make('password'),
            'role' => 'buyer',
        ]);

        User::create([
            'username' => 'buyer2',
            'email' => 'buyer2@bidwise.com',
            'password' => Hash::make('password'),
            'role' => 'buyer',
        ]);

        User::create([
            'username' => 'buyer3',
            'email' => 'buyer3@bidwise.com',
            'password' => Hash::make('password'),
            'role' => 'buyer',
        ]);
    }
}
