<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'username',
        'email',
        'password',
        'role',
        'phone',
        'location',
        'bio',
        'avatar',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    /**
     * Get the user's permissions based on their role.
     *
     * @return array<string, bool>
     */
    public function getPermissionsAttribute(): array
    {
        return match ($this->role) {
            'admin' => [
                'can_bid' => true,
                'can_list' => true,
                'can_manage_users' => true,
                'can_manage_items' => true,
                'can_manage_bids' => true,
                'can_view_analytics' => true,
                'can_manage_settings' => true,
            ],
            'seller' => [
                'can_bid' => true,
                'can_list' => true,
                'can_manage_users' => false,
                'can_manage_items' => false,
                'can_manage_bids' => false,
                'can_view_analytics' => false,
                'can_manage_settings' => false,
            ],
            'buyer' => [
                'can_bid' => true,
                'can_list' => false,
                'can_manage_users' => false,
                'can_manage_items' => false,
                'can_manage_bids' => false,
                'can_view_analytics' => false,
                'can_manage_settings' => false,
            ],
            default => [
                'can_bid' => false,
                'can_list' => false,
                'can_manage_users' => false,
                'can_manage_items' => false,
                'can_manage_bids' => false,
                'can_view_analytics' => false,
                'can_manage_settings' => false,
            ],
        };
    }

    /**
     * Get the bids for the user.
     */
    public function bids(): HasMany
    {
        return $this->hasMany(Bid::class);
    }

    /**
     * Get the items for the user.
     */
    public function items(): HasMany
    {
        return $this->hasMany(Item::class, 'user_id');
    }

    /**
     * Validation rules for user registration
     *
     * @return array<string, mixed>
     */
    public static function validationRules(): array
    {
        return [
            'username' => 'required|string|min:3',
            'email' => 'required|string|email|unique:users,email',
            'password' => 'required|string|min:8',
            'role' => 'required|string|in:buyer,seller',
        ];
    }

    public function hasRole($role)
    {
        return $this->role === $role;
    }

    public function hasPermission($permission)
    {
        return in_array($permission, $this->permissions ?? []);
    }
}
