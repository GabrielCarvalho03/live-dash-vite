import { create } from "zustand";
import { LoginType, user } from "./types";
import { api } from "@/lib/axios";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useDashboard } from "@/modules/dashboard/hooks/useDashboard";
import { useAuthStore } from "@/shared/hooks/Auth/useAuth";
import { GetTokenUser } from "@/shared/utils/getTokenUser";

export const useLogin = create<LoginType>((set) => ({
  loginisLoading: false,
  setLoginisLoading: (loginisLoading: boolean) => set({ loginisLoading }),

  user: null,
  setUser: (user: user | null) => set({ user }),
  handleGetUser: async (data, navigate) => {
    const { setToken, setRefreshToken } = useAuthStore.getState();
    const { setLoginisLoading, setUser } = useLogin.getState();
    const { SetChangePasswordFristAcessModal } = useDashboard.getState();
    const MAX_ATTEMPTS = 5;
    const LOCK_MINUTES = 10;

    const lockUntil = localStorage.getItem("lock_until");
    if (lockUntil && Date.now() < Number(lockUntil)) {
      const remaining = Math.ceil((Number(lockUntil) - Date.now()) / 1000);
      toast.error("Você está temporariamente bloqueado", {
        description: `Tente novamente em ${Math.floor(remaining / 60)}:${String(
          remaining % 60
        ).padStart(2, "0")}`,
      });
      return;
    }

    try {
      setLoginisLoading(true);
      const result = await api.post("/users/singIn", data, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });
      const user = result.data.user;
      const token = result.data.token;

      localStorage.setItem("liveToken", result.data.token);
      localStorage.setItem("liveRefreshToken", result.data.refreshToken);
      setToken(token);
      setRefreshToken(result.data.refreshToken);
      setUser(user);

      localStorage.removeItem("attempts");
      localStorage.removeItem("lock_until");

      if (user.firstLogin == true) {
        SetChangePasswordFristAcessModal(true);
      } else if (user.firstLogin == false) {
        SetChangePasswordFristAcessModal(false);
      }

      toast.success("Login realizado com sucesso", {
        description: "Redirecionando para dashboard",
      });

      await new Promise((resolve) => setTimeout(resolve, 1000));
      navigate("/dashboard");
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || "Erro desconhecido";

      // Conta tentativa SOMENTE se o erro for da senha
      if (errorMsg === "Usuário não encontrado, verifique sua senha") {
        const currentAttempts =
          Number(localStorage.getItem("attempts") || "0") + 1;

        if (currentAttempts >= MAX_ATTEMPTS) {
          const lockUntil = Date.now() + LOCK_MINUTES * 60 * 1000;
          localStorage.setItem("lock_until", lockUntil.toString());
          localStorage.setItem("attempts", "0");
          toast.error("Você foi bloqueado por muitas tentativas", {
            description: `Tente novamente em ${LOCK_MINUTES} minutos.`,
          });
        } else {
          localStorage.setItem("attempts", currentAttempts.toString());
          toast.error("Senha incorreta", {
            description: `Tentativa ${currentAttempts}/${MAX_ATTEMPTS}`,
          });
        }
      } else {
        // Não conta tentativa se o erro for de e-mail
        toast.error("Erro ao fazer login", {
          description: errorMsg,
        });
      }

      // toast.error('Erro ao fazer login', {
      //   description: error.response.data.error,
      // });
    } finally {
      setLoginisLoading(false);
    }
  },

  handleGetUserById: async () => {
    const { setUser, setLoginisLoading } = useLogin.getState();

    if (typeof window === "undefined") {
      console.log("Executando no servidor, pulando verificação de token");
      return;
    }

    const token = localStorage.getItem("liveToken");

    if (!token) {
      console.log("Token não encontrado");
      return;
    }

    const decoded = jwtDecode(token) as any;

    try {
      setLoginisLoading(true);

      const result = await api.get(`/users/${decoded.id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      });

      const user = result.data.data;

      return user;
    } catch (error: any) {
      console.error("Erro na requisição da API:", error);

      const errorMessage = error?.response?.data?.error || "Erro desconhecido";

      toast.error("Erro ao buscar usuário", {
        description: errorMessage,
      });
    } finally {
      setLoginisLoading(false);
    }
  },

  logout: async (route) => {
    const { setUser, user } = useLogin.getState();
    const token = GetTokenUser();
    try {
      await api.put(
        `/users/edit/${user?._id}`,
        {
          createdAt: new Date(),
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );
    } catch (error: any) {
      toast.error("Erro ao fazer logout", {
        description: error.response.data.error,
      });
    }

    Cookies.remove("liveToken", { path: "/", secure: true, sameSite: "None" });
    localStorage.removeItem("liveToken");
    setUser(null);
    window.location.href = "/";
  },
  getRandomColor() {
    return "#" + Math.floor(Math.random() * 16777215).toString(16);
  },
}));
