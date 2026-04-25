import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

export default function ProtectedRoute({ children, allowedRole }) {
  const { user } = useAuthStore();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    // Redirect to their respective dashboard if they try to access the wrong one
    return <Navigate to={user.role === 'merchant' ? '/merchant' : '/reviewer'} replace />;
  }

  return children;
}
