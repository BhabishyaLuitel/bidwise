import { Navigate, useLocation } from 'react-router-dom';
import { useUserStore } from '../../stores/userStore';

interface AdminRouteProps {
  children: React.ReactNode;
}

export const AdminRoute = ({ children }: AdminRouteProps) => {
  const { user, isAuthenticated } = useUserStore();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login page if not authenticated
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (user?.role !== 'admin') {
    // Redirect to home page if not an admin
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}; 