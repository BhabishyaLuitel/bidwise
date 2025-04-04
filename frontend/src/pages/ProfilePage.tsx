import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
  CreditCard,
  Settings,
  Bell,
  LogOut,
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { User } from "../types";
import { useUserStore } from "../stores/userStore";
import { useUserProfile, useUpdateProfile } from "../hooks/useProfile";
import { useUserPayments } from '../hooks/usePayments';

const profileSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  phone: z.string().optional(),
  location: z.string().optional(),
  bio: z.string().max(200, "Bio must be less than 200 characters").optional(),
});

type ProfileInputs = z.infer<typeof profileSchema>;

const StatCard = ({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string | number;
}) => (
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
  const { user: storeUser, setUser: setStoreUser } = useUserStore();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  
  // Use React Query hooks
  const { data: user, isLoading, error } = useUserProfile(storeUser?.id);
  const updateProfileMutation = useUpdateProfile();
  const { data: payments, isLoading: isLoadingPayments, error: paymentsError } = useUserPayments();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileInputs>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: storeUser?.username,
      phone: storeUser?.phone,
      location: storeUser?.location,
      bio: storeUser?.bio,
    },
  });

  // Update form with fetched data when user data changes
  useEffect(() => {
    if (user) {
      reset({
        username: user.username,
        phone: user.phone || "",
        location: user.location || "",
        bio: user.bio || "",
      });
    }
  }, [user, reset]);

  const handleSignOut = () => {
    setStoreUser(null);
    navigate('/');
  };

  const pendingPayments = payments?.filter(p => p.status === 'pending') ?? [];
  const overduePayments = payments?.filter(p => p.status === 'overdue') ?? [];

  if (!storeUser) {
    navigate("/auth");
    return null;
  }

  const onSubmit = async (data: ProfileInputs) => {
    try {
      // Use the mutation to update the profile
      const updatedUser = await updateProfileMutation.mutateAsync(data);
      
      // Update the store with the new user data
      setStoreUser(updatedUser);
      
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex h-64 items-center justify-center">
            <p className="text-lg text-gray-500">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex h-64 items-center justify-center">
            <p className="text-lg text-red-500">Failed to load profile data. Please try again later.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex h-64 items-center justify-center">
            <p className="text-lg text-gray-500">No profile data available.</p>
          </div>
        </div>
      </div>
    );
  }

  const createdAt = new Date(user.createdAt);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-600">
                    {user.username?.[0]?.toUpperCase()}
                  </span>
                </div>
                <div className="ml-4">
                  <h1 className="text-2xl font-bold text-gray-900">{user.username}</h1>
                  <p className="text-gray-600">{user.email}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/settings')}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>
          </div>

          {/* Pending Payments Section */}
          {(pendingPayments.length > 0 || overduePayments.length > 0) && (
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Pending Payments</h2>
              
              {isLoadingPayments ? (
                <div className="flex justify-center items-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                </div>
              ) : paymentsError ? (
                <div className="text-red-600 text-center py-4">
                  Failed to load payments. Please try again.
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingPayments.map(payment => (
                    <div
                      key={payment.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <h3 className="font-medium text-gray-900">{payment.itemName}</h3>
                        <p className="text-sm text-gray-600">
                          Due by {new Date(payment.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="font-medium">${payment.amount.toFixed(2)}</span>
                        <Button
                          size="sm"
                          onClick={() => navigate(`/payment/${payment.id}`)}
                        >
                          <CreditCard className="h-4 w-4 mr-2" />
                          Pay Now
                        </Button>
                      </div>
                    </div>
                  ))}

                  {overduePayments.map(payment => (
                    <div
                      key={payment.id}
                      className="flex items-center justify-between p-4 bg-red-50 rounded-lg"
                    >
                      <div>
                        <h3 className="font-medium text-red-900">{payment.itemName}</h3>
                        <p className="text-sm text-red-600">
                          Overdue since {new Date(payment.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="font-medium text-red-900">${payment.amount.toFixed(2)}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-red-100 text-red-900 hover:bg-red-200"
                          onClick={() => navigate(`/payment/${payment.id}`)}
                        >
                          <CreditCard className="h-4 w-4 mr-2" />
                          Pay Now
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="h-24 flex flex-col items-center justify-center"
              onClick={() => navigate('/marketplace')}
            >
              <Package className="h-6 w-6 mb-2" />
              <span>Browse Items</span>
            </Button>
            <Button
              variant="outline"
              className="h-24 flex flex-col items-center justify-center"
              onClick={() => navigate('/notifications')}
            >
              <Bell className="h-6 w-6 mb-2" />
              <span>Notifications</span>
            </Button>
            <Button
              variant="outline"
              className="h-24 flex flex-col items-center justify-center"
              onClick={() => navigate('/settings')}
            >
              <Settings className="h-6 w-6 mb-2" />
              <span>Settings</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}