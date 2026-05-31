import { useState, useEffect } from 'react';
import api from '../api';

export default function CompanyReview() {
  const [companies, setCompanies] = useState<any[]>([]);

  const fetch = () => {
    api.get('/admin/companies/pending').then(res => setCompanies(res.data)).catch(() => {});
  };
  useEffect(fetch, []);

  const handleAction = async (id: number, status: string) => {
    await api.put(`/admin/companies/${id}/status`, { status });
    fetch();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">企业审核</h1>
      <div className="space-y-4">
        {companies.map(c => (
          <div key={c.id} className="bg-white rounded-lg shadow p-5">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold">{c.name}</h3>
                <p className="text-sm text-gray-500">{c.industry || '-'} · {c.size || '-'} · {c.location}</p>
              </div>
              <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded">待审核</span>
            </div>
            {c.description && <p className="text-sm text-gray-600 mb-3">{c.description}</p>}
            {c.website && <p className="text-sm text-primary-600 mb-3">官网: {c.website}</p>}
            <div className="flex gap-2">
              <button onClick={() => handleAction(c.id, 'approved')}
                className="bg-green-50 text-green-600 px-4 py-1.5 rounded text-sm hover:bg-green-100">通过</button>
              <button onClick={() => handleAction(c.id, 'rejected')}
                className="bg-red-50 text-red-600 px-4 py-1.5 rounded text-sm hover:bg-red-100">拒绝</button>
            </div>
          </div>
        ))}
        {companies.length === 0 && <p className="text-center text-gray-400 py-10">暂无待审核企业</p>}
      </div>
    </div>
  );
}
