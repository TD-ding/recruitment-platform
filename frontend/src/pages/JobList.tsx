import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../api';
import { Job } from '../types';
import Loading from '../components/Loading';

export default function JobList() {
  const [searchParams] = useSearchParams();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [experience, setExperience] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const categories = ['技术', '产品', '设计', '运营', '市场', '财务', '人事', '其他'];
  const experiences = ['不限', '1-3年', '3-5年', '5-10年', '10年以上'];

  const fetchJobs = () => {
    setLoading(true);
    api.get('/jobs', { params: { keyword, location, category, experience, page, limit: 12 } })
      .then(res => setJobs(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchJobs(); }, [page]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchJobs();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">职位列表</h1>

      <form onSubmit={handleSearch} className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input type="text" value={keyword} onChange={e => setKeyword(e.target.value)} placeholder="关键词"
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500" />
          <input type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="城市"
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500" />
          <select value={category} onChange={e => setCategory(e.target.value)}
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500">
            <option value="">全部分类</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <div className="flex gap-2">
            <select value={experience} onChange={e => setExperience(e.target.value)}
              className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 flex-1">
              <option value="">经验不限</option>
              {experiences.map(e => <option key={e} value={e}>{e}</option>)}
            </select>
            <button type="submit" className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors">搜索</button>
          </div>
        </div>
      </form>

      {loading ? <Loading /> : (
        <div className="space-y-3">
          {jobs.map(job => (
            <Link key={job.id} to={`/jobs/${job.id}`} className="block bg-white rounded-lg shadow-sm border p-5 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{job.title}</h3>
                  <p className="text-primary-600 text-sm mt-1">{job.company_name}</p>
                  <div className="flex gap-3 mt-2 text-sm text-gray-500">
                    <span>{job.location}</span>
                    {job.experience && <span>{job.experience}</span>}
                    {job.education && <span>{job.education}</span>}
                  </div>
                </div>
                <div className="text-right">
                  {job.salary_min && job.salary_max && (
                    <span className="text-orange-500 font-semibold">{job.salary_min}-{job.salary_max}K</span>
                  )}
                  <p className="text-xs text-gray-400 mt-1">{new Date(job.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            </Link>
          ))}
          {jobs.length === 0 && <p className="text-center text-gray-400 py-10">暂无符合条件的职位</p>}
        </div>
      )}

      <div className="flex justify-center gap-2 mt-8">
        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
          className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors">上一页</button>
        <span className="px-4 py-2">第 {page} 页</span>
        <button onClick={() => setPage(p => p + 1)} disabled={jobs.length < 12}
          className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors">下一页</button>
      </div>
    </div>
  );
}
