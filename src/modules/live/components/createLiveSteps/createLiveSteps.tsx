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
import { useUser } from "../../../users/hooks/useUser";
import {
  UseCreateDataSchema,
  UsersCreateSchema,
} from "../../../users/hooks/usersCreateSchema";
import { FormLiveStepCreateModal } from "./live/form";
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

      <Card
        className="w-4/12 max-h-[800px] min-h-[600px] relative overflow-y-auto shadow-lg border-none bg-white z-10  "
        style={{ scrollbarGutter: "stable" }}
      >
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center">
            Cadastrar nova live
          </CardTitle>
          <CardDescription className="text-center">
            Preencha os campos abaixo para cadastrar uma nova live.
          </CardDescription>
        </CardHeader>
        <CardContent className="">
          <FormLiveStepCreateModal />
        </CardContent>
      </Card>
    </div>
  );
};
