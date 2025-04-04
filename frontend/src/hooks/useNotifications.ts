import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api/config';
import { useNotificationStore } from '../stores/notificationStore';
import { Notification as NotificationType, NotificationType as NotificationTypeEnum } from '../types';
import { useEffect } from 'react';

export interface Notification {
  id: string;
  type: string;
  message: string;
  read: boolean;
  created_at: string;
  data: Record<string, any>;
}

// This hook fetches notifications from the API and updates the store
export function useNotifications() {
  const { notifications, unreadCount, addNotification, markAsRead, markAllAsRead } = useNotificationStore();
  
  // Use React Query to fetch notifications from the API
  const { data, isLoading, error } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      try {
        const { data } = await api.get<NotificationType[]>('/notifications');
        return data;
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
        return notifications; // Fallback to store data if API fails
      }
    },
    refetchInterval: 10000, // Refetch every 10 seconds
  });

  // Update the store when API data changes
  useEffect(() => {
    if (data && data.length > 0) {
      // This is a simplified approach - in a real app, you'd need to merge the data
      // and handle conflicts between local and server data
      data.forEach(notification => {
        // Only add if it doesn't exist in the store
        if (!notifications.some(n => n.id === notification.id)) {
          addNotification({
            userId: notification.userId,
            type: notification.type,
            title: notification.title || '',
            message: notification.message,
            itemId: notification.itemId,
            read: notification.read,
          });
        }
      });
    }
  }, [data, notifications, addNotification]);

  return {
    data: notifications,
    isLoading,
    error,
    unreadCount,
  };
}

// These hooks are kept for compatibility with the NotificationsPage
export function useMarkNotificationAsRead() {
  const { markAsRead } = useNotificationStore();
  const queryClient = useQueryClient();

  return {
    mutateAsync: async (id: string) => {
      try {
        // Call the API
        await api.put(`/notifications/${id}/read`);
        // Update the store
        markAsRead(id);
        return { success: true };
      } catch (error) {
        console.error('Failed to mark notification as read:', error);
        throw error;
      }
    },
    isPending: false,
  };
}

export function useMarkAllNotificationsAsRead() {
  const { markAllAsRead } = useNotificationStore();
  const queryClient = useQueryClient();

  return {
    mutateAsync: async () => {
      try {
        // Call the API
        await api.put('/notifications/read-all');
        // Update the store
        markAllAsRead();
        return { success: true };
      } catch (error) {
        console.error('Failed to mark all notifications as read:', error);
        throw error;
      }
    },
    isPending: false,
  };
}

export function useDeleteNotification() {
  const queryClient = useQueryClient();

  return {
    mutateAsync: async (id: string) => {
      try {
        // Call the API
        await api.delete(`/notifications/${id}`);
        // Note: The store doesn't have a delete method, so we can't update it
        return { success: true };
      } catch (error) {
        console.error('Failed to delete notification:', error);
        throw error;
      }
    },
    isPending: false,
  };
}