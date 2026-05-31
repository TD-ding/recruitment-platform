import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import JobList from './pages/JobList';
import JobDetail from './pages/JobDetail';
import CompanyDetail from './pages/CompanyDetail';
import Profile from './pages/Profile';
import Resumes from './pages/Resumes';
import Applications from './pages/Applications';
import EmployerDashboard from './pages/employer/Dashboard';
import EmployerJobs from './pages/employer/Jobs';
import EmployerApplications from './pages/employer/Applications';
import EmployerCompany from './pages/employer/Company';

function PrivateRoute({ children, roles }: { children: React.ReactNode; roles?: string[] }) {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (roles && user && !roles.includes(user.role)) return <Navigate to="/" />;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/jobs" element={<JobList />} />
        <Route path="/jobs/:id" element={<JobDetail />} />
        <Route path="/companies/:id" element={<CompanyDetail />} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/resumes" element={<PrivateRoute roles={['seeker']}><Resumes /></PrivateRoute>} />
        <Route path="/applications" element={<PrivateRoute roles={['seeker']}><Applications /></PrivateRoute>} />
        <Route path="/employer" element={<PrivateRoute roles={['employer']}><EmployerDashboard /></PrivateRoute>} />
        <Route path="/employer/jobs" element={<PrivateRoute roles={['employer']}><EmployerJobs /></PrivateRoute>} />
        <Route path="/employer/applications" element={<PrivateRoute roles={['employer']}><EmployerApplications /></PrivateRoute>} />
        <Route path="/employer/company" element={<PrivateRoute roles={['employer']}><EmployerCompany /></PrivateRoute>} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
