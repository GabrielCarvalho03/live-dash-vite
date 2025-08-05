import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/shared/hooks/Auth/useAuth";
import { useEffect, useState } from "react";
import { GetTokenUser } from "@/shared/utils/getTokenUser";

export function PublicRoutes() {
  const { token, setRefreshToken, setToken } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = GetTokenUser();
    const storedRefresh = localStorage.getItem("liveRefreshToken");

    if (storedToken && storedRefresh) {
      setToken(storedToken);
      setRefreshToken(storedRefresh);
    }

    setLoading(false);
  }, [setToken, setRefreshToken]);

  return !token ? <Outlet /> : <Navigate to="/dashboard" replace />;
}
