import { GetTokenUser } from "@/shared/utils/getTokenUser";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import dayjs from "dayjs";
import { useAuthStore } from "@/shared/hooks/Auth/useAuth";

const baseURL = import.meta.env.VITE_LIVE_API_URL;

export const LiveApi = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
let isRefreshing = false;
let waiters: ((token: string) => void)[] = [];

LiveApi.interceptors.request.use(async (req) => {
  const token = GetTokenUser();
  const refreshToken = localStorage.getItem("liveRefreshToken");
  const isPublicRoute = ["/", "/login", "/signup"].includes(
    window.location.pathname
  );

  if (isPublicRoute) return req;

  let decodeToken: any = null;
  try {
    if (token) {
      decodeToken = jwtDecode(token);
    }
  } catch {
    console.log("Erro ao decodificar o token");
  }

  const tokenIsExpired = dayjs.unix(decodeToken.exp).diff(dayjs()) < 300;

  console.log("Token expirado:", tokenIsExpired);
  console.log("Tempo restante:", dayjs.unix(decodeToken.exp).diff(dayjs()));

  if (tokenIsExpired && refreshToken) {
    if (isRefreshing) {
      // Espera outro refresh terminar
      await new Promise((resolve) => {
        waiters.push((newToken) => {
          req.headers.Authorization = `${newToken}`;
          resolve(null);
        });
      });
    } else {
      isRefreshing = true;
      try {
        const response = await axios.post(`${baseURL}/users/refresh-token`, {
          tokenId: refreshToken,
        });

        const newToken = response.data.token;
        const newRefreshToken = response.data.refreshToken;

        const { setToken, setRefreshToken } = useAuthStore.getState();
        localStorage.setItem("liveToken", newToken);
        localStorage.setItem("liveRefreshToken", newRefreshToken);
        setToken(newToken);
        setRefreshToken(newRefreshToken);

        req.headers.Authorization = `${newToken}`;

        waiters.forEach((w) => w(newToken));
        waiters = [];
      } catch (err: any) {
        console.error("Erro ao renovar token:", err);
        // Só fazer logout se for erro de autenticação específico
        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.clear();
          window.location.href = "/";
        }
        throw err;
      } finally {
        isRefreshing = false;
      }
    }
  } else if (token && !tokenIsExpired) {
    req.headers.Authorization = `${token}`;
  }

  return req;
});
