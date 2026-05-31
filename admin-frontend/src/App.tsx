import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import api from './api';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import JobReview from './pages/JobReview';
import CompanyReview from './pages/CompanyReview';
import Settings from './pages/Settings';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.user.role !== 'admin') {
        setError('仅管理员可登录');
        return;
      }
      localStorage.setItem('admin_token', res.data.token);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || '登录失败');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow p-8 w-96">
        <h1 className="text-xl font-bold text-center mb-6">管理后台登录</h1>
        {error && <div className="bg-red-50 text-red-600 p-2 rounded mb-3 text-sm">{error}</div>}
        <form onSubmit={handleLogin} className="space-y-4">
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="管理员邮箱" required
            className="w-full border rounded px-3 py-2" />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="密码" required
            className="w-full border rounded px-3 py-2" />
          <button type="submit" className="w-full bg-primary-600 text-white py-2 rounded hover:bg-primary-700">登录</button>
        </form>
      </div>
    </div>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const links = [
    { path: '/', label: '仪表盘' },
    { path: '/users', label: '用户管理' },
    { path: '/jobs', label: '职位审核' },
    { path: '/companies', label: '企业审核' },
    { path: '/settings', label: '系统设置' },
  ];

  return (
    <div className="flex min-h-screen">
      <aside className="w-56 bg-gray-900 text-white p-4">
        <h1 className="text-lg font-bold mb-6">管理后台</h1>
        <nav className="space-y-1">
          {links.map(l => (
            <button key={l.path} onClick={() => navigate(l.path)}
              className={`w-full text-left px-3 py-2 rounded text-sm ${location.pathname === l.path ? 'bg-primary-600' : 'hover:bg-gray-800'}`}>
              {l.label}
            </button>
          ))}
        </nav>
        <button onClick={() => { localStorage.removeItem('admin_token'); navigate('/login'); }}
          className="w-full text-left px-3 py-2 rounded text-sm hover:bg-gray-800 mt-6 text-gray-400">退出登录</button>
      </aside>
      <main className="flex-1 bg-gray-50 p-6 overflow-auto">{children}</main>
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) { setAuthed(false); return; }
    api.get('/auth/me').then(res => {
      setAuthed(res.data.role === 'admin');
    }).catch(() => setAuthed(false));
  }, []);

  if (authed === null) return <div className="flex items-center justify-center h-screen">加载中...</div>;
  if (!authed) return <Navigate to="/login" />;
  return <Layout>{children}</Layout>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
      <Route path="/jobs" element={<ProtectedRoute><JobReview /></ProtectedRoute>} />
      <Route path="/companies" element={<ProtectedRoute><CompanyReview /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
    </Routes>
  );
}
