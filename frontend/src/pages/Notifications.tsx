import { useState, useEffect } from 'react';
import api from '../api';
import Loading from '../components/Loading';

interface Notification {
  id: number;
  type: string;
  title: string;
  content: string;
  is_read: number;
  created_at: string;
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/notifications').then(res => { setNotifications(res.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const handleMarkRead = async (id: number) => {
    await api.put(`/notifications/${id}/read`);
    setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: 1 } : n));
  };

  const handleMarkAllRead = async () => {
    await api.put('/notifications/read-all');
    setNotifications(notifications.map(n => ({ ...n, is_read: 1 })));
  };

  const typeIcon: Record<string, string> = {
    application: '📋',
    interview: '🎤',
    status: '📊',
    system: '🔔',
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">通知</h1>
        {notifications.some(n => !n.is_read) && (
          <button onClick={handleMarkAllRead} className="text-sm text-primary-600 hover:text-primary-700">全部已读</button>
        )}
      </div>
      {loading ? <Loading /> : (
        <div className="space-y-2">
          {notifications.map(n => (
            <div key={n.id}
              className={`bg-white rounded-lg border p-4 ${n.is_read ? 'opacity-60' : 'border-l-4 border-l-primary-500'}`}
              onClick={() => !n.is_read && handleMarkRead(n.id)}>
              <div className="flex items-start gap-3">
                <span className="text-lg">{typeIcon[n.type] || '🔔'}</span>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800">{n.title}</h3>
                  {n.content && <p className="text-sm text-gray-500 mt-1">{n.content}</p>}
                  <p className="text-xs text-gray-400 mt-1">{new Date(n.created_at).toLocaleString()}</p>
                </div>
              </div>
            </div>
          ))}
          {notifications.length === 0 && <p className="text-center text-gray-400 py-16">暂无通知</p>}
        </div>
      )}
    </div>
  );
}
