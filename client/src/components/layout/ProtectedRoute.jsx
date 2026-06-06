import { Navigate, useLocation, Outlet } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

export default function ProtectedRoute({ children, roles }) {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && !roles.includes(user?.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  // If used as a layout route (no children), render Outlet
  return children ?? <Outlet />;
}
