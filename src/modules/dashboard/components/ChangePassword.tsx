import {
  ChangePessowrDataSchema,
  ChangePessowrdSchema,
} from "../hooks/ChangePasswordSchema";
import { PasswordRequirements } from "@/shared/components/passwordRequeriments/PasswordRequirements";
import { useDashboard } from "../hooks/useDashboard";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
import { Input } from "@/shared/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { Loader2, UserPen } from "lucide-react";

type CreateUserFormProps = {
  isOpen: boolean;
};

export const ChangePasswordModal = ({ isOpen }: CreateUserFormProps) => {
  const { changePasswordIsLoading, handleChangePasswordFirstAcess } =
    useDashboard();

  const {
    handleSubmit,
    register,
    watch,
    formState: { errors },
  } = useForm<ChangePessowrDataSchema>({
    mode: "all",
    resolver: zodResolver(ChangePessowrdSchema),
  });

  const password = watch("password");

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 -inset-y-10 bg-black/60 backdrop-blur-sm" />

      <Card className="w-[400px]  shadow-lg border-none bg-white z-10 ">
        <form
          onSubmit={handleSubmit((data) =>
            handleChangePasswordFirstAcess({
              data,
            })
          )}
        >
          <CardHeader>
            <CardTitle className="text-xl font-normal flex items-center justify-center">
              <UserPen width={25} height={25} className="pr-2" />
              Trocar senha
            </CardTitle>
            <CardDescription>
              troque a senha inicial para manter sua privacidade
            </CardDescription>
          </CardHeader>
          <CardContent className="">
            <div className="flex gap-10">
              <section className="w-full flex flex-col gap-3">
                <div className="grid gap-2">
                  <Label htmlFor="password">Nova senha</Label>
                  <Input
                    {...register("password")}
                    id="password"
                    type="text"
                    placeholder="********"
                    required
                  />

                  {password && <PasswordRequirements password={password} />}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="password">Confirmar nova senha</Label>
                  <Input
                    {...register("confirmPassword")}
                    id="password"
                    type="text"
                    placeholder="********"
                    required
                  />

                  <ErrorMessage error={errors.confirmPassword?.message} />
                </div>
              </section>
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button
              disabled={changePasswordIsLoading}
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {changePasswordIsLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Alterar senha"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};
