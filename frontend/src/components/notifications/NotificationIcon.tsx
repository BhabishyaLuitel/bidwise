import { useState } from 'react';
import { Bell, Check, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useNotificationStore } from '../../stores/notificationStore';
import { Button } from '../ui/Button';
import { formatDistance } from 'date-fns';
import { NotificationType } from '../../types';

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case 'bid':
      return '🔨';
    case 'outbid':
      return '📈';
    case 'won':
      return '🏆';
    case 'ended':
      return '🔔';
    case 'payment':
      return '💳';
    default:
      return 'ℹ️';
  }
};

export function NotificationIcon() {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotificationStore();

  const handleMarkAsRead = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    markAsRead(id);
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
            {unreadCount}
          </span>
        )}
      </Button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-30"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 z-40 mt-2 w-80 rounded-lg bg-white shadow-lg">
            <div className="flex items-center justify-between border-b p-4">
              <h3 className="font-semibold text-gray-900">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={() => markAllAsRead()}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Mark all as read
                </button>
              )}
            </div>
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No notifications
                </div>
              ) : (
                <div className="divide-y">
                  {notifications.map((notification) => (
                    <Link
                      key={notification.id}
                      to={notification.itemId ? `/marketplace/${notification.itemId}` : '#'}
                      className={`block p-4 transition-colors hover:bg-gray-50 ${
                        !notification.read ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <span className="text-xl">{getNotificationIcon(notification.type)}</span>
                          <div>
                            <p className="font-medium text-gray-900">{notification.title}</p>
                            <p className="text-sm text-gray-600">{notification.message}</p>
                            <p className="mt-1 text-xs text-gray-500">
                              {formatDistance(notification.timestamp, new Date(), { addSuffix: true })}
                            </p>
                          </div>
                        </div>
                        {!notification.read && (
                          <button
                            onClick={(e) => handleMarkAsRead(notification.id, e)}
                            className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}