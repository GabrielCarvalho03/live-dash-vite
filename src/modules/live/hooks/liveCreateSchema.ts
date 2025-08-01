import { z } from "zod";

export const listCategoryLive = ["Religioso", "Marketing", "Games", "Vendas"];

const daysOfWeekEnum = z.enum([
  "Segunda",
  "Terca",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sabado",
  "Domingo",
]);

export const LiveCreateSchema = z.object({
  title: z.string(),
  category: z.enum(listCategoryLive, {
    error: "selecione uma categoria",
  }),
  days: z.array(daysOfWeekEnum),
  date: z.array(z.string()),
  url_transmission: z.string(),
  url_play: z.string(),
  image: z.string({
    error: "precisa de uma capa",
  }),
  status: z.enum(["schedule", "live", "finished"]),
  userId: z.string().optional(),
  likes: z.number().optional(),
  liked_by: z.array(z.object()),
  description: z.string().optional(),
});

export type LiveCreateSchemaData = z.infer<typeof LiveCreateSchema>;
