import { create } from "zustand";
import { ForgotPasswordTypes } from "./types";
import { toast } from "sonner";
import { api } from "@/lib/axios";

export const useForgotPassword = create<ForgotPasswordTypes>((set) => ({
  forgotStep: 1,
  setForgotStep: (step) => set({ forgotStep: step }),

  forgotPasswordIsLoading: false,
  setForgotPasswordIsLoading: (forgotPasswordIsLoading: boolean) =>
    set({ forgotPasswordIsLoading }),

  forgotPasswordIsSuccess: false,
  setForgotPasswordIsSuccess: (forgotPasswordIsSuccess: boolean) =>
    set({ forgotPasswordIsSuccess }),

  handleChangePassword: async ({ data, token, navigate }) => {
    const { setForgotPasswordIsLoading } = useForgotPassword.getState();

    try {
      setForgotPasswordIsLoading(true);
      const adapterChangePassword = {
        password: data.password,
        token,
      };
      const result = await api.post(
        "/users/reset-password",
        adapterChangePassword
      );

      toast.success("Senha alterada com sucesso", {
        description: "Sua senha foi alterada e você já pode fazer login",
      });

      navigate("//");

      console.log("enviou");
    } catch (error: any) {
      toast.error("Erro ao enviar o email", {
        description: error?.response?.data?.error,
      });
    } finally {
      setForgotPasswordIsLoading(false);
    }
  },
  handleSendEmailWithToken: async (data) => {
    const { setForgotPasswordIsLoading, setForgotPasswordIsSuccess } =
      useForgotPassword.getState();

    try {
      setForgotPasswordIsLoading(true);

      console.log("cheogu aqui");

      const result = await api.post("/users/forgot-password", data);

      toast.success("Email enviado com sucesso", {
        description: result.data.message,
      });

      setForgotPasswordIsSuccess(true);
    } catch (error: any) {
      console.log("error ao criar login", error);
      toast.error("Erro ao enviar o email", {
        description: error?.response?.data?.error,
      });
    } finally {
      setForgotPasswordIsLoading(false);
    }
  },
}));
