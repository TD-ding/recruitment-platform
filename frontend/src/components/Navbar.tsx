import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="text-xl font-bold text-primary-600">招聘平台</Link>

          <div className="flex items-center gap-6">
            <Link to="/jobs" className="text-gray-600 hover:text-primary-600">职位</Link>

            {isAuthenticated && user ? (
              <>
                {user.role === 'seeker' && (
                  <>
                    <Link to="/resumes" className="text-gray-600 hover:text-primary-600">我的简历</Link>
                    <Link to="/applications" className="text-gray-600 hover:text-primary-600">投递记录</Link>
                  </>
                )}
                {user.role === 'employer' && (
                  <>
                    <Link to="/employer/jobs" className="text-gray-600 hover:text-primary-600">职位管理</Link>
                    <Link to="/employer/applications" className="text-gray-600 hover:text-primary-600">收到的简历</Link>
                    <Link to="/employer/company" className="text-gray-600 hover:text-primary-600">公司信息</Link>
                  </>
                )}
                {user.role === 'admin' && (
                  <a href="/admin" className="text-gray-600 hover:text-primary-600">管理后台</a>
                )}
                <Link to="/profile" className="text-gray-600 hover:text-primary-600">{user.name}</Link>
                <button onClick={handleLogout} className="text-gray-500 hover:text-red-500 text-sm">退出</button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-primary-600">登录</Link>
                <Link to="/register" className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-primary-700">注册</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
