import React, { useState, useEffect, useCallback } from 'react';
import { FaBell, FaCheckDouble, FaExclamationTriangle, FaInfoCircle, FaUserInjured, FaHospital } from 'react-icons/fa';
import notificationService from '../services/notificationService';

const NotificationPanel = ({ onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    try {
      const response = await notificationService.getNotifications({ limit: 5 });
      const data = response.data;
      setNotifications(data?.notifications || data || []);
    } catch {
      setNotifications([
        { id: '1', title: 'New Disaster Reported', message: 'A flood has been reported in your area.', isRead: false, createdAt: new Date().toISOString() },
        { id: '2', title: 'Rescue Update', message: 'Your rescue mission has been assigned.', isRead: false, createdAt: new Date().toISOString() },
      ]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const getIcon = (title) => {
    if (title?.toLowerCase().includes('disaster') || title?.toLowerCase().includes('alert')) return <FaExclamationTriangle className="h-5 w-5 text-danger-500" />;
    if (title?.toLowerCase().includes('rescue') || title?.toLowerCase().includes('mission')) return <FaUserInjured className="h-5 w-5 text-warning-500" />;
    if (title?.toLowerCase().includes('shelter')) return <FaHospital className="h-5 w-5 text-success-500" />;
    return <FaInfoCircle className="h-5 w-5 text-primary-500" />;
  };

  const markAsRead = async (id) => {
    try { await notificationService.markAsRead(id); } catch {}
    setNotifications(prev => prev.map(n => (n.id === id || n._id === id) ? { ...n, isRead: true } : n));
  };

  const markAllAsRead = async () => {
    try { await notificationService.markAllAsRead(); } catch {}
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const getTimeAgo = (date) => {
    const diff = Math.floor((new Date() - new Date(date)) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white dark:bg-gray-800 rounded-xl shadow-card-hover border border-gray-100 dark:border-gray-700 overflow-hidden animate-fade-in z-50">
      <div className="px-4 py-3 bg-gray-50 dark:bg-gray-750 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center">
          <FaBell className="h-4 w-4 text-gray-600 dark:text-gray-300 mr-2" />
          <span className="font-semibold text-gray-800 dark:text-gray-100">Notifications</span>
          {unreadCount > 0 && <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">{unreadCount}</span>}
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllAsRead} className="text-xs text-navy-800 hover:underline flex items-center">
            <FaCheckDouble className="h-3 w-3 mr-1" />Mark all read
          </button>
        )}
      </div>
      <div className="max-h-80 overflow-y-auto">
        {loading ? (
          <div className="p-4 text-center text-gray-400 dark:text-gray-500 text-sm">Loading...</div>
        ) : notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-400 dark:text-gray-500 text-sm">No notifications</div>
        ) : (
          notifications.slice(0, 5).map((n) => (
            <div key={n.id || n._id} className={`px-4 py-3 border-b border-gray-50 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer ${!n.isRead ? 'bg-navy-50/50 dark:bg-navy-900/30' : ''}`}
              onClick={() => markAsRead(n.id || n._id)}>
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">{getIcon(n.title)}</div>
                <div className="ml-3 flex-1">
                  <p className={`text-sm font-medium ${!n.isRead ? 'text-gray-900 dark:text-gray-100' : 'text-gray-600 dark:text-gray-300'}`}>{n.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">{n.message}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{getTimeAgo(n.createdAt)}</p>
                </div>
                {!n.isRead && <div className="flex-shrink-0 ml-2"><div className="w-2 h-2 bg-navy-600 rounded-full"></div></div>}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationPanel;
