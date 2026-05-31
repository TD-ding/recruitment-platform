import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import { Company, Job } from '../types';

export default function CompanyDetail() {
  const { id } = useParams();
  const [company, setCompany] = useState<Company | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    api.get(`/companies/${id}`).then(res => setCompany(res.data)).catch(() => {});
    api.get(`/companies/${id}/jobs`).then(res => setJobs(res.data)).catch(() => {});
  }, [id]);

  if (!company) return <div className="text-center py-20 text-gray-400">加载中...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-sm border p-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600 text-2xl font-bold">
            {company.name[0]}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{company.name}</h1>
            <div className="text-sm text-gray-500 mt-1">
              {[company.industry, company.size, company.location].filter(Boolean).join(' · ')}
            </div>
          </div>
        </div>

        {company.description && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">公司简介</h2>
            <p className="text-gray-600 whitespace-pre-line">{company.description}</p>
          </div>
        )}

        {company.website && (
          <div className="mt-4">
            <span className="text-gray-500">官网：</span>
            <span className="text-primary-600">{company.website}</span>
          </div>
        )}
      </div>

      {/* Company jobs */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">在招职位</h2>
        <div className="space-y-3">
          {jobs.map(job => (
            <Link key={job.id} to={`/jobs/${job.id}`} className="block bg-white rounded-lg shadow-sm border p-4 hover:shadow-md">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-semibold text-gray-800">{job.title}</h3>
                  <span className="text-sm text-gray-500">{job.location}</span>
                </div>
                {job.salary_min && job.salary_max && (
                  <span className="text-orange-500 font-semibold">{job.salary_min}-{job.salary_max}K</span>
                )}
              </div>
            </Link>
          ))}
          {jobs.length === 0 && <p className="text-gray-400 text-center py-6">暂无在招职位</p>}
        </div>
      </div>
    </div>
  );
}
