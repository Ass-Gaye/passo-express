import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { Bell, X, Mail } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export default function NotificationsCenter() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  const socketRef = useRef(null);

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
    // Poll for new notifications every 10 seconds
    const interval = setInterval(() => {
      fetchNotifications();
      fetchUnreadCount();
    }, 10000);

    return () => clearInterval(interval);
  }, [showUnreadOnly]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const socket = io(API_URL, {
      transports: ['websocket', 'polling'],
    });

    socket.on('connect', async () => {
      try {
        const response = await axios.get(`${API_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        socket.emit('join-user-notifications', response.data.id);
      } catch (error) {
        console.error('Failed to join notification room', error);
      }
    });

    socket.on('notification', (notification) => {
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => {
        const next = prev + 1;
        try {
          localStorage.setItem('unreadNotifications', String(next));
        } catch (e) {}
        return next;
      });
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const queryString = showUnreadOnly ? '?isRead=false' : '';
      const response = await axios.get(
        `${API_URL}/api/notifications${queryString}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotifications(response.data.notifications);
    } catch (err) {
      setError('Error fetching notifications');
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/notifications/unread/count`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUnreadCount(response.data.unreadCount);
      try {
        localStorage.setItem('unreadNotifications', String(response.data.unreadCount || 0));
      } catch (e) {}
    } catch (err) {
      console.error('Error fetching unread count:', err);
    }
  };

  // keep localStorage in sync for other UI components (e.g., Navbar)
  useEffect(() => {
    try {
      localStorage.setItem('unreadNotifications', String(unreadCount || 0));
    } catch (e) {}
  }, [unreadCount]);

  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API_URL}/api/notifications/${notificationId}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchNotifications();
      fetchUnreadCount();
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API_URL}/api/notifications/read-all`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchNotifications();
      fetchUnreadCount();
    } catch (err) {
      console.error('Error marking all as read:', err);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/api/notifications/${notificationId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchNotifications();
      fetchUnreadCount();
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  };

  const getNotificationColor = (type) => {
    const colors = {
      BOOKING_CONFIRMATION: 'bg-green-50 border-green-200',
      BOOKING_CANCELLED: 'bg-red-50 border-red-200',
      TRIP_DEPARTURE: 'bg-blue-50 border-blue-200',
      TRIP_DELAYED: 'bg-yellow-50 border-yellow-200',
      PAYMENT_CONFIRMED: 'bg-green-50 border-green-200',
      PAYMENT_FAILED: 'bg-red-50 border-red-200',
      FARE_UPDATE: 'bg-indigo-50 border-indigo-200',
      SYSTEM_ALERT: 'bg-purple-50 border-purple-200',
    };
    return colors[type] || 'bg-gray-50 border-gray-200';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <Bell className="text-blue-600" size={32} />
            Notifications
          </h1>
          {unreadCount > 0 && (
            <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
              {unreadCount} Unread
            </span>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Controls */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setShowUnreadOnly(!showUnreadOnly)}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              showUnreadOnly
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            {showUnreadOnly ? 'Unread Only' : 'All Notifications'}
          </button>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="px-4 py-2 bg-white text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Mark All as Read
            </button>
          )}
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading notifications...</p>
            </div>
          ) : notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`rounded-lg shadow p-4 border ${getNotificationColor(
                  notification.type
                )} transition hover:shadow-lg`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Mail className="text-blue-600" size={18} />
                      <h3 className="font-semibold text-gray-800">
                        {notification.title}
                      </h3>
                      {!notification.isRead && (
                        <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                      )}
                    </div>
                    <p className="text-gray-700 mb-2">{notification.message}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    {!notification.isRead && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="text-blue-600 hover:text-blue-800 font-semibold text-sm"
                      >
                        Mark as Read
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No notifications yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}