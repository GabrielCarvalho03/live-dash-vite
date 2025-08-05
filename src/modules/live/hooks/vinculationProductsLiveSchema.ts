import dayjs from "dayjs";
import { z } from "zod";
import { useLive } from "./useLive";

const { liveEditObject } = useLive.getState();

const liveStart =
  liveEditObject.dayLive?.date && liveEditObject.dayLive?.hour
    ? dayjs(liveEditObject.dayLive.date)
        .locale("pt-br")
        .set("hour", Number(liveEditObject.dayLive.hour.split(":")[0]))
        .set("minute", Number(liveEditObject.dayLive.hour.split(":")[1]))
        .set("second", 0)
    : dayjs();

const liveEnd = liveStart?.add ? liveStart.add(24, "hour") : null;

const timeToDate = (time: string) => {
  const [hour, minute] = time.split(":").map(Number);
  return dayjs(liveStart).hour(hour).minute(minute).second(0);
};

const ProductSchema = z.object({
  name: z.string().min(3, "Precisa ter no mínimo 3 caracteres"),
  link: z.string().url("Insira uma URL válida"),

  hourStart: z
    .string()
    .min(4, "Precisa ter um horário de início")
    .refine((val) => {
      if (!/^\d{1,2}:\d{2}$/.test(val)) return true;
      const date = timeToDate(val);
      return date.isAfter(liveStart) && date.isBefore(liveEnd);
    }, "Início fora do intervalo permitido"),

  hourEnd: z
    .string()
    .min(4, "Precisa ter um horário de fim")
    .refine((val) => {
      if (!/^\d{1,2}:\d{2}$/.test(val)) return true;
      const date = timeToDate(val);
      return date.isAfter(liveStart) && date.isBefore(liveEnd);
    }, "Fim fora do intervalo permitido"),
});

export const VinculationProductsLiveSchema = z.object({
  products: z.array(ProductSchema).min(1, "Vincule pelo menos um produto"),
});

export type VinculationProductsLiveSchemaData = z.infer<
  typeof VinculationProductsLiveSchema
>;
