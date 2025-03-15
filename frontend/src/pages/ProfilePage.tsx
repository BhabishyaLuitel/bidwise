import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  User as UserIcon,
  Mail,
  Phone,
  MapPin,
  Edit2,
  Award,
  Package,
  ShoppingCart,
  Star,
  MessageSquare,
  Gavel,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { User } from '../types';

const profileSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  location: z.string().optional(),
  bio: z.string().max(200, 'Bio must be less than 200 characters').optional(),
});

type ProfileInputs = z.infer<typeof profileSchema>;

const StatCard = ({ icon: Icon, label, value }: { icon: any; label: string; value: string | number }) => (
  <div className="rounded-lg bg-white p-4 shadow-sm">
    <div className="flex items-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
        <Icon className="h-5 w-5 text-blue-600" />
      </div>
      <div className="ml-4">
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-lg font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  </div>
);

export function ProfilePage() {
  const { user, updateProfile, loading } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileInputs>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: user?.username,
      email: user?.email,
      phone: user?.phone,
      location: user?.location,
      bio: user?.bio,
    },
  });

  if (!user) {
    navigate('/auth');
    return null;
  }

  const onSubmit = async (data: ProfileInputs) => {
    try {
      await updateProfile(data as Partial<User>);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          {!isEditing && (
            <Button onClick={() => setIsEditing(true)}>
              <Edit2 className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          )}
        </div>

        <div className="grid gap-8 lg:grid-cols-[300px,1fr]">
          {/* Profile Card */}
          <div className="space-y-6">
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <div className="mb-6 text-center">
                <div className="mx-auto mb-4 h-24 w-24 overflow-hidden rounded-full">
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80'}
                    alt={user.username}
                    className="h-full w-full object-cover"
                  />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">{user.username}</h2>
                <p className="text-sm text-gray-500">Member since {user.createdAt.toLocaleDateString()}</p>
              </div>

              {!isEditing ? (
                <div className="space-y-4">
                  <div className="flex items-center text-gray-600">
                    <Mail className="mr-2 h-4 w-4" />
                    <span>{user.email}</span>
                  </div>
                  {user.phone && (
                    <div className="flex items-center text-gray-600">
                      <Phone className="mr-2 h-4 w-4" />
                      <span>{user.phone}</span>
                    </div>
                  )}
                  {user.location && (
                    <div className="flex items-center text-gray-600">
                      <MapPin className="mr-2 h-4 w-4" />
                      <span>{user.location}</span>
                    </div>
                  )}
                  {user.bio && (
                    <div className="mt-4 border-t pt-4">
                      <p className="text-gray-600">{user.bio}</p>
                    </div>
                  )}
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Username
                    </label>
                    <div className="relative mt-1">
                      <UserIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <input
                        {...register('username')}
                        type="text"
                        className="block w-full rounded-md border border-gray-300 pl-10 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    {errors.username && (
                      <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <div className="relative mt-1">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <input
                        {...register('email')}
                        type="email"
                        className="block w-full rounded-md border border-gray-300 pl-10 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Phone
                    </label>
                    <div className="relative mt-1">
                      <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <input
                        {...register('phone')}
                        type="tel"
                        className="block w-full rounded-md border border-gray-300 pl-10 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Location
                    </label>
                    <div className="relative mt-1">
                      <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <input
                        {...register('location')}
                        type="text"
                        className="block w-full rounded-md border border-gray-300 pl-10 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Bio
                    </label>
                    <textarea
                      {...register('bio')}
                      rows={4}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    {errors.bio && (
                      <p className="mt-1 text-sm text-red-600">{errors.bio.message}</p>
                    )}
                  </div>

                  <div className="flex justify-end space-x-4 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={loading}>
                      {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </form>
              )}
            </div>

            {/* Rating Section */}
            {user.rating && (
              <div className="rounded-lg bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">Rating</h3>
                    <div className="mt-1 flex items-center">
                      <Star className="h-5 w-5 text-yellow-400" />
                      <span className="ml-1 font-semibold">{user.rating}</span>
                      <span className="ml-1 text-sm text-gray-500">
                        ({user.reviewCount} reviews)
                      </span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    View Reviews
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Stats and Activity */}
          <div className="space-y-8">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <StatCard
                icon={Gavel}
                label="Total Bids"
                value={user.totalBids || 0}
              />
              <StatCard
                icon={Award}
                label="Won Auctions"
                value={user.wonAuctions || 0}
              />
              <StatCard
                icon={Package}
                label="Active Listings"
                value={user.activeListings || 0}
              />
              <StatCard
                icon={ShoppingCart}
                label="Completed Sales"
                value={user.completedSales || 0}
              />
            </div>

            {/* Recent Activity */}
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Recent Activity</h3>
              <div className="space-y-4">
                {/* TODO: Implement recent activity list */}
                <p className="text-gray-500">No recent activity to display.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}