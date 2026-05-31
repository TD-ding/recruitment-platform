import { useState, useEffect } from 'react';
import api from '../api';

export default function JobReview() {
  const [jobs, setJobs] = useState<any[]>([]);

  const fetch = () => {
    api.get('/admin/jobs/pending').then(res => setJobs(res.data)).catch(() => {});
  };
  useEffect(fetch, []);

  const handleAction = async (id: number, status: string) => {
    await api.put(`/admin/jobs/${id}/status`, { status });
    fetch();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">职位审核</h1>
      <div className="space-y-4">
        {jobs.map(job => (
          <div key={job.id} className="bg-white rounded-lg shadow p-5">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold">{job.title}</h3>
                <p className="text-sm text-gray-500">{job.company_name} · {job.location}</p>
                {job.salary_min && job.salary_max && (
                  <p className="text-sm text-orange-500">{job.salary_min}-{job.salary_max}K</p>
                )}
              </div>
              <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded">待审核</span>
            </div>
            <p className="text-sm text-gray-600 mb-3 line-clamp-3">{job.description}</p>
            <div className="flex gap-2">
              <button onClick={() => handleAction(job.id, 'approved')}
                className="bg-green-50 text-green-600 px-4 py-1.5 rounded text-sm hover:bg-green-100">通过</button>
              <button onClick={() => handleAction(job.id, 'rejected')}
                className="bg-red-50 text-red-600 px-4 py-1.5 rounded text-sm hover:bg-red-100">拒绝</button>
            </div>
          </div>
        ))}
        {jobs.length === 0 && <p className="text-center text-gray-400 py-10">暂无待审核职位</p>}
      </div>
    </div>
  );
}
