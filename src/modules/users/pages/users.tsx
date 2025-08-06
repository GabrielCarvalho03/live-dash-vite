import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import {
  Plus,
  User,
  Filter,
  Pencil,
  Trash,
  Mail,
  ShieldCheck,
  LogIn,
  Loader2,
  Video,
  Users as UserIcon,
  Shield,
} from "lucide-react";
import { useEffect } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { useUser } from "../hooks/useUser";
import { useLogin } from "@/modules/auth/hooks/useLoginHook/useLogin";
import { CreateUserForm } from "../components/createUserForm";
import { UpdateUserForm } from "../components/updateUserForm";
import { user } from "@/modules/auth/hooks/useLoginHook/types";
import { Loader } from "@/shared/components/loader/loader";
import { DeleteConfirmModal } from "@/shared/components/deleteConfirmModal/deleteConfirmModal";

export default function Users() {
  const {
    AllUsers,
    getAllUserIsLoading,
    createuserModalOpen,
    updateUserModalOpen,
    userIdToDelete,
    ModalDeleteUserIsOpen,
    deleteUserisLoading,
    handleOpenCreateUserModal,
    setCreateUserModalOpen,
    handleGetAllUsers,
    handleOpenDeleteUserModal,
    handleDeleteUser,
    setUserIdToDelete,
    setModalDeleteUserIsOpen,
    setUpdateUserModalOpen,
    setUpdateUserObject,
    handleOpenUpdateUserModal,
  } = useUser();
  const { user, loginisLoading, setUser, handleGetUserById } = useLogin();

  useEffect(() => {
    if (!user?._id) {
      GetDataForPage();
    }
    if (!AllUsers.length) {
      handleGetAllUsers();
    }
  }, []);

  const GetDataForPage = async () => {
    const user = await handleGetUserById();
    setUser(user);
    await handleGetAllUsers();
  };

  if (getAllUserIsLoading) {
    return <Loader />;
  }

  const getPermissionIcon = (permission: string) => {
    switch (permission) {
      case "CreateLive":
        return <Video className="w-3 h-3" />;
      case "UserManeger":
        return <UserIcon className="w-3 h-3" />;
      case "Moderator":
        return <Shield className="w-3 h-3" />;
      default:
        return <ShieldCheck className="w-3 h-3" />;
    }
  };
  const translatePermission = (permission: string) => {
    switch (permission) {
      case "CreateLive":
        return "Criar lives";
      case "UserManeger":
        return "Gerente usuários ";
      case "Moderator":
        return "Moderarador";
      default:
        return "Administrador";
    }
  };

  const getPermissionDescription = (permission: string) => {
    switch (permission) {
      case "CreateLive":
        return "Pode criar transmissões ao vivo";
      case "UserManeger":
        return "Pode gerenciar usuários do sistema";
      case "Moderator":
        return "Pode moderar conteúdo e usuários";
      default:
        return "Pode realizar todas as ações no sistema";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-semibold">Usuários</h2>
          <p className="text-muted-foreground text-sm">
            Lista de usuários cadastrados.
          </p>
        </div>
        <Button
          onClick={() => handleOpenCreateUserModal()}
          className="bg-primary text-white hover:bg-primary/90"
        >
          <Plus className="w-4 h-4 mr-2" /> Novo Usuário
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-green-100">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm">Usuários Ativos</p>
                <p className="text-2xl font-bold">1</p>
              </div>
              <User className="text-green-600 w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-100">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm">Usuários Inativos</p>
                <p className="text-2xl font-bold">0</p>
              </div>
              <User className="text-blue-600 w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-red-100">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm">Usuários Suspensos</p>
                <p className="text-2xl font-bold">0</p>
              </div>
              <Trash className="text-red-600 w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-4 mt-4 flex-wrap">
        <Input
          placeholder="Buscar usuários..."
          className="flex-grow max-w-xs"
        />
        <div className="flex items-center gap-2 whitespace-nowrap">
          <Filter className="w-5 h-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Filtros:</span>
        </div>
      </div>

      <div className="border rounded-md overflow-x-auto">
        <div className="hidden md:grid grid-cols-6 bg-muted px-4 py-2 text-sm font-medium text-muted-foreground min-w-[640px]">
          <span>Usuário</span>
          <span>Contato</span>
          <span>Status</span>
          <span>Permissões</span>
          <span>Último Acesso</span>
          <span>Ações</span>
        </div>

        {AllUsers &&
          AllUsers.length > 0 &&
          AllUsers?.map((user) => (
            <div
              key={user?._id}
              className="grid grid-cols-2 md:grid-cols-6 items-start px-4 py-3 border-t text-sm min-w-[640px]"
            >
              <div className="flex items-center gap-2 col-span-2 md:col-span-1">
                <Avatar>
                  <AvatarFallback>{user?.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium truncate">{user?.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user?.userType}
                  </p>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span>{user.email}</span>
                </div>
              </div>
              <div className="hidden md:block">
                <Badge
                  className={`${
                    user.status == "Active" ? "bg-green-500" : "bg-red-500"
                  } text-white`}
                >
                  {user.status == "Active" ? "Ativo" : "Inativo"}
                </Badge>
              </div>
              <div className="hidden md:block">
                <TooltipProvider>
                  <div className="flex flex-wrap gap-1">
                    {user.permitions.map((permission, index) => (
                      <Tooltip key={index}>
                        <TooltipTrigger>
                          <Badge
                            variant="outline"
                            className={`text-xs px-2 py-1 flex items-center gap-1 cursor-help ${getPermissionIcon(
                              permission
                            )}`}
                          >
                            {getPermissionIcon(permission)}
                            {translatePermission(permission)}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{getPermissionDescription(permission)}</p>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                </TooltipProvider>
              </div>
              <div className="hidden md:block">
                <div className="flex items-center gap-2">
                  <LogIn className="w-4 h-4 text-muted-foreground" />
                  <span>{"Nunca acessou"}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    setUpdateUserObject(user);
                    handleOpenUpdateUserModal(user._id);
                  }}
                  size="icon"
                  variant="ghost"
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => {
                    setUserIdToDelete(user);
                    handleOpenDeleteUserModal();
                  }}
                  size="icon"
                  variant="ghost"
                >
                  <Trash className="w-4 h-4 text-red-600" />
                </Button>
              </div>
            </div>
          ))}
      </div>
      <CreateUserForm
        isOpen={createuserModalOpen}
        onClose={() => setCreateUserModalOpen(false)}
      />
      <UpdateUserForm
        isOpen={updateUserModalOpen}
        onClose={() => {
          setUpdateUserModalOpen(false), setUpdateUserObject({} as user);
        }}
      />
      <DeleteConfirmModal
        loading={deleteUserisLoading}
        title="Tem certeza que deseja apagar esse usuário ?"
        isOpen={ModalDeleteUserIsOpen}
        onClose={() => setModalDeleteUserIsOpen(false)}
        onDelete={() => handleDeleteUser(userIdToDelete._id)}
      />
    </div>
  );
}
