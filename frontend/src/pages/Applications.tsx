import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { Application } from '../types';

const statusMap: Record<string, { label: string; color: string }> = {
  pending: { label: '待查看', color: 'bg-yellow-100 text-yellow-700' },
  viewed: { label: '已查看', color: 'bg-blue-100 text-blue-700' },
  interview: { label: '面试邀请', color: 'bg-green-100 text-green-700' },
  rejected: { label: '已拒绝', color: 'bg-red-100 text-red-700' },
  accepted: { label: '已录用', color: 'bg-emerald-100 text-emerald-700' },
};

export default function Applications() {
  const [applications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    api.get('/applications/mine').then(res => setApplications(res.data)).catch(() => {});
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">投递记录</h1>
      <div className="space-y-3">
        {applications.map(app => {
          const s = statusMap[app.status] || statusMap.pending;
          return (
            <div key={app.id} className="bg-white rounded-lg shadow-sm border p-5">
              <div className="flex justify-between items-start">
                <div>
                  <Link to={`/jobs/${app.job_id}`} className="font-semibold text-gray-800 hover:text-primary-600">{app.job_title}</Link>
                  <p className="text-sm text-gray-500 mt-1">{app.company_name} · {app.job_location}</p>
                  {app.salary_min && app.salary_max && (
                    <p className="text-sm text-orange-500 mt-1">{app.salary_min}-{app.salary_max}K</p>
                  )}
                </div>
                <div className="text-right">
                  <span className={`text-xs px-2 py-1 rounded ${s.color}`}>{s.label}</span>
                  <p className="text-xs text-gray-400 mt-1">{new Date(app.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          );
        })}
        {applications.length === 0 && <p className="text-center text-gray-400 py-10">暂无投递记录</p>}
      </div>
    </div>
  );
}
