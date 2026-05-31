import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api';

export default function Profile() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [message, setMessage] = useState('');

  const handleSave = async () => {
    try {
      await api.put('/auth/me', { name, phone });
      setMessage('保存成功');
    } catch {
      setMessage('保存失败');
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-sm border p-8">
        <h1 className="text-2xl font-bold mb-6">个人中心</h1>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
            <input type="email" value={user.email} disabled className="w-full border rounded-lg px-3 py-2 bg-gray-50 text-gray-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">角色</label>
            <input type="text" value={user.role === 'seeker' ? '求职者' : user.role === 'employer' ? '企业' : '管理员'} disabled
              className="w-full border rounded-lg px-3 py-2 bg-gray-50 text-gray-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">姓名</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">手机号</label>
            <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <button onClick={handleSave} className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700">保存</button>
          {message && <p className="text-sm text-green-600">{message}</p>}
        </div>
      </div>
    </div>
  );
}
