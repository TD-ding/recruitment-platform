import { useState, useEffect } from 'react';
import api from '../../api';

const statusMap: Record<string, { label: string; color: string; next: string[] }> = {
  pending: { label: '待查看', color: 'bg-yellow-100 text-yellow-700', next: ['viewed', 'rejected'] },
  viewed: { label: '已查看', color: 'bg-blue-100 text-blue-700', next: ['interview', 'rejected'] },
  interview: { label: '面试邀请', color: 'bg-green-100 text-green-700', next: ['accepted', 'rejected'] },
  rejected: { label: '已拒绝', color: 'bg-red-100 text-red-700', next: [] },
  accepted: { label: '已录用', color: 'bg-emerald-100 text-emerald-700', next: [] },
};

const actionLabels: Record<string, string> = {
  viewed: '标记已查看',
  interview: '发送面试邀请',
  rejected: '拒绝',
  accepted: '录用',
};

export default function EmployerApplications() {
  const [applications, setApplications] = useState<any[]>([]);

  const fetchApps = () => {
    api.get('/applications/employer').then(res => setApplications(res.data)).catch(() => {});
  };
  useEffect(fetchApps, []);

  const handleStatus = async (id: number, status: string) => {
    try {
      await api.put(`/applications/${id}/status`, { status });
      fetchApps();
    } catch {}
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">收到的简历</h1>
      <div className="space-y-4">
        {applications.map(app => {
          const s = statusMap[app.status] || statusMap.pending;
          return (
            <div key={app.id} className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-gray-800">{app.applicant_name}</h3>
                  <p className="text-sm text-gray-500 mt-1">应聘: {app.job_title}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${s.color}`}>{s.label}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                {app.applicant_phone && <span>电话: {app.applicant_phone}</span>}
                {app.applicant_email && <span>邮箱: {app.applicant_email}</span>}
                {app.education && <span>教育: {app.education}</span>}
              </div>
              {app.skills && (
                <div className="mb-3">
                  <span className="text-sm text-gray-500">技能: </span>
                  <span className="text-sm text-gray-700">{app.skills}</span>
                </div>
              )}
              {app.self_intro && (
                <div className="mb-3">
                  <span className="text-sm text-gray-500">自我介绍: </span>
                  <span className="text-sm text-gray-700">{app.self_intro}</span>
                </div>
              )}
              <div className="flex gap-2 pt-3 border-t">
                {s.next.map(n => (
                  <button key={n} onClick={() => handleStatus(app.id, n)}
                    className={`text-xs px-3 py-1 rounded ${n === 'rejected' ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-primary-50 text-primary-600 hover:bg-primary-100'}`}>
                    {actionLabels[n]}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
        {applications.length === 0 && <p className="text-center text-gray-400 py-10">暂无投递记录</p>}
      </div>
    </div>
  );
}
