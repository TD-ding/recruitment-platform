import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t mt-12">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-gray-800 mb-3">招聘平台</h3>
            <p className="text-sm text-gray-500">专业的在线招聘平台，连接企业与人才</p>
          </div>
          <div>
            <h3 className="font-bold text-gray-800 mb-3">求职者</h3>
            <div className="space-y-1">
              <Link to="/jobs" className="block text-sm text-gray-500 hover:text-primary-600">搜索职位</Link>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-gray-800 mb-3">企业服务</h3>
            <div className="space-y-1">
              <Link to="/register" className="block text-sm text-gray-500 hover:text-primary-600">注册企业账号</Link>
            </div>
          </div>
        </div>
        <div className="border-t mt-6 pt-6 text-center text-sm text-gray-400">
          &copy; 2024 招聘平台. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
