import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AppLoader from '../components/AppLoader';

export default function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <AppLoader
        title="TrripAi"
        tagline="AI Travel Planner"
        subtitle="Loading your dashboard and travel plans"
      />
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
