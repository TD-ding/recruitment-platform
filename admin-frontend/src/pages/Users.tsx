import { useState, useEffect } from 'react';
import api from '../api';

export default function Users() {
  const [users, setUsers] = useState<any[]>([]);
  const [role, setRole] = useState('');

  const fetch = () => {
    api.get('/admin/users', { params: { role: role || undefined } }).then(res => setUsers(res.data)).catch(() => {});
  };

  useEffect(fetch, [role]);

  const handleDelete = async (id: number) => {
    if (!confirm('确定删除？')) return;
    await api.delete(`/admin/users/${id}`);
    fetch();
  };

  const roleLabels: Record<string, string> = { seeker: '求职者', employer: '企业', admin: '管理员' };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">用户管理</h1>
        <select value={role} onChange={e => setRole(e.target.value)} className="border rounded px-3 py-2">
          <option value="">全部角色</option>
          <option value="seeker">求职者</option>
          <option value="employer">企业</option>
          <option value="admin">管理员</option>
        </select>
      </div>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3">ID</th>
              <th className="text-left px-4 py-3">姓名</th>
              <th className="text-left px-4 py-3">邮箱</th>
              <th className="text-left px-4 py-3">角色</th>
              <th className="text-left px-4 py-3">注册时间</th>
              <th className="text-left px-4 py-3">操作</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">{u.id}</td>
                <td className="px-4 py-3">{u.name}</td>
                <td className="px-4 py-3">{u.email}</td>
                <td className="px-4 py-3"><span className="bg-gray-100 px-2 py-0.5 rounded text-xs">{roleLabels[u.role] || u.role}</span></td>
                <td className="px-4 py-3">{u.created_at}</td>
                <td className="px-4 py-3">
                  {u.role !== 'admin' && (
                    <button onClick={() => handleDelete(u.id)} className="text-red-500 hover:text-red-600 text-xs">删除</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
