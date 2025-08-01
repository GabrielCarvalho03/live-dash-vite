import { useAuthStore } from "@/shared/hooks/Auth/useAuth";
import { Navigate, Outlet } from "react-router-dom";

export function PrivateRoutes() {
  const { isAuthenticated } = useAuthStore();

  return <Outlet />;
}
