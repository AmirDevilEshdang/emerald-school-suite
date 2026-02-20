import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Role } from '@/lib/data';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: Role[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/auth" replace />;
  }

  if (!allowedRoles.includes(currentUser.role)) {
    // Redirect to their own panel
    const roleRoutes: Record<Role, string> = {
      admin: '/admin',
      assistant: '/assistant',
      teacher: '/teacher',
      student: '/student',
    };
    return <Navigate to={roleRoutes[currentUser.role]} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
