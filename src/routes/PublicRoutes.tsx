import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/shared/hooks/Auth/useAuth";

export function PublicRoutes() {
  const { isAuthenticated } = useAuthStore();

  return !isAuthenticated ? <Outlet /> : <Navigate to="/dashboard" replace />;
}
