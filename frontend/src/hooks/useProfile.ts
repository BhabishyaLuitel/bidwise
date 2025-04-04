import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { User } from '../types';

// Query key for user profile
const USER_PROFILE_QUERY_KEY = 'userProfile';

// Fetch user profile
export const useUserProfile = (userId: string | undefined) => {
  return useQuery({
    queryKey: [USER_PROFILE_QUERY_KEY, userId],
    queryFn: async () => {
      if (!userId) return null;
      const response = await api.get(`/users/${userId}`);
      return response.data.data;
    },
    enabled: !!userId,
  });
};

// Update user profile
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: { username: string; phone?: string; location?: string; bio?: string }) => {
      const response = await api.put('/users/profile', data);
      return response.data.data;
    },
    onSuccess: (data) => {
      // Invalidate and refetch user profile
      queryClient.invalidateQueries({ queryKey: [USER_PROFILE_QUERY_KEY] });
    },
  });
}; 