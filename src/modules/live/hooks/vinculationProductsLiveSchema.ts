import { z } from "zod";

export const ProductSchema = z.object({
  VinculateId: z.string().min(1, "Selecione uma live"),
  hourStart: z
    .string()
    .min(4, "Precisa ter um horário de início")
    .refine(
      (val) => {
        const [h, m] = val.split(":").map(Number);
        return h > 0 || m > 0;
      },
      {
        message: "O horário inicial não pode ser 00:00",
      }
    ),

  hourEnd: z.string().min(4, "Precisa ter um horário de fim"),
});

export type VinculationProductsLiveSchemaData = z.infer<typeof ProductSchema>;
