import { useEffect } from "react";
import { ErrorMessage } from "@/shared/components/erroMessage/errorMessage";
import { Button } from "@/shared/components/ui/button";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUser } from "../../../../users/hooks/useUser";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@radix-ui/react-label";
import {
  LiveCreateSchema,
  LiveCreateSchemaData,
  LiveStatusProps,
} from "@/modules/live/hooks/liveCreateSchema";
import { Calender } from "../../calendar/calendar";
import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/lib/utils";
import { CategoryListCreateLive } from "@/modules/live/utils/categoryList";
import { Switch } from "@/shared/components/ui/switch";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/components/ui/accordion";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ImageUploadField } from "./previewImage";
import { useLive } from "@/modules/live/hooks/useLive";
import { defaultHour } from "@/modules/live/utils/defualtHour";
import { EditProductLive } from "../../EditProductInLiveModal/editProduct";
import { useVinculationProductsLive } from "@/modules/live/hooks/useVinculationProducts";

export const FormLiveStepCreateModal = () => {
  const { liveEdit, liveEditObject } = useLive();
  const defaultSchedules = [
    { date: new Date().toISOString(), day: "", hour: defaultHour() },
  ];

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
    defaultValues: {
      title: liveEdit ? liveEditObject.title : "",
      description: liveEdit ? liveEditObject.description : "",
      image: liveEdit ? liveEditObject.image : "",
      category: liveEdit ? liveEditObject.category : "Marketing",
      allSchedules: liveEdit
        ? [
            {
              date: new Date(liveEditObject.dayLive?.date).toISOString(),
              day: liveEditObject.dayLive?.day,
              hour: liveEditObject.dayLive?.hour,
            },
          ]
        : defaultSchedules,

      status: liveEdit
        ? (liveEditObject.status as LiveStatusProps)
        : "scheduled",

      liked_by: liveEdit ? liveEditObject.liked_by : [],
      likes: liveEdit ? liveEditObject.likes : 0,
    },
  });

  const selected = watch("category");
  const status = watch("status");

  const { saveUserisLoading } = useUser();
  const { handleCreateLive, handleUpdateLive } = useLive();
  const { allVinculationProducts } = useVinculationProductsLive();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "allSchedules",
  });
  const schedules = watch("allSchedules");

  const allProductsVinculate = allVinculationProducts?.filter(
    (item) => item.liveId == liveEditObject._id
  );

  useEffect(() => {
    fields.forEach((field, index) => {
      const dateValue = watch(`allSchedules.${index}.date`);
      if (dateValue) {
        const dayOfWeek = format(new Date(dateValue), "EEEE", { locale: ptBR });
        setValue(`allSchedules.${index}.day`, dayOfWeek);
      }
    });
  }, [fields, watch, setValue]);

  return (
    <form
      onSubmit={handleSubmit((data: LiveCreateSchemaData) =>
        liveEdit ? handleUpdateLive(data) : handleCreateLive(data)
      )}
    >
      <section className="w-full flex flex-col gap-3">
        <div className="w-full flex flex-col items-center mt-10">
          <Controller
            control={control}
            name="image"
            render={({ field }) => <ImageUploadField {...field} />}
          />

          <ErrorMessage error={errors.image?.message} />
        </div>

        <div className="grid gap-2 mt-3">
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
          <Label htmlFor="name">Categoria</Label>
          <section className="flex gap-2 flex-wrap">
            {CategoryListCreateLive.map((item, index) => (
              <Badge
                key={index}
                onClick={() => setValue("category", item.title)}
                className={cn(
                  "cursor-pointer transition h-10",
                  selected === item.title
                    ? "bg-blue-600 text-white"
                    : "bg-muted text-black"
                )}
              >
                <div className="flex items-center justify-center gap-2">
                  {item?.Icon && item.Icon}

                  {item.title}
                </div>
              </Badge>
            ))}

            {errors.category && (
              <ErrorMessage error={errors.category.message} />
            )}
          </section>
        </div>

        <div className="grid gap-2">
          <Label>Descriçao</Label>
          <Input
            {...register("description")}
            placeholder="A live de hoje vai ser um estouro 👀🎈!! venha participar"
          />
        </div>

        <div className="grid gap-2 my-5">
          <section className="w-full flex justify-center items-center gap-10">
            <span
              className={cn(
                status === "scheduled" &&
                  "text-blue-600 font-semibold transition-colors"
              )}
            >
              {" "}
              Agendar live{" "}
            </span>
            <Switch
              value={status}
              defaultChecked={liveEdit && liveEditObject.status === "live"}
              onCheckedChange={(value) =>
                setValue("status", value ? "live" : "scheduled")
              }
              className={cn(
                "data-[state=checked]:bg-blue-600",
                "data-[state=unchecked]:bg-blue-600"
              )}
            />
            <div
              className={cn(
                status === "live"
                  ? "text-white bg-blue-600   transition"
                  : "bg-muted",
                "px-5 py-2 rounded-lg  h-10 flex flex-col items-center justify-center gap-2"
              )}
            >
              Iniciar agora
            </div>
          </section>
        </div>

        {status === "scheduled" && (
          <div
            className={cn(
              "grid gap-2 ",
              "animate-in fade-in slide-in-from-bottom-2 duration-100 ease-out"
            )}
          >
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger className="font-normal">
                  Live programada
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col gap-4">
                    {fields?.map((field, index) => (
                      <section
                        key={field.id}
                        className="w-full flex gap-3 items-start border rounded-lg p-3 bg-muted/40"
                      >
                        <div className="flex flex-col gap-2">
                          <span className="text-gray-300">Data da live</span>
                          <Controller
                            control={control}
                            name={`allSchedules.${index}.date`}
                            render={({ field }) => {
                              const handleDateChange = (
                                selectedDate: Date | undefined
                              ) => {
                                if (selectedDate) {
                                  field.onChange(selectedDate.toISOString());
                                  const dayName = format(selectedDate, "EEEE", {
                                    locale: ptBR,
                                  });
                                  setValue(
                                    `allSchedules.${index}.day`,
                                    dayName
                                  );
                                } else {
                                  field.onChange(undefined);
                                  setValue(`allSchedules.${index}.day`, "");
                                }
                              };

                              return (
                                <Calender
                                  name={`allSchedules.${index}.date`}
                                  value={
                                    field.value
                                      ? new Date(field.value)
                                      : undefined
                                  }
                                  onChange={handleDateChange}
                                  DayOfDate
                                />
                              );
                            }}
                          />
                        </div>

                        <div className="w-[0.5px] h-[100px] bg-muted" />

                        <div className="flex flex-col gap-2">
                          <span className="text-gray-300">Horário da live</span>
                          <input
                            type="time"
                            id={`time-${index}`}
                            {...register(`allSchedules.${index}.hour`, {
                              required: true,
                            })}
                            defaultValue="00:00"
                            required
                            className="rounded-lg bg-white border text-gray-900 leading-none focus:ring-blue-500 focus:border-blue-500 block flex-1 w-full text-sm border-gray-300 py-1.5 px-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          />
                        </div>

                        {schedules.length > 1 && (
                          <button
                            type="button"
                            onClick={() => remove(index)}
                            className="ml-auto text-red-500 hover:underline text-sm"
                          >
                            Remover
                          </button>
                        )}
                      </section>
                    ))}

                    {!liveEdit && (
                      <button
                        type="button"
                        onClick={() => append({ date: "", day: "", hour: "" })}
                        className="self-start text-blue-600 hover:underline text-sm"
                      >
                        + Adicionar outra data
                      </button>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        )}

        {liveEdit && allProductsVinculate?.length > 0 && (
          <EditProductLive listLive={allProductsVinculate} />
        )}
      </section>

      <Button
        disabled={saveUserisLoading}
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white "
      >
        {saveUserisLoading ? (
          <Loader2 className="animate-spin" />
        ) : liveEdit ? (
          "Atualizar Live"
        ) : (
          "Criar"
        )}
      </Button>
    </form>
  );
};
