import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { Job } from '../types';
import Loading from '../components/Loading';

export default function Home() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/jobs', { params: { limit: 8 } })
      .then(res => setJobs(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/jobs?keyword=${encodeURIComponent(keyword)}`);
  };

  return (
    <div>
      <div className="bg-primary-600 text-white py-20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h1 className="text-4xl font-bold mb-4">找到你的理想工作</h1>
          <p className="text-primary-100 mb-8 text-lg">海量优质职位，精准匹配你的职业发展</p>
          <form onSubmit={handleSearch} className="flex gap-2 max-w-2xl mx-auto">
            <input
              type="text"
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              placeholder="搜索职位、公司或关键词..."
              className="flex-1 px-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-300"
            />
            <button type="submit" className="bg-primary-700 hover:bg-primary-800 px-6 py-3 rounded-lg font-medium transition-colors">搜索</button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6">热门职位</h2>
        {loading ? <Loading /> : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {jobs.map(job => (
              <Link key={job.id} to={`/jobs/${job.id}`} className="bg-white rounded-lg shadow-sm border p-5 hover:shadow-md transition-shadow group">
                <h3 className="font-semibold text-gray-800 mb-2 group-hover:text-primary-600 transition-colors">{job.title}</h3>
                <p className="text-primary-600 text-sm mb-2">{job.company_name}</p>
                <div className="flex items-center gap-2 text-gray-500 text-xs">
                  <span>{job.location}</span>
                  {job.salary_min && job.salary_max && (
                    <span className="text-orange-500 font-medium">{job.salary_min}-{job.salary_max}K</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
        <div className="text-center mt-8">
          <Link to="/jobs" className="text-primary-600 hover:text-primary-700 font-medium">查看更多职位 →</Link>
        </div>
      </div>
    </div>
  );
}
