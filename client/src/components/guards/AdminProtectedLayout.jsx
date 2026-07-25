import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AdminLayout from '../../layouts/AdminLayout';

const AdminProtectedLayout = () => {
  const { user, loading } = useSelector((state) => state.auth);

  if (loading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return <AdminLayout><Outlet /></AdminLayout>;
};

export default AdminProtectedLayout;
