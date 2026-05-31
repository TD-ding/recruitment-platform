import { useState, useEffect } from 'react';
import api from '../api';

export default function Settings() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.get('/admin/settings').then(res => setSettings(res.data)).catch(() => {});
  }, []);

  const handleSave = async () => {
    try {
      await api.put('/admin/settings', settings);
      setMessage('保存成功');
      setTimeout(() => setMessage(''), 2000);
    } catch {
      setMessage('保存失败');
    }
  };

  const defaults: Record<string, string> = {
    site_name: '招聘平台',
    site_description: '专业的在线招聘平台',
    contact_email: 'admin@recruitment.com',
    max_jobs_per_company: '50',
    allow_registration: 'true',
  };

  // Merge defaults with saved settings
  const merged = { ...defaults, ...settings };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">系统设置</h1>
      <div className="bg-white rounded-lg shadow p-6 space-y-4 max-w-2xl">
        {Object.entries(merged).map(([key, value]) => (
          <div key={key}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{key}</label>
            <input
              type="text"
              value={settings[key] !== undefined ? settings[key] : value}
              onChange={e => setSettings({ ...settings, [key]: e.target.value })}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        ))}
        <button onClick={handleSave} className="bg-primary-600 text-white px-6 py-2 rounded hover:bg-primary-700">保存设置</button>
        {message && <p className="text-sm text-green-600">{message}</p>}
      </div>
    </div>
  );
}
