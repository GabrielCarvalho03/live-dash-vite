import { user } from "@/modules/auth/hooks/useLoginHook/types";
import { UseCreateDataSchema } from "./usersCreateSchema";
import { UserUpdateDataSchema } from "./usersUpdateSchema";

export interface RegisterType {
  saveUserisLoading: boolean;
  setSaveUserisLoading: (value: boolean) => void;
  handleSaveUser: (data: UseCreateDataSchema) => Promise<void>;

  getAllUserIsLoading: boolean;
  setGetAllUserIsLoading: (value: boolean) => void;

  AllUsers: user[];
  setAllUsers: (value: user[]) => void;
  handleGetAllUsers: () => Promise<void>;

  createuserModalOpen: boolean;
  setCreateUserModalOpen: (value: boolean) => void;
  handleOpenCreateUserModal: () => void;

  userIdToDelete: user;
  setUserIdToDelete: (value: user) => void;

  ModalDeleteUserIsOpen: boolean;
  setModalDeleteUserIsOpen: (value: boolean) => void;
  handleOpenDeleteUserModal: () => void;

  deleteUserisLoading: boolean;
  setDeleteUserisLoading: (value: boolean) => void;
  handleDeleteUser: (id: string) => Promise<void>;

  updateUserObject: user;
  setUpdateUserObject: (value: user) => void;

  updateUserModalOpen: boolean;
  setUpdateUserModalOpen: (value: boolean) => void;

  handleOpenUpdateUserModal: (id: string) => void;
  handleUpdateUser: (data: UserUpdateDataSchema) => Promise<void>;
}
