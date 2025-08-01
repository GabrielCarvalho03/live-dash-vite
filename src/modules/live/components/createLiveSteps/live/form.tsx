import { ErrorMessage } from "@/shared/components/erroMessage/errorMessage";
import { Button } from "@/shared/components/ui/button";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUser } from "../../../../users/hooks/useUser";
import {
  UseCreateDataSchema,
  UsersCreateSchema,
} from "../../../../users/hooks/usersCreateSchema";

import { Input } from "@/shared/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { useLogin } from "@/modules/auth/hooks/useLoginHook/useLogin";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  listCategoryLive,
  LiveCreateSchema,
  LiveCreateSchemaData,
} from "@/modules/live/hooks/liveCreateSchema";
import { Calender } from "../../calendar/calendar";
import { Textarea } from "@/shared/components/ui/textarea";

type CreateUserFormProps = {};

export const FormLiveStepCreateModal = ({}: CreateUserFormProps) => {
  const {
    handleSubmit,
    register,
    setValue,
    control,
    watch,
    formState: { errors },
  } = useForm<LiveCreateSchemaData>({
    mode: "all",
    resolver: zodResolver(LiveCreateSchema),
  });

  const observationData = watch("date");

  console.log("errors ", errors);

  return (
    <form onSubmit={handleSubmit((data) => console.log("data", data))}>
      <section className="w-full flex flex-col gap-3">
        <div className="grid gap-2">
          <Label htmlFor="name">Titulo da live</Label>
          <Input
            {...register("title")}
            id="name"
            type="text"
            placeholder="Live Melhores produtos"
            required
          />
          <ErrorMessage error={errors.title?.message} />
        </div>
        <div className="grid gap-2">
          <Controller
            control={control}
            name="category"
            render={({ field }) => {
              return (
                <>
                  <Label htmlFor="Confirmpassword">Categoria</Label>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    defaultValue="User"
                  >
                    <SelectTrigger className="">
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {listCategoryLive?.map((category) => (
                        <>
                          <SelectItem value={category}>{category}</SelectItem>
                        </>
                      ))}
                    </SelectContent>
                  </Select>
                  <ErrorMessage error={errors.category?.message} />
                </>
              );
            }}
          />
        </div>

        <div className="grid gap-2">
          <section className="w-full flex justify-between gap-3">
            <section className="w-5/12 flex flex-col gap-2">
              <Label>Inicio de live</Label>

              <div className="w-full   flex  gap-2">
                <Calender name="date" register={register} />
                <Input type="time" />
              </div>
            </section>

            <section className="w-5/12 flex flex-col gap-2">
              <Label>Fim de live</Label>
              <div className="w-full   flex  gap-2">
                <Calender name="date" register={register} />

                <Input type="time" />
              </div>
            </section>
          </section>
        </div>

        <div className="grid gap-2">
          <Label>Descriçao</Label>
          <Textarea
            placeholder="A live de hoje vai ser um estouro 👀🎈!! venha participar"
            rows={4}
          />
        </div>
      </section>
    </form>
  );
};
