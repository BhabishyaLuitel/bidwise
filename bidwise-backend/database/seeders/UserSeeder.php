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
        // Seller
        User::updateOrCreate(
            ['email' => 'seller1@bidwise.com'], // Condition
            [
                'username' => 'seller1',
                'password' => Hash::make('password'),
                'role' => 'seller',
            ]
        );
    
        // Buyer
        User::updateOrCreate(
            ['email' => 'buyer1@bidwise.com'],
            [
                'username' => 'buyer1',
                'password' => Hash::make('password'),
                'role' => 'buyer',
            ]
        );
    }
}
