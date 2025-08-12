import { create } from "zustand";
import { useProfilleProps } from "./types";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import { useLogin } from "@/modules/auth/hooks/useLoginHook/useLogin";

export const useProfille = create<useProfilleProps>((set) => ({
  handleUpdateUser: async (data) => {
    const { user } = useLogin.getState();
    try {
      toast.loading("atualizando usuário", {
        id: "updateUser",
      });

      const response = await api.put(`/users/edit/${user?._id}`, {
        avatar: data.avatar,
      });
      toast.success("Usuário atualizado!", {
        description: "O usuário foi atualizado com sucesso.",
      });
    } catch (error: any) {
      toast.error("Erro ao atualizar usuário", {
        description: `${error.response.data.error}`,
      });
    } finally {
      toast.dismiss("updateUser");
    }
  },
}));
