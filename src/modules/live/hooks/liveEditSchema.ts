import { z } from "zod";
import { CategoryListCreateLive } from "../utils/categoryList";

export const listCategoryLive = CategoryListCreateLive.map(
  (item) => item.title
);

export type LiveStatusProps = "scheduled" | "live" | "finished";

const daysOfWeekEnum = z.enum([
  "Segunda",
  "Terca",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sabado",
  "Domingo",
]);

const dayLive = z.object({
  date: z.string(),
  day: z.string(),
  hour: z.string(),
});

export const LiveEditSchema = z.object({
  title: z.string().min(3, "precisa ter no minimo 3 caracteres"),
  category: z.enum(listCategoryLive, {
    error: "selecione uma categoria",
  }),
  dayLive,
  image: z.string({
    error: "precisa de uma capa",
  }),
  status: z.enum(["scheduled", "live", "finished"]),
  userId: z.string().optional(),
  likes: z.number().optional(),
  liked_by: z.array(z.object()),
  description: z.string().optional(),
});

export type LiveEditSchemaData = z.infer<typeof LiveEditSchema>;
