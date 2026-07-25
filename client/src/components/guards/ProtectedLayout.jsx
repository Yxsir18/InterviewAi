import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PremiumLayout from '../layout/PremiumLayout';

const ProtectedLayout = () => {
  const { user, loading } = useSelector((state) => state.auth);

  if (loading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <PremiumLayout><Outlet /></PremiumLayout>;
};

export default ProtectedLayout;
