import { useState, useEffect } from 'react';
import api from '../api';

interface Stats {
  users: number;
  jobs: number;
  companies: number;
  applications: number;
  pending_jobs: number;
  pending_companies: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    api.get('/admin/stats').then(res => setStats(res.data)).catch(() => {});
  }, []);

  if (!stats) return <div>加载中...</div>;

  const cards = [
    { label: '总用户', value: stats.users, color: 'bg-blue-500' },
    { label: '总职位', value: stats.jobs, color: 'bg-green-500' },
    { label: '总企业', value: stats.companies, color: 'bg-purple-500' },
    { label: '总投递', value: stats.applications, color: 'bg-orange-500' },
    { label: '待审职位', value: stats.pending_jobs, color: 'bg-yellow-500' },
    { label: '待审企业', value: stats.pending_companies, color: 'bg-red-500' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">仪表盘</h1>
      <div className="grid grid-cols-3 gap-4">
        {cards.map(c => (
          <div key={c.label} className="bg-white rounded-lg shadow p-5">
            <p className="text-gray-500 text-sm">{c.label}</p>
            <p className={`text-3xl font-bold mt-1 text-white w-fit px-2 rounded ${c.color}`}>{c.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
