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
import { useForgotPassword } from "../hooks/useForgotPassword/useForgotPasswod";
import { forgotPassordSchemaInStep1 } from "../hooks/useForgotPassword/forgotPassordSchema";

export const SendEmailWithToken = () => {
  const { forgotPasswordIsLoading, handleSendEmailWithToken } =
    useForgotPassword();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "all",
    resolver: zodResolver(forgotPassordSchemaInStep1),
  });

  return (
    <div className=" bg-muted flex items-center justify-center min-h-screen">
      <div className=" flex items-center justify-center px-4 py-12 md:py-0 md:w-1/2">
        <Card className="w-full max-w-md shadow-lg border-none bg-white">
          <form
            onSubmit={handleSubmit((data) => handleSendEmailWithToken(data))}
          >
            <CardHeader>
              <CardTitle className="text-2xl font-bold">
                Enviar E-mail
              </CardTitle>
              <CardDescription>
                Insira seu email para receber um link de recuperação.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="emailWithToken">Email</Label>

                  <Input
                    {...register("email")}
                    id="emailWithToken"
                    type="text"
                    placeholder="Digite seu email"
                    required
                  />
                  <ErrorMessage error={errors.email?.message} />
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
                  "Enviar E-mail"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};
