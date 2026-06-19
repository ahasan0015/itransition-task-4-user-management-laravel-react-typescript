<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserFactory extends Factory
{
    protected static ?string $password;

    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'password' => Hash::make('123'),
            'status' => 'active', // সব ইউজার শুরুতে active
            'last_login_time' => now(),
            'verification_token' => null, // ভেরিফাইড ইউজারদের জন্য null
            'remember_token' => Str::random(10),
        ];
    }
}
