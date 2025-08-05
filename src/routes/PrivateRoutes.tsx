import { useAuthStore } from "@/shared/hooks/Auth/useAuth";
import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { GetTokenUser } from "@/shared/utils/getTokenUser";

export function PrivateRoutes() {
  const { token, setToken, setRefreshToken } = useAuthStore();
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

  if (loading) return null;

  return token ? <Outlet /> : <Navigate to="/" replace />;
}
