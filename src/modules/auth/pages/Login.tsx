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
import { useLogin } from "../hooks/useLoginHook/useLogin";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  LoginDataSchema,
  LoginSchema,
} from "../hooks/useLoginHook/LoginSchema";
import { ErrorMessage } from "@/shared/components/erroMessage/errorMessage";
import { Loader2 } from "lucide-react";
import LiveLoginLogo from "@/assets/svg/live.svg";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginDataSchema>({
    mode: "all",
    resolver: zodResolver(LoginSchema),
  });
  const { loginisLoading, handleGetUser } = useLogin();
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <div className="bg-muted flex items-center justify-center px-4 py-12 md:py-0 md:w-1/2">
        <Card className="w-full max-w-md shadow-lg border-none bg-white">
          <form
            onSubmit={handleSubmit((data) => handleGetUser(data, navigate))}
          >
            <CardHeader>
              <CardTitle className="text-2xl font-bold">
                Bem-vindo de volta
              </CardTitle>
              <CardDescription>
                Acesse sua conta usando seu e-mail e senha cadastrados.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-6">
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
                  <div className="flex items-center">
                    <Label htmlFor="password">Senha</Label>
                    <a
                      onClick={() => navigate("/forgotPassword")}
                      className="ml-auto text-sm text-blue-600 hover:underline"
                    >
                      Esqueceu a senha?
                    </a>
                  </div>
                  <Input
                    {...register("password")}
                    id="password"
                    type="password"
                    placeholder="********"
                    required
                  />
                  <ErrorMessage error={errors.password?.message} />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-2">
              <Button
                disabled={loginisLoading}
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                {loginisLoading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Entrar"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>

      <div className="relative bg-blue-600 text-white flex items-center justify-center px-8 py-12 md:w-1/2 text-center">
        <div className="max-w-md mx-auto">
          <img
            src={LiveLoginLogo}
            alt="Ilustração de login"
            width={300}
            height={300}
            className="mx-auto mb-6"
          />

          <h2 className="text-3xl font-bold mb-2">
            Transmissão ao vivo com qualidade
          </h2>
          <p className="text-lg text-white/80">
            Acesse a plataforma e acompanhe eventos em tempo real com alta
            performance e interatividade.
          </p>
        </div>
      </div>
    </div>
  );
};
