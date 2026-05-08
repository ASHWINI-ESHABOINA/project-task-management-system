import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function ProtectedRoute({ redirectTo = "/login" }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <div className="mx-auto max-w-6xl px-6 py-16 text-sm text-slate-300">
          Loading...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to={redirectTo} replace />;

  return <Outlet />;
}

