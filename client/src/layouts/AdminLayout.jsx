import { Outlet, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { logout } from '../redux/slices/authSlice';
import toast from 'react-hot-toast';
import EnterpriseSidebar from '../components/admin/EnterpriseSidebar';
import ThemeSwitcher from '../components/ui/ThemeSwitcher';
import '../styles/enterprise-theme.css';

const AdminLayout = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  return (
    <div className="enterprise-theme flex min-h-screen bg-[var(--color-bg-primary)]">
      <EnterpriseSidebar />
      
      {/* Main content area */}
      <div className="flex-1 lg:ml-[280px] transition-all duration-300">
        {/* User info bar */}
        <div className="bg-[var(--color-navbar)]/50 backdrop-blur-xl border-b border-[var(--color-border)] px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-primary-blue)] to-[var(--color-secondary-cyan)] flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-[var(--color-text-heading)] truncate">{user?.name}</p>
              <p className="text-xs text-[var(--color-text-muted)] truncate">{user?.email}</p>
            </div>
          </div>
          <ThemeSwitcher />
        </div>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8 overflow-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
