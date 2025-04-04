import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthForm } from '../components/auth/AuthForm';
import { useUserStore } from '../stores/userStore';

export function AuthPage() {
  const { user } = useUserStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user) {
      // If there's a redirect path in location state, use that, otherwise go to home
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  // Don't render the auth form if user is already authenticated
  if (user) {
    return null;
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <AuthForm />
    </div>
  );
}