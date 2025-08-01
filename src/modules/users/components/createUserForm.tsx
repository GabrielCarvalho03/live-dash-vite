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
import { generatePassword } from "@/shared/utils/generatePssword";
import { useEffect, useRef } from "react";
import { useLogin } from "@/modules/auth/hooks/useLoginHook/useLogin";

type CreateUserFormProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const CreateUserForm = ({ isOpen, onClose }: CreateUserFormProps) => {
  const { saveUserisLoading, handleSaveUser, setCreateUserModalOpen } =
    useUser();
  const { user } = useLogin();

  const {
    handleSubmit,
    register,
    setValue,
    control,
    formState: { errors },
  } = useForm<UseCreateDataSchema>({
    mode: "all",
    resolver: zodResolver(UsersCreateSchema),
    defaultValues: {
      permitions: ["CreateLive"],
    },
  });

  useEffect(() => {
    if (isOpen) {
      setValue("password", generatePassword());
    }
  }, [isOpen, setValue]);
  console.log("errors", errors);

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 -inset-y-10 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <Card className="w-8/12 shadow-lg border-none bg-white z-10 ">
        <form onSubmit={handleSubmit((data) => handleSaveUser(data))}>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Cadastrar usuário
            </CardTitle>
            <CardDescription>
              Preencha os campos abaixo para cadastrar um novo usuário.
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
                <div className="grid gap-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    {...register("password")}
                    disabled
                    id="password"
                    type="text"
                    placeholder="********"
                    required
                  />
                </div>
              </section>
              <section className="w-full flex flex-col gap-3">
                <div className="grid gap-2">
                  <Controller
                    control={control}
                    name="userType"
                    render={({ field }) => {
                      const isAdmin = user?.userType === "Admin";

                      const handleChange = (val: string) => {
                        if (isAdmin) {
                          field.onChange(val);
                        }
                      };
                      if (!isAdmin && field.value !== "User") {
                        field.onChange("User");
                      }

                      return (
                        <>
                          <Label htmlFor="Confirmpassword">
                            Tipo de usuário
                          </Label>

                          <Select
                            disabled={user?.userType !== "Admin"}
                            value={!isAdmin ? "User" : field.value || ""}
                            onValueChange={handleChange}
                            defaultValue="User"
                          >
                            <SelectTrigger className="">
                              <SelectValue placeholder="Tipo de usuário" />
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
              </section>
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button
              disabled={saveUserisLoading}
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {saveUserisLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Criar"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};
