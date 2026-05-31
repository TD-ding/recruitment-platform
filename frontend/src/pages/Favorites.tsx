import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { Job } from '../types';
import Loading from '../components/Loading';

export default function Favorites() {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/favorites').then(res => { setFavorites(res.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const handleUnfavorite = async (jobId: number) => {
    try {
      await api.delete(`/favorites/${jobId}`);
      setFavorites(favorites.filter(f => f.id !== jobId));
    } catch {}
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">我的收藏</h1>
      {loading ? <Loading /> : (
        <div className="space-y-3">
          {favorites.map(job => (
            <div key={job.favorite_id} className="bg-white rounded-lg shadow-sm border p-5">
              <div className="flex justify-between items-start">
                <Link to={`/jobs/${job.id}`} className="flex-1">
                  <h3 className="font-semibold text-gray-800 hover:text-primary-600">{job.title}</h3>
                  <p className="text-sm text-primary-600 mt-1">{job.company_name}</p>
                  <div className="flex gap-3 mt-2 text-sm text-gray-500">
                    <span>{job.location}</span>
                    {job.salary_min && job.salary_max && (
                      <span className="text-orange-500">{job.salary_min}-{job.salary_max}K</span>
                    )}
                  </div>
                </Link>
                <button onClick={() => handleUnfavorite(job.id)}
                  className="text-red-400 hover:text-red-600 text-sm ml-4">取消收藏</button>
              </div>
            </div>
          ))}
          {favorites.length === 0 && <p className="text-center text-gray-400 py-16">暂无收藏的职位</p>}
        </div>
      )}
    </div>
  );
}
