import { api } from "@/lib/axios";
import { useLogin } from "@/modules/auth/hooks/useLoginHook/useLogin";
import { toast } from "sonner";
import { create } from "zustand";

type updateFusoType = {
  userId: string;
  fuso: string;
};

interface UseProfilleProps {
  loadingUserUpdate: boolean;
  setLoadingUserUpdate: (value: boolean) => void;
  updateFusoUser: ({ userId, fuso }: updateFusoType) => Promise<void>;
}

export const useProfille = create<UseProfilleProps>((set) => ({
  loadingUserUpdate: false,
  setLoadingUserUpdate: (loadingUserUpdate) => set({ loadingUserUpdate }),
  updateFusoUser: async ({ userId, fuso }) => {
    const { user, setUser } = useLogin.getState();

    if (user) {
      setUser({
        ...user,
        hourFuse: fuso,
      });
    }
    try {
      await api.put(`/users/edit/${user?._id}`, {
        hourFuso: fuso,
      });

      if (user) {
        setUser({
          ...user,
          hourFuse: fuso,
        });
      }

      toast.success("Fuso atualizado com sucesso", {});
    } catch (error: any) {
      toast.error("Erro ao atualizar", {
        description: `${error.response.data.error}`,
      });
      if (user) {
        setUser({
          ...user,
        });
      }
    } finally {
    }
  },
}));
