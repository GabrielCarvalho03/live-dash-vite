"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { CircleCheck } from "lucide-react";

export const SuceessSendEmail = () => {
  return (
    <div className="bg-muted flex items-center justify-center min-h-screen">
      <div className=" flex items-center justify-center px-4 py-12 md:py-0 md:w-1/2">
        <Card className="w-full max-w-md shadow-lg border-none bg-white">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Email enviado com sucesso!
            </CardTitle>
            <CardDescription>
              Verifique sua caixa de email para Atualizar sua senha.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center gap-6">
              <CircleCheck width={100} height={100} color="#6bff97" />
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <span className="text-gray-500">
              {" "}
              Verifique a caixa de spam se necessario.
            </span>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
