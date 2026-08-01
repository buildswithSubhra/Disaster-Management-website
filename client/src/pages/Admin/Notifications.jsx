import React, { useState, useEffect } from 'react';
import { FaCheckDouble, FaBell, FaPaperPlane } from 'react-icons/fa';
import { toast } from 'react-toastify';
import notificationService from '../../services/notificationService';
import LoadingSpinner from '../../components/LoadingSpinner';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCompose, setShowCompose] = useState(false);
  const [compose, setCompose] = useState({ title: '', message: '', receiverId: '' });
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const load = async () => {
      try { const r = await notificationService.getNotifications({ limit: 50 }); const d = r.data; setNotifications(d?.notifications || d || []); }
      catch { setNotifications([{ id: '1', title: 'New Disaster Report', message: 'A flood has been reported in Mumbai.', isRead: false, createdAt: new Date().toISOString() }, { id: '2', title: 'Rescuer Assigned', message: 'Rajesh Kumar assigned.', isRead: true, createdAt: new Date(Date.now() - 3600000).toISOString() }]); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      try { const r = await notificationService.getNotifications({ limit: 50 }); const d = r.data; setNotifications(d?.notifications || d || []); } catch {}
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const markRead = async (id) => { try { await notificationService.markAsRead(id); } catch {} setNotifications(p => p.map(n => (n.id === id || n._id === id) ? { ...n, isRead: true } : n)); };
  const markAll = async () => { try { await notificationService.markAllAsRead(); } catch {} setNotifications(p => p.map(n => ({ ...n, isRead: true }))); };

  const handleSend = async () => {
    if (!compose.title.trim() || !compose.message.trim()) return toast.error('Title and message required');
    if (compose.receiverId && !/^[0-9a-fA-F]{24}$/.test(compose.receiverId.trim())) {
      return toast.error('Receiver ID must be a valid 24-character User ID, or leave empty to broadcast');
    }
    setSending(true);
    try {
      await notificationService.sendNotification({
        title: compose.title.trim(),
        message: compose.message.trim(),
        receiverId: compose.receiverId.trim() || undefined
      });
      toast.success('Notification sent!');
      setCompose({ title: '', message: '', receiverId: '' });
      setShowCompose(false);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to send notification.'); }
    finally { setSending(false); }
  };

  if (loading) return <LoadingSpinner />;

  const unread = notifications.filter(n => !n.isRead).length;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 font-semibold">Notifications</p>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">Notifications</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{unread} unread</p>
        </div>
        <div className="flex gap-2">
          {unread > 0 && <button onClick={markAll} className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all flex items-center gap-2"><FaCheckDouble className="h-3.5 w-3.5" /> Mark all read</button>}
          <button onClick={() => setShowCompose(!showCompose)} className="btn-primary flex items-center gap-2"><FaPaperPlane className="h-3.5 w-3.5" /> Send notification</button>
        </div>
      </div>

      {showCompose && (
        <div className="card space-y-4">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Compose notification</h3>
          <div><label className="form-label">Title</label><input type="text" value={compose.title} onChange={e => setCompose(p => ({ ...p, title: e.target.value }))} className="input-field" placeholder="Notification title" /></div>
          <div><label className="form-label">Message</label><textarea value={compose.message} onChange={e => setCompose(p => ({ ...p, message: e.target.value }))} className="input-field resize-none" rows="3" placeholder="Notification message..." /></div>
          <div>
            <label className="form-label">Receiver ID (leave empty for broadcast)</label>
            <input type="text" value={compose.receiverId} onChange={e => setCompose(p => ({ ...p, receiverId: e.target.value }))} className="input-field" placeholder="Leave empty to send to everyone" />
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Find User IDs in the Users management page. Leave empty to notify all users.</p>
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={() => setShowCompose(false)} className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">Cancel</button>
            <button onClick={handleSend} disabled={sending} className="btn-primary flex items-center gap-2">{sending ? 'Sending...' : <><FaPaperPlane className="h-3.5 w-3.5" /> Send</>}</button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {notifications.length === 0 ? (
          <div className="card text-center py-12"><FaBell className="h-8 w-8 text-gray-200 dark:text-gray-600 mx-auto mb-3" /><p className="text-sm text-gray-400 dark:text-gray-500">No notifications</p></div>
        ) : notifications.map(n => (
          <div key={n.id || n._id} onClick={() => markRead(n.id || n._id)} className={`card flex items-start gap-3 cursor-pointer transition-all hover:shadow-card-hover ${!n.isRead ? 'border-l-2 border-navy-800' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${!n.isRead ? 'bg-navy-50 dark:bg-navy-900/30' : 'bg-gray-50 dark:bg-gray-700'}`}><FaBell className={`h-3.5 w-3.5 ${!n.isRead ? 'text-navy-600 dark:text-navy-400' : 'text-gray-300 dark:text-gray-500'}`} /></div>
            <div className="min-w-0 flex-1">
              <p className={`text-sm font-medium ${!n.isRead ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'}`}>{n.title}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{n.message}</p>
              <p className="text-[11px] text-gray-300 dark:text-gray-500 mt-1">{new Date(n.createdAt).toLocaleString()}</p>
            </div>
            {!n.isRead && <div className="w-2 h-2 bg-navy-600 rounded-full flex-shrink-0 mt-1.5"></div>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsPage;
