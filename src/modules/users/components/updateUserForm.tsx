import { ErrorMessage } from "@/shared/components/erroMessage/errorMessage";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { useUser } from "../hooks/useUser";
import { useForm, Controller } from "react-hook-form";
import {
  UseCreateDataSchema,
  UsersCreateSchema,
} from "../hooks/usersCreateSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/shared/components/ui/accordion";
import { Switch } from "@/shared/components/ui/switch";
import {
  UsersUpdateSchema,
  UserUpdateDataSchema,
} from "../hooks/usersUpdateSchema";
import { useEffect } from "react";
import { useLogin } from "@/modules/auth/hooks/useLoginHook/useLogin";

type CreateUserFormProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const UpdateUserForm = ({ isOpen, onClose }: CreateUserFormProps) => {
  const { saveUserisLoading, updateUserObject, handleUpdateUser } = useUser();
  const { user } = useLogin();
  const validPermissions = ["CreateLive", "UserManeger", "Moderator"] as const;
  type ValidPermission = (typeof validPermissions)[number];
  const {
    handleSubmit,
    register,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<UserUpdateDataSchema>({
    mode: "all",
    resolver: zodResolver(UsersUpdateSchema),
  });

  useEffect(() => {
    if (!updateUserObject) return;

    setValue("name", updateUserObject.name);
    setValue("email", updateUserObject.email);
    setValue("status", updateUserObject.status ?? "Active");
    setValue(
      "userType",
      updateUserObject.userType === "Admin" ? "Admin" : "User"
    );
    setValue(
      "permitions",
      (updateUserObject.permitions || []).filter((p) =>
        ["CreateLive", "UserManeger", "Moderator"].includes(p)
      ) as UserUpdateDataSchema["permitions"]
    );
  }, [updateUserObject, setValue]);

  console.log("erros", errors);

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 -inset-y-10 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <Card className="w-8/12 shadow-lg border-none bg-white z-10 ">
        <form onSubmit={handleSubmit((data) => handleUpdateUser(data))}>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Editar usuário</CardTitle>
            <CardDescription>
              Preencha os campos abaixo para Editar o usuário.
            </CardDescription>
          </CardHeader>
          <CardContent className="">
            <div className="flex gap-10">
              <section className="w-full flex flex-col gap-3">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    {...register("name")}
                    id="name"
                    type="text"
                    placeholder="José Silva"
                    required
                  />
                  <ErrorMessage error={errors.name?.message} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    {...register("email")}
                    id="email"
                    type="email"
                    placeholder="exemplo@email.com"
                    required
                  />
                  <ErrorMessage error={errors.email?.message} />
                </div>
              </section>
              <section className="w-full flex flex-col gap-3">
                <div className="grid gap-2">
                  <Controller
                    control={control}
                    name="userType"
                    render={({ field }) => {
                      const isAdmin = user?.userType === "Admin";

                      // Força valor 'User' se não for Admin
                      const value = field.value == "Admin" ? "Admin" : "User";

                      // Função que só muda valor se for Admin
                      const onChange = (val: string) => {
                        if (isAdmin) {
                          field.onChange(val);
                        }
                        // se não for admin, ignora mudanças
                      };

                      return (
                        <>
                          <Label htmlFor="userType">Tipo de usuário</Label>

                          <Select
                            disabled={!isAdmin}
                            value={value}
                            onValueChange={onChange}
                            defaultValue="User"
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Tipo de usuário">
                                {value === "Admin" ? "Admin" : "Comum"}
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="User">Comum</SelectItem>
                              <SelectItem value="Admin">Admin</SelectItem>
                            </SelectContent>
                          </Select>

                          <ErrorMessage error={errors.userType?.message} />
                        </>
                      );
                    }}
                  />
                </div>

                <div className="grid gap-2">
                  <Controller
                    control={control}
                    name="permitions"
                    render={({ field }) => {
                      const handleToggle = (value: string) => {
                        if (
                          field.value?.includes(
                            value as "CreateLive" | "UserManeger" | "Moderator"
                          )
                        ) {
                          field.onChange(
                            field.value.filter((v: string) => v !== value)
                          );
                        } else {
                          field.onChange([...(field.value || []), value]);
                        }
                      };

                      return (
                        <>
                          <Accordion
                            type="single"
                            collapsible
                            defaultValue="permissoes"
                          >
                            <AccordionItem value="permissoes">
                              <AccordionTrigger className="font-normal">
                                Permissões do usuário
                              </AccordionTrigger>
                              <AccordionContent>
                                <div className="flex flex-col gap-2">
                                  <div className="flex items-center gap-2">
                                    <Switch
                                      checked={field.value?.includes(
                                        "CreateLive"
                                      )}
                                      onCheckedChange={() =>
                                        handleToggle("CreateLive")
                                      }
                                    />
                                    <span>Criador de live</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Switch
                                      checked={field.value?.includes(
                                        "UserManeger"
                                      )}
                                      onCheckedChange={() =>
                                        handleToggle("UserManeger")
                                      }
                                    />
                                    <span>Gerenciador de usuários</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Switch
                                      checked={field.value?.includes(
                                        "Moderator"
                                      )}
                                      onCheckedChange={() =>
                                        handleToggle("Moderator")
                                      }
                                    />
                                    <span>Moderador</span>
                                  </div>
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                          {errors.permitions && (
                            <span className="text-red-500 text-xs">
                              {errors.permitions.message}
                            </span>
                          )}
                        </>
                      );
                    }}
                  />
                </div>

                <div className="grid gap-2">
                  <Controller
                    control={control}
                    name="status"
                    render={({ field }) => {
                      const handleToggle = () => {
                        const newValue =
                          field.value === "Active" ? "Inactive" : "Active";
                        field.onChange(newValue);
                      };

                      return (
                        <>
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between gap-2">
                              <span>Usuário ativo</span>

                              <Switch
                                checked={field.value?.includes("Active")}
                                onCheckedChange={handleToggle}
                              />
                            </div>
                          </div>
                        </>
                      );
                    }}
                  />
                </div>
              </section>
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button
              disabled={saveUserisLoading}
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-5"
            >
              {saveUserisLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Atualizar usuário"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};
