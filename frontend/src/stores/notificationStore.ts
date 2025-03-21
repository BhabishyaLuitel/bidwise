import { create } from 'zustand';
import { Notification, NotificationType } from '../types';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  getUnreadCount: () => number;
}

// Dummy notifications for the signed-in user
const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    userId: '1',
    type: 'bid',
    title: 'New Bid Placed',
    message: 'Your bid of $1,500 on "Vintage Rolex Submariner" has been placed successfully.',
    itemId: '1',
    read: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
  },
  {
    id: '2',
    userId: '1',
    type: 'outbid',
    title: 'You\'ve Been Outbid',
    message: 'Someone has outbid you on "Limited Edition Art Print". Current bid is now $950.',
    itemId: '2',
    read: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
  },
  {
    id: '3',
    userId: '1',
    type: 'won',
    title: 'Auction Won',
    message: 'Congratulations! You\'ve won the auction for "Rare Vinyl Collection".',
    itemId: '3',
    read: true,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
  },
  {
    id: '4',
    userId: '1',
    type: 'system',
    title: 'Welcome to BidWise',
    message: 'Thank you for joining BidWise! Start exploring auctions and place your first bid.',
    read: true,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
  },
];

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: INITIAL_NOTIFICATIONS,
  unreadCount: INITIAL_NOTIFICATIONS.filter(n => !n.read).length,

  addNotification: (notification) => set((state) => {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
    };
    return {
      notifications: [newNotification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    };
  }),

  markAsRead: (id) => set((state) => ({
    notifications: state.notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    ),
    unreadCount: state.unreadCount - 1,
  })),

  markAllAsRead: () => set((state) => ({
    notifications: state.notifications.map((n) => ({ ...n, read: true })),
    unreadCount: 0,
  })),

  getUnreadCount: () => get().unreadCount,
}));