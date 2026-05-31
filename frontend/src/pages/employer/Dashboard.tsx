import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';

export default function EmployerDashboard() {
  const [stats, setStats] = useState({ jobs: 0, applications: 0, pending: 0 });

  useEffect(() => {
    // Fetch employer's jobs count and applications
    api.get('/jobs/employer/mine').then(res => {
      const jobs = res.data;
      const pending = jobs.filter((j: any) => j.status === 'pending').length;
      setStats(s => ({ ...s, jobs: jobs.length, pending }));
    }).catch(() => {});
    api.get('/applications/employer').then(res => {
      setStats(s => ({ ...s, applications: res.data.length }));
    }).catch(() => {});
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">企业控制台</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <p className="text-gray-500 text-sm">发布职位</p>
          <p className="text-3xl font-bold text-gray-800 mt-1">{stats.jobs}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <p className="text-gray-500 text-sm">收到简历</p>
          <p className="text-3xl font-bold text-primary-600 mt-1">{stats.applications}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <p className="text-gray-500 text-sm">待审核</p>
          <p className="text-3xl font-bold text-orange-500 mt-1">{stats.pending}</p>
        </div>
      </div>
      <div className="flex gap-4">
        <Link to="/employer/jobs" className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">管理职位</Link>
        <Link to="/employer/applications" className="bg-white border px-4 py-2 rounded-lg hover:bg-gray-50">查看简历</Link>
        <Link to="/employer/company" className="bg-white border px-4 py-2 rounded-lg hover:bg-gray-50">公司信息</Link>
      </div>
    </div>
  );
}
