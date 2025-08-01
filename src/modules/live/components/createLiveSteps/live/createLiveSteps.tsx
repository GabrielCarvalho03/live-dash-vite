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

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { generatePassword } from "@/shared/utils/generatePssword";
import { useEffect, useRef } from "react";

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/shared/components/ui/tabs";
import { useUser } from "../../../../users/hooks/useUser";
import {
  UseCreateDataSchema,
  UsersCreateSchema,
} from "../../../../users/hooks/usersCreateSchema";
import { FormLiveStepCreateModal } from "./form";
import { useLogin } from "@/modules/auth/hooks/useLoginHook/useLogin";

type CreateUserFormProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const CreateLiveStepsModal = ({
  isOpen,
  onClose,
}: CreateUserFormProps) => {
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
              Cadastrar nova live
            </CardTitle>
            <CardDescription>
              Preencha os campos abaixo para cadastrar uma nova live.
            </CardDescription>
          </CardHeader>
          <CardContent className="">
            <Tabs defaultValue="live" className="w-full">
              <section className="w-full flex justify-center">
                <TabsList className="bg-transparent gap-5">
                  <TabsTrigger
                    className=" text-xl data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-blue-500 rounded-none"
                    value="live"
                  >
                    Cadastro de live
                  </TabsTrigger>
                  <TabsTrigger
                    className="text-xl   data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-blue-500 rounded-none"
                    value="products"
                  >
                    Vincular produtos
                  </TabsTrigger>
                </TabsList>
              </section>
              <TabsContent value="live">
                <FormLiveStepCreateModal />
              </TabsContent>
              <TabsContent value="products">
                <p>Alterar senha aqui.</p>
              </TabsContent>
            </Tabs>
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
