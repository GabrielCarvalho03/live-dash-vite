import { create } from "zustand";
import { RegisterType } from "./types";
import { api } from "@/lib/axios";
import { toast } from "sonner";
import { useLogin } from "@/modules/auth/hooks/useLoginHook/useLogin";
import { GetTokenUser } from "@/shared/utils/getTokenUser";
import { user } from "@/modules/auth/hooks/useLoginHook/types";
import axios from "axios";

export const useUser = create<RegisterType>((set) => ({
  createuserModalOpen: false,
  setCreateUserModalOpen: (value) => set({ createuserModalOpen: value }),

  handleOpenCreateUserModal: () => {
    const { setCreateUserModalOpen } = useUser.getState();
    const { user } = useLogin.getState();

    if (
      user?.permitions.includes("UserManeger") ||
      user?.userType === "Admin"
    ) {
      setCreateUserModalOpen(true);
      return;
    }

    toast.error("Você não tem permissão para essa ação", {
      description: "Entre em contato com o administrador",
    });
  },

  getAllUserIsLoading: false,
  setGetAllUserIsLoading: (value) => set({ getAllUserIsLoading: value }),

  AllUsers: [],
  setAllUsers: (value) => set({ AllUsers: value }),
  handleGetAllUsers: async () => {
    const { setGetAllUserIsLoading, setAllUsers } = useUser.getState();
    const token = GetTokenUser();
    setGetAllUserIsLoading(true);
    try {
      const response = await api.get("/users", {
        headers: {
          Authorization: `${token}`,
        },
      });
      console.log("resolveUSers", response.data.data);
      setAllUsers(response.data.data);
    } catch (error: any) {
      toast.error("Erro ao acessar", {
        description: error.response.data.error,
      });
    } finally {
      setGetAllUserIsLoading(false);
    }
  },

  saveUserisLoading: false,
  setSaveUserisLoading: (value) => set({ saveUserisLoading: value }),

  handleSaveUser: async (data) => {
    const { AllUsers, setAllUsers, setSaveUserisLoading } = useUser.getState();
    const adapterData = {
      name: data.name,
      email: data.email,
      password: data.password,
      avatar: "",
      userType: data.userType,
      permitions: data.permitions,
      status: "Active" as const,
      firstLogin: true,
      hourFuse: "brasilia",
    };

    try {
      const token = GetTokenUser();
      setSaveUserisLoading(true);

      const newUser = await api.post("users/create", adapterData, {
        headers: {
          Authorization: `${token}`,
        },
      });

      const newList = [
        ...AllUsers,
        {
          ...adapterData,
          _id: newUser.data._id,
          createdAt: new Date().toISOString(),
        },
      ];

      setAllUsers(newList);

      toast.success("Usuário criado com sucesso!", {
        description: `usuário ${data.name} salvo no banco de dados`,
      });

      // ✅ CORREÇÃO: Fechar o modal após sucesso
      const { setCreateUserModalOpen } = useUser.getState();
      setCreateUserModalOpen(false);
    } catch (error: any) {
      console.error("Erro ao criar usuário:", error); // ✅ Log do erro

      toast.error("Erro ao acessar", {
        description: error?.response?.data?.error || "Erro desconhecido",
      });
    } finally {
      setSaveUserisLoading(false);
    }
  },

  userIdToDelete: {} as user,
  setUserIdToDelete: (value) => set({ userIdToDelete: value }),

  ModalDeleteUserIsOpen: false,
  setModalDeleteUserIsOpen: (value) => set({ ModalDeleteUserIsOpen: value }),

  deleteUserisLoading: false,
  setDeleteUserisLoading: (value) => set({ deleteUserisLoading: value }),
  handleOpenDeleteUserModal: () => {
    const { setModalDeleteUserIsOpen, userIdToDelete } = useUser.getState();
    const { user } = useLogin.getState();

    if (user?._id === userIdToDelete._id) {
      toast.error("Erro ao deletar", {
        description: "Não é possivel deletar o email que está em uso!",
      });
      return;
    }

    if (userIdToDelete.userType === "Admin" && user?.userType !== "Admin") {
      toast.error("Erro ao deletar", {
        description:
          "Você não tem permissão para deletar o email de um administrador!",
      });
      return;
    }

    if (
      user?.permitions.includes("UserManeger") ||
      user?.userType === "Admin"
    ) {
      setModalDeleteUserIsOpen(true);
      return;
    }

    toast.error("Você não tem permissão para essa ação", {
      description: "Entre em contato com o administrador",
    });
  },

  handleDeleteUser: async (id: string) => {
    const {
      AllUsers,
      setAllUsers,
      setDeleteUserisLoading,
      setUserIdToDelete,
      setModalDeleteUserIsOpen,
    } = useUser.getState();
    setDeleteUserisLoading(true);
    try {
      const token = GetTokenUser();
      await api.delete(`/users/${id}`, {
        headers: {
          Authorization: `${token}`,
        },
      });
      const userToDelete = AllUsers.find((user) => user._id === id);
      const newList = AllUsers.filter((user) => user._id !== id);

      setAllUsers(newList);
      setUserIdToDelete({} as user);
      setModalDeleteUserIsOpen(false);
      toast.success("Usuário deletado com sucesso!", {
        description: `usuário ${userToDelete?.name} deletado com sucesso`,
      });
    } catch (error: any) {
      toast.error("Erro ao acessar", {
        description: error.response.data.error,
      });
    } finally {
      setDeleteUserisLoading(false);
    }
  },

  updateUserObject: {} as user,
  setUpdateUserObject: (value) => set({ updateUserObject: value }),

  updateUserModalOpen: false,
  setUpdateUserModalOpen: (value) => set({ updateUserModalOpen: value }),

  handleOpenUpdateUserModal: (id: string) => {
    const { user } = useLogin.getState();
    const { setUpdateUserModalOpen } = useUser.getState();
    if (
      user?.permitions.includes("UserManeger") ||
      user?.userType === "Admin"
    ) {
      setTimeout(() => {
        setUpdateUserModalOpen(true);
      }, 100);
      return;
    }

    toast.error("Você não tem permissão para essa ação", {
      description: "Entre em contato com o administrador",
    });
  },

  handleUpdateUser: async (data) => {
    const {
      AllUsers,
      updateUserObject,
      setAllUsers,
      setUpdateUserModalOpen,
      setUpdateUserObject,
    } = useUser.getState();

    const adapterData = {
      name: data.name,
      email: data.email,
      avatar: "",
      userType: data.userType,
      permitions: data.permitions,
      status: data.status,
    };

    try {
      const token = GetTokenUser();
      await api.put(`/users/edit/${updateUserObject._id}`, adapterData, {
        headers: {
          Authorization: `${token}`,
        },
      });
      const userToUpdate = AllUsers.find(
        (user) => user._id === updateUserObject._id
      );
      const newList = AllUsers.map((user) => {
        if (user._id === updateUserObject._id) {
          return {
            ...user,
            ...adapterData,
          };
        }
        return user;
      });
      setAllUsers(newList);

      toast.success("Usuário atualizado com sucesso!", {
        description: `usuário ${userToUpdate?.name} atualizado com sucesso`,
      });
      setUpdateUserModalOpen(false);
      setUpdateUserObject({} as user);
    } catch (error: any) {
      toast.error("Erro ao acessar", {
        description: error.response.data.error,
      });
    } finally {
      setUpdateUserModalOpen(false);
      setUpdateUserObject({} as user);
    }
  },

  userVinculateLive: {} as user,
  setUserVinculateLive: (value) => set({ userVinculateLive: value }),
  getUSerVinculateLive: async (actualLive) => {
    const { setUserVinculateLive } = useUser.getState();
    try {
      const token = GetTokenUser();
      const userVinculateLive = await api.get(
        `/users/${actualLive?.userId ?? "64dbe7f2c2a4b8e1a1b2c3d4"}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        }
      );
      console.log("userVinculateLive", userVinculateLive);
      if (userVinculateLive) {
        setUserVinculateLive(userVinculateLive.data.data);
        return userVinculateLive.data.data;
      }
    } catch (error: any) {
      toast.error("Erro ao buscar usuário vinculado a live", {
        description: error.response.data.error,
      });
    }
  },
}));
