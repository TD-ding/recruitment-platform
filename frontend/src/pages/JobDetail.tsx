import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { Job, Resume } from '../types';

export default function JobDetail() {
  const { id } = useParams();
  const [job, setJob] = useState<Job | null>(null);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [selectedResume, setSelectedResume] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [message, setMessage] = useState('');
  const [favorited, setFavorited] = useState(false);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    api.get(`/jobs/${id}`).then(res => setJob(res.data)).catch(() => {});
  }, [id]);

  useEffect(() => {
    if (isAuthenticated && user?.role === 'seeker') {
      api.get('/resumes').then(res => {
        setResumes(res.data);
        const def = res.data.find((r: Resume) => r.is_default);
        if (def) setSelectedResume(String(def.id));
      }).catch(() => {});
      api.get(`/favorites/check/${id}`).then(res => setFavorited(res.data.favorited)).catch(() => {});
    }
  }, [isAuthenticated, user, id]);

  const handleFavorite = async () => {
    try {
      if (favorited) {
        await api.delete(`/favorites/${id}`);
        setFavorited(false);
      } else {
        await api.post('/favorites', { job_id: Number(id) });
        setFavorited(true);
      }
    } catch {}
  };

  const handleApply = async () => {
    if (!selectedResume) { setMessage('请选择简历'); return; }
    try {
      await api.post('/applications', { job_id: Number(id), resume_id: Number(selectedResume), cover_letter: coverLetter });
      setMessage('投递成功！');
    } catch (err: any) {
      setMessage(err.response?.data?.error || '投递失败');
    }
  };

  if (!job) return <div className="text-center py-20 text-gray-400">加载中...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-sm border p-8">
        <div className="flex justify-between items-start">
          <h1 className="text-2xl font-bold text-gray-800">{job.title}</h1>
          {isAuthenticated && user?.role === 'seeker' && (
            <button onClick={handleFavorite}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${favorited ? 'bg-red-50 text-red-500 hover:bg-red-100' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}>
              {favorited ? '♥ 已收藏' : '♡ 收藏'}
            </button>
          )}
        </div>
        <div className="flex items-center gap-4 mt-3">
          {job.salary_min && job.salary_max && (
            <span className="text-orange-500 font-semibold text-lg">{job.salary_min}-{job.salary_max}K</span>
          )}
          <span className="text-gray-500">{job.location}</span>
          {job.experience && <span className="text-gray-500">{job.experience}</span>}
          {job.education && <span className="text-gray-500">{job.education}</span>}
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-3">职位描述</h2>
          <p className="text-gray-600 whitespace-pre-line">{job.description}</p>
        </div>

        {job.requirements && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-3">任职要求</h2>
            <p className="text-gray-600 whitespace-pre-line">{job.requirements}</p>
          </div>
        )}

        {/* Company info */}
        <div className="mt-8 pt-6 border-t">
          <Link to={`/companies/${job.company_id}`} className="flex items-center gap-3 hover:bg-gray-50 p-3 rounded-lg -m-3">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600 font-bold">
              {job.company_name[0]}
            </div>
            <div>
              <p className="font-semibold text-gray-800">{job.company_name}</p>
              <p className="text-sm text-gray-500">
                {[job.company_industry, job.company_size, job.company_location].filter(Boolean).join(' · ')}
              </p>
            </div>
          </Link>
        </div>

        {/* Apply section */}
        {isAuthenticated && user?.role === 'seeker' && (
          <div className="mt-8 pt-6 border-t">
            <h2 className="text-lg font-semibold mb-3">投递简历</h2>
            {resumes.length === 0 ? (
              <p className="text-gray-500">请先<Link to="/resumes" className="text-primary-600">创建简历</Link></p>
            ) : (
              <div className="space-y-3">
                <select value={selectedResume} onChange={e => setSelectedResume(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option value="">选择简历</option>
                  {resumes.map(r => <option key={r.id} value={r.id}>{r.title}</option>)}
                </select>
                <textarea value={coverLetter} onChange={e => setCoverLetter(e.target.value)} placeholder="求职信（可选）"
                  className="w-full border rounded-lg px-3 py-2 h-24 focus:outline-none focus:ring-2 focus:ring-primary-500" />
                <button onClick={handleApply} className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700">投递</button>
                {message && <p className="text-sm text-green-600">{message}</p>}
              </div>
            )}
          </div>
        )}

        {!isAuthenticated && (
          <div className="mt-8 pt-6 border-t text-center">
            <Link to="/login" className="text-primary-600 hover:text-primary-700">登录后可投递简历</Link>
          </div>
        )}
      </div>
    </div>
  );
}
