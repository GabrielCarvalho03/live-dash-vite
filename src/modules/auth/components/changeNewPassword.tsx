"use client";

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
import { Label } from "@/shared/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ErrorMessage } from "@/shared/components/erroMessage/errorMessage";
import { Loader2 } from "lucide-react";

import { useNavigate } from "react-router-dom";
import { PasswordRequirements } from "@/shared/components/passwordRequeriments/PasswordRequirements";
import { useForgotPassword } from "../hooks/useForgotPassword/useForgotPasswod";
import {
  forgotPassordSchemaInStep2,
  ForgotPasswordDataInStep2,
} from "../hooks/useForgotPassword/forgotPassordSchema";

type ChangeNewPasswordProps = {
  token: string;
};

export const ChangeNewPassword = ({ token }: ChangeNewPasswordProps) => {
  const { handleChangePassword, forgotPasswordIsLoading } = useForgotPassword();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ForgotPasswordDataInStep2>({
    mode: "all",
    resolver: zodResolver(forgotPassordSchemaInStep2),
  });
  const navigate = useNavigate();

  const password = watch("password");
  console.log("erros in forgotPassword", errors);

  return (
    <div className="bg-muted flex items-center justify-center min-h-screen">
      <div className=" flex items-center justify-center px-4 py-12 md:py-0 md:w-1/2">
        <Card className="w-full max-w-md shadow-lg border-none bg-white">
          <form
            onSubmit={handleSubmit((data) =>
              handleChangePassword({ data, token, navigate })
            )}
          >
            <CardHeader>
              <CardTitle className="text-2xl font-bold">
                Atualizar sua senha
              </CardTitle>
              <CardDescription>
                Atualize sua senha para acessar o sistema.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="password">Nova senha</Label>

                  <Input
                    {...register("password")}
                    id="password"
                    type="password"
                    placeholder="********"
                    required
                  />
                  {password && <PasswordRequirements password={password} />}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="Confirmpassword">Confirmar nova senha</Label>
                  <Input
                    {...register("confirmPassword")}
                    id="Confirmpassword"
                    type="password"
                    placeholder="********"
                    required
                  />
                  <ErrorMessage error={errors.confirmPassword?.message} />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-2">
              <Button
                disabled={forgotPasswordIsLoading}
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                {forgotPasswordIsLoading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Atualizar"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};
