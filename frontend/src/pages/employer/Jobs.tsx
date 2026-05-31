import { useState, useEffect } from 'react';
import api from '../../api';
import { Job } from '../../types';

export default function EmployerJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', requirements: '', salary_min: '', salary_max: '', location: '', category: '', experience: '', education: '' });

  const fetchJobs = () => {
    api.get('/jobs/employer/mine').then(res => setJobs(res.data)).catch(() => {});
  };
  useEffect(fetchJobs, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/jobs', {
        ...form,
        salary_min: form.salary_min ? Number(form.salary_min) : undefined,
        salary_max: form.salary_max ? Number(form.salary_max) : undefined,
      });
      setShowForm(false);
      setForm({ title: '', description: '', requirements: '', salary_min: '', salary_max: '', location: '', category: '', experience: '', education: '' });
      fetchJobs();
    } catch (err: any) {
      alert(err.response?.data?.error || '创建失败');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确定删除？')) return;
    await api.delete(`/jobs/${id}`);
    fetchJobs();
  };

  const statusLabel: Record<string, { text: string; cls: string }> = {
    pending: { text: '待审核', cls: 'bg-yellow-100 text-yellow-700' },
    approved: { text: '已通过', cls: 'bg-green-100 text-green-700' },
    rejected: { text: '已拒绝', cls: 'bg-red-100 text-red-700' },
    closed: { text: '已关闭', cls: 'bg-gray-100 text-gray-700' },
  };

  const categories = ['技术', '产品', '设计', '运营', '市场', '财务', '人事', '其他'];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">职位管理</h1>
        <button onClick={() => setShowForm(!showForm)} className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
          {showForm ? '取消' : '发布职位'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white rounded-lg shadow-sm border p-6 mb-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">职位名称 *</label>
              <input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">工作地点 *</label>
              <input type="text" value={form.location} onChange={e => setForm({...form, location: e.target.value})} required
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">薪资范围（K）</label>
              <div className="flex gap-2">
                <input type="number" value={form.salary_min} onChange={e => setForm({...form, salary_min: e.target.value})} placeholder="最低"
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500" />
                <input type="number" value={form.salary_max} onChange={e => setForm({...form, salary_max: e.target.value})} placeholder="最高"
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">分类</label>
              <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option value="">选择分类</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">经验要求</label>
              <input type="text" value={form.experience} onChange={e => setForm({...form, experience: e.target.value})} placeholder="如: 3-5年"
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">学历要求</label>
              <input type="text" value={form.education} onChange={e => setForm({...form, education: e.target.value})} placeholder="如: 本科"
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">职位描述 *</label>
            <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} required rows={4}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">任职要求</label>
            <textarea value={form.requirements} onChange={e => setForm({...form, requirements: e.target.value})} rows={4}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <button type="submit" className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700">发布</button>
        </form>
      )}

      <div className="space-y-3">
        {jobs.map(job => {
          const s = statusLabel[job.status] || statusLabel.pending;
          return (
            <div key={job.id} className="bg-white rounded-lg shadow-sm border p-5">
              <div className="flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-800">{job.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded ${s.cls}`}>{s.text}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{job.location} · {job.category || '未分类'}</p>
                </div>
                <div className="flex items-center gap-3">
                  {job.salary_min && job.salary_max && (
                    <span className="text-orange-500 font-medium">{job.salary_min}-{job.salary_max}K</span>
                  )}
                  <button onClick={() => handleDelete(job.id)} className="text-sm text-red-500 hover:text-red-600">删除</button>
                </div>
              </div>
            </div>
          );
        })}
        {jobs.length === 0 && <p className="text-center text-gray-400 py-10">暂无职位，点击发布</p>}
      </div>
    </div>
  );
}
