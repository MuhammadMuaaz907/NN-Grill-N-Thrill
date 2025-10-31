'use client';

import { useState, useEffect } from 'react';
import { Bell, Volume2, VolumeX, X, CheckCircle, AlertCircle, Clock } from 'lucide-react';

interface Notification {
  id: string;
  type: 'new_order' | 'status_update' | 'urgent' | 'info';
  title: string;
  message: string;
  orderId?: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  timestamp: Date;
  read: boolean;
}

interface ProfessionalNotificationSystemProps {
  notifications: Notification[];
  onMarkAsRead: (notificationId: string) => void;
  onMarkAllAsRead: () => void;
  soundEnabled?: boolean;
  onToggleSound: () => void;
}

export const ProfessionalNotificationSystem: React.FC<ProfessionalNotificationSystemProps> = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  soundEnabled = true,
  onToggleSound
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Calculate unread count
  useEffect(() => {
    const unread = notifications.filter(n => !n.read).length;
    setUnreadCount(unread);
  }, [notifications]);

  // Play notification sound
  const playNotificationSound = (priority: string) => {
    if (!soundEnabled) return;

    try {
      // Create audio context for notification sound
      const AudioContextClass = window.AudioContext || (window as unknown as Record<string, unknown>)['webkitAudioContext'];
      if (!AudioContextClass) return;
      const audioContext = new AudioContextClass() as AudioContext;
      
      // Different sounds for different priorities
      const frequency = priority === 'urgent' ? 800 : priority === 'high' ? 600 : 400;
      
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.log('Audio not supported:', error);
    }
  };

  // Play sound for new notifications
  useEffect(() => {
    if (!soundEnabled) return;
    
    const newNotifications = notifications.filter(n => 
      !n.read && 
      new Date(n.timestamp).getTime() > Date.now() - 10000 // Last 10 seconds
    );
    
    if (newNotifications.length > 0) {
      const latestNotification = newNotifications[0];
      playNotificationSound(latestNotification.priority);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notifications, soundEnabled]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'new_order':
        return <Bell className="w-5 h-5 text-green-600" />;
      case 'urgent':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'status_update':
        return <CheckCircle className="w-5 h-5 text-blue-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };


  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Sound Toggle */}
      <button
        onClick={onToggleSound}
        className="ml-2 p-2 text-gray-600 hover:text-gray-900 transition-colors"
        title={soundEnabled ? 'Disable sound' : 'Enable sound'}
      >
        {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <div className="absolute right-0 top-12 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-pink-50 to-purple-50">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={onMarkAllAsRead}
                    className="text-xs text-pink-600 hover:text-pink-700 font-medium"
                  >
                    Mark all read
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No notifications yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                      !notification.read ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => onMarkAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-semibold text-gray-900 truncate">
                            {notification.title}
                          </h4>
                          <span className="text-xs text-gray-500">
                            {formatTimeAgo(notification.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {notification.message}
                        </p>
                        {notification.orderId && (
                          <p className="text-xs text-pink-600 mt-1 font-medium">
                            Order #{notification.orderId.substring(0, 8)}...
                          </p>
                        )}
                      </div>
                      {!notification.read && (
                        <div className="flex-shrink-0">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfessionalNotificationSystem;
