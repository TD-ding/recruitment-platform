import { useState, useEffect } from 'react';
import api from '../../api';

export default function EmployerCompany() {
  const [company, setCompany] = useState<any>(null);
  const [form, setForm] = useState({ name: '', description: '', industry: '', size: '', location: '', website: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.get('/companies/employer/mine').then(res => {
      if (res.data) {
        setCompany(res.data);
        setForm({
          name: res.data.name || '',
          description: res.data.description || '',
          industry: res.data.industry || '',
          size: res.data.size || '',
          location: res.data.location || '',
          website: res.data.website || '',
        });
      }
    }).catch(() => {});
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/companies', form);
      setMessage('保存成功，等待审核');
    } catch (err: any) {
      setMessage(err.response?.data?.error || '保存失败');
    }
  };

  const sizes = ['1-50人', '50-150人', '150-500人', '500-1000人', '1000人以上'];
  const industries = ['互联网', '金融', '教育', '医疗', '制造业', '零售', '其他'];

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">公司信息</h1>

      {company && (
        <div className="mb-4">
          <span className={`text-xs px-2 py-1 rounded ${
            company.status === 'approved' ? 'bg-green-100 text-green-700' :
            company.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
          }`}>
            {company.status === 'approved' ? '已通过' : company.status === 'pending' ? '待审核' : '已拒绝'}
          </span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white rounded-lg shadow-sm border p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">公司名称 *</label>
          <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">所在地 *</label>
          <input type="text" value={form.location} onChange={e => setForm({...form, location: e.target.value})} required
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">行业</label>
            <select value={form.industry} onChange={e => setForm({...form, industry: e.target.value})}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option value="">选择行业</option>
              {industries.map(i => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">规模</label>
            <select value={form.size} onChange={e => setForm({...form, size: e.target.value})}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option value="">选择规模</option>
              {sizes.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">官网</label>
          <input type="url" value={form.website} onChange={e => setForm({...form, website: e.target.value})}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">公司简介</label>
          <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={4}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500" />
        </div>
        <button type="submit" className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700">保存</button>
        {message && <p className="text-sm text-green-600">{message}</p>}
      </form>
    </div>
  );
}
