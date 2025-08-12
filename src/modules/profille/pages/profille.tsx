import { useLogin } from "@/modules/auth/hooks/useLoginHook/useLogin";
import { ImageUploadField } from "@/modules/live/components/createLiveSteps/live/previewImage";
import {
  LiveCreateSchema,
  LiveCreateSchemaData,
} from "@/modules/live/hooks/liveCreateSchema";
import { ErrorMessage } from "@/shared/components/erroMessage/errorMessage";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import {
  updateUserSchema,
  updateUserSchemaData,
} from "../hooks/updateUserSchema";
import { useEffect } from "react";
import { Button } from "@/shared/components/ui/button";
import { useProfille } from "../hooks/useProfille";

export const Profille = () => {
  const { user, setUser, handleGetUserById } = useLogin();
  const { handleUpdateUser } = useProfille();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<updateUserSchemaData>({
    mode: "all",
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      avatar: user?.avatar ? user?.avatar : "",
    },
  });

  useEffect(() => {
    if (!user?._id) {
      GetDataForPage();
    }
  }, []);

  const GetDataForPage = async () => {
    const user = await handleGetUserById();
    setUser(user);
  };

  return (
    <div className="w-full h-screen space-y-6 ">
      <main className=" ">
        <form
          onSubmit={handleSubmit((data) => handleUpdateUser(data))}
          className=""
        >
          <div>
            <h2 className="text-2xl font-semibold">Perfil</h2>
            <p className="text-muted-foreground text-sm">
              Gerencia suas informações.
            </p>
          </div>

          <section className="w-full ">
            <div className="w-full flex flex-col items-center mt-10">
              <Controller
                control={control}
                name="avatar"
                render={({ field }) => <ImageUploadField {...field} />}
              />

              <ErrorMessage error={errors.avatar?.message} />

              <Button type="submit">Atualizar</Button>
            </div>
          </section>
        </form>
      </main>
    </div>
  );
};
