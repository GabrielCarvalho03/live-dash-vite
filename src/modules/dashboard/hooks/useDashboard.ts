import { create } from "zustand";
import { useDashboardProps } from "./types";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import { useLogin } from "@/modules/auth/hooks/useLoginHook/useLogin";
import { GetTokenUser } from "@/shared/utils/getTokenUser";
import { LiveApi } from "@/lib/api/liveApi";
import { useLive } from "@/modules/live/hooks/useLive";

export const useDashboard = create<useDashboardProps>((set) => ({
  changePasswordIsLoading: false,
  setChangePasswordIsLoading: (changePasswordIsLoading: boolean) =>
    set({ changePasswordIsLoading }),

  ChangePasswordFristAcessModal: false,
  SetChangePasswordFristAcessModal: (ChangePasswordFristAcessModal: boolean) =>
    set({ ChangePasswordFristAcessModal }),

  handleChangePasswordFirstAcess: async ({ data }) => {
    const { setChangePasswordIsLoading, SetChangePasswordFristAcessModal } =
      useDashboard.getState();
    const { user } = useLogin.getState();

    try {
      setChangePasswordIsLoading(true);
      const token = GetTokenUser();

      const adapterChangePassword = {
        newPassword: data.password,
      };
      await api.put(`/users/password/${user?._id}`, adapterChangePassword, {
        headers: {
          Authorization: `${token}`,
        },
      });

      const adaperUpdateUser = {
        ...user,
        firstLogin: false,
      };

      api.put(`users/edit/${user?._id}`, adaperUpdateUser, {
        headers: {
          Authorization: `${token}`,
        },
      });

      SetChangePasswordFristAcessModal(false);
      toast.success("Senha alterada com sucesso", {
        description: "Sua senha foi alterada e você já pode acessar o sistema",
      });

      console.log("enviou");
    } catch (error: any) {
      toast.error("Erro ao enviar o email", {
        description: error?.response?.data?.error,
      });
    } finally {
      setChangePasswordIsLoading(false);
    }
  },

  openDeleteLiveModal: false,
  setOpenDeleteLiveModal: (value) => set({ openDeleteLiveModal: value }),
  deleteLiveISLoading: false,
  setDeleteLiveISLoading: (value) => set({ deleteLiveISLoading: value }),
  handleDeleteLive: async ({ id, setActualLive }) => {
    const { setOpenDeleteLiveModal, setDeleteLiveISLoading } =
      useDashboard.getState();
    const { handleGetLiveByUser, setLiveList, setLiveListFilter } =
      useLive.getState();
    const { liveList } = useLive.getState();
    const token = GetTokenUser();
    try {
      setDeleteLiveISLoading(true);
      toast.loading("Encerrando live", {
        id: "TerminateLive",
      });

      const actualLive = liveList?.find((item) => item.steamID === id);

      await LiveApi.delete("/live/livepeer-terminate", {
        data: {
          liveId: id,
        },
      });

      await LiveApi.put(
        `/live/finished/${actualLive?._id}`,
        {},
        {
          headers: {
            Authorization: token,
          },
        }
      );
      const actualLiveIsFinished = liveList.map((item) =>
        item.steamID === id ? { ...item, status: "finished" } : item
      );
      setLiveList(actualLiveIsFinished);
      setLiveListFilter(actualLiveIsFinished);

      const liveListNow = actualLiveIsFinished?.filter(
        (item) => item.status === "live"
      );

      setActualLive(liveListNow[0]);
      toast.success("Live encerrada com sucesso!", {
        description: "A live foi encerrada, confira na aba de lives.",
      });
    } catch (error: any) {
      toast.error("Erro ao deletar", {
        description: error?.response?.data?.error,
      });
    } finally {
      setDeleteLiveISLoading(false);
      setOpenDeleteLiveModal(false);
      toast.dismiss("TerminateLive");
    }
  },
}));
