import { Outlet, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import {
  LogOut,
} from 'lucide-react';
import { logout } from '../redux/slices/authSlice';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';

const Layout = () => {
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
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      <Navbar variant="default" />
      
      {/* User info bar */}
      <div className="bg-[#1a1a1a]/50 backdrop-blur-xl border-b border-white/10 px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.name}</p>
            <p className="text-xs text-gray-400 truncate hidden sm:block">{user?.email}</p>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-400 bg-transparent border border-white/10 cursor-pointer transition-all hover:bg-white/5 min-h-[44px]"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm font-medium hidden sm:inline">Logout</span>
        </button>
      </div>

      {/* Page content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
};

export default Layout;
