import { Navigate, useLocation } from 'react-router-dom';
import { useUserStore } from '../../stores/userStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireSeller?: boolean;
}

export function ProtectedRoute({ children, requireSeller }: ProtectedRouteProps) {
  const { user, loading } = useUserStore();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // if (requireSeller && user.role !== 'seller') {
  //   return (
  //     <div className="flex min-h-screen items-center justify-center">
  //       <div className="rounded-lg bg-red-50 p-4 text-center">
  //         <h2 className="text-lg font-semibold text-red-800">Access Denied</h2>
  //         <p className="mt-2 text-red-600">
  //           Only sellers can access this page.
  //         </p>
  //       </div>
  //     </div>
  //   );
  // }

  return <>{children}</>;
}