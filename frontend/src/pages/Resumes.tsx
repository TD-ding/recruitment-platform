import { useState, useEffect } from 'react';
import api from '../api';
import { Resume } from '../types';

export default function Resumes() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [editing, setEditing] = useState<Partial<Resume> | null>(null);
  const [showForm, setShowForm] = useState(false);

  const fetchResumes = () => {
    api.get('/resumes').then(res => setResumes(res.data)).catch(() => {});
  };
  useEffect(fetchResumes, []);

  const handleSave = async () => {
    if (!editing?.title || !editing?.name) return;
    try {
      if (editing.id) {
        await api.put(`/resumes/${editing.id}`, editing);
      } else {
        await api.post('/resumes', editing);
      }
      setShowForm(false);
      setEditing(null);
      fetchResumes();
    } catch {}
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确定删除该简历？')) return;
    await api.delete(`/resumes/${id}`);
    fetchResumes();
  };

  const startEdit = (r?: Resume) => {
    setEditing(r || { title: '', name: '', phone: '', email: '', education: '', experience: '', skills: '', self_intro: '', is_default: resumes.length === 0 ? 1 : 0 });
    setShowForm(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">我的简历</h1>
        <button onClick={() => startEdit()} className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">新建简历</button>
      </div>

      {showForm && editing && (
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">{editing.id ? '编辑简历' : '新建简历'}</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">简历标题 *</label>
              <input type="text" value={editing.title || ''} onChange={e => setEditing({...editing, title: e.target.value})}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">姓名 *</label>
              <input type="text" value={editing.name || ''} onChange={e => setEditing({...editing, name: e.target.value})}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">电话</label>
              <input type="tel" value={editing.phone || ''} onChange={e => setEditing({...editing, phone: e.target.value})}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">邮箱</label>
              <input type="email" value={editing.email || ''} onChange={e => setEditing({...editing, email: e.target.value})}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm text-gray-600 mb-1">教育经历</label>
              <textarea value={editing.education || ''} onChange={e => setEditing({...editing, education: e.target.value})}
                className="w-full border rounded-lg px-3 py-2 h-20 focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm text-gray-600 mb-1">工作经历</label>
              <textarea value={editing.experience || ''} onChange={e => setEditing({...editing, experience: e.target.value})}
                className="w-full border rounded-lg px-3 py-2 h-20 focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm text-gray-600 mb-1">技能</label>
              <textarea value={editing.skills || ''} onChange={e => setEditing({...editing, skills: e.target.value})}
                className="w-full border rounded-lg px-3 py-2 h-16 focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm text-gray-600 mb-1">自我介绍</label>
              <textarea value={editing.self_intro || ''} onChange={e => setEditing({...editing, self_intro: e.target.value})}
                className="w-full border rounded-lg px-3 py-2 h-20 focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={!!editing.is_default} onChange={e => setEditing({...editing, is_default: e.target.checked ? 1 : 0})} />
                <span className="text-sm text-gray-600">设为默认简历</span>
              </label>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={handleSave} className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">保存</button>
            <button onClick={() => { setShowForm(false); setEditing(null); }} className="border px-4 py-2 rounded-lg hover:bg-gray-50">取消</button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {resumes.map(r => (
          <div key={r.id} className="bg-white rounded-lg shadow-sm border p-5">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-800">{r.title}</h3>
                  {r.is_default && <span className="bg-primary-100 text-primary-700 text-xs px-2 py-0.5 rounded">默认</span>}
                </div>
                <p className="text-sm text-gray-500 mt-1">{r.name} · {r.phone || '-'} · {r.email || '-'}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => startEdit(r)} className="text-sm text-primary-600 hover:text-primary-700">编辑</button>
                <button onClick={() => handleDelete(r.id)} className="text-sm text-red-500 hover:text-red-600">删除</button>
              </div>
            </div>
          </div>
        ))}
        {resumes.length === 0 && <p className="text-center text-gray-400 py-10">还没有简历，点击新建开始</p>}
      </div>
    </div>
  );
}
