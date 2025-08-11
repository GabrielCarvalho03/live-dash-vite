import { GetTokenUser } from "@/shared/utils/getTokenUser";
import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosError,
  RawAxiosRequestHeaders,
  AxiosHeaders,
} from "axios";
import { jwtDecode } from "jwt-decode";
import dayjs from "dayjs";
import { useAuthStore } from "@/shared/hooks/Auth/useAuth";

interface AuthInterceptorConfig {
  baseURL: string;
  publicRoutes?: string[];
  tokenExpirationMargin?: number;
}

export function AuthInterceptorAxios(
  axiosInstance: AxiosInstance,
  config: AuthInterceptorConfig
) {
  let isRefreshing = false;
  let waiters: ((token: string) => void)[] = [];

  const {
    baseURL,
    publicRoutes = ["/", "/login", "/signup"],
    tokenExpirationMargin = 300,
  } = config;

  // Helper para definir Authorization respeitando Axios v1
  const setAuthorizationHeader = (
    headers: InternalAxiosRequestConfig["headers"] | RawAxiosRequestHeaders
  ) => {
    const accessToken = GetTokenUser();
    if (!accessToken) return;
    const value = `Bearer ${accessToken}`;
    // AxiosHeaders possui método set
    if (headers && typeof (headers as AxiosHeaders).set === "function") {
      (headers as AxiosHeaders).set("Authorization", value);
    } else {
      // fallback para objetos simples
      (headers as any)["Authorization"] = value;
    }
  };

  // Função de refresh com fila/lock
  const refreshAccessToken = async (): Promise<string> => {
    const storedRefreshToken = localStorage.getItem("liveRefreshToken");
    if (!storedRefreshToken) {
      throw new Error("Refresh token ausente");
    }

    if (isRefreshing) {
      return new Promise<string>((resolve) => {
        waiters.push((newToken) => resolve(newToken));
      });
    }

    isRefreshing = true;
    try {
      const response = await axios.post(`${baseURL}/users/refresh-token`, {
        tokenId: storedRefreshToken,
      });

      const newToken: string = response.data.token;
      const newRefreshToken: string = response.data.refreshToken;

      const { setToken, setRefreshToken } = useAuthStore.getState();
      localStorage.setItem("liveToken", newToken);
      localStorage.setItem("liveRefreshToken", newRefreshToken);
      setToken(newToken);
      setRefreshToken(newRefreshToken);

      // Libera fila
      waiters.forEach((w) => w(newToken));
      waiters = [];
      return newToken;
    } catch (err: any) {
      console.error("Erro ao renovar token:", err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.clear();
        window.location.href = "/";
      }
      throw err;
    } finally {
      isRefreshing = false;
    }
  };

  // Interceptor de request: injeta token e renova se dentro da margem
  axiosInstance.interceptors.request.use(
    async (req: InternalAxiosRequestConfig) => {
      const token = GetTokenUser();

      const isPublicRoute = publicRoutes.some((route) =>
        window.location.pathname.startsWith(route)
      );
      if (isPublicRoute) return req;

      if (!token) return req;

      let decoded: any = null;
      try {
        decoded = jwtDecode(token);
      } catch {
        return req;
      }

      const secondsLeft = dayjs.unix(decoded.exp).diff(dayjs());
      const tokenIsNearExpiry = secondsLeft < tokenExpirationMargin;

      if (tokenIsNearExpiry) {
        await refreshAccessToken();
        setAuthorizationHeader(req.headers);
      } else {
        setAuthorizationHeader(req.headers);
      }

      return req;
    }
  );

  // Interceptor de response: em 401/403 tenta 1x o refresh e refaz a request
  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const status = error.response?.status;
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };

      if (
        (status === 401 || status === 403) &&
        originalRequest &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true;
        try {
          await refreshAccessToken();
          setAuthorizationHeader(originalRequest.headers);
          return axiosInstance.request(originalRequest);
        } catch (err) {
          return Promise.reject(err);
        }
      }

      return Promise.reject(error);
    }
  );

  return axiosInstance;
}
