import z from "zod";

export const CreateProductFormSchema = z.object({
  name: z.string().min(3, "Nome do produto é obrigatório"),
  link: z.string().url("Link do produto deve ser uma URL válida"),
  initialHour: z
    .string()
    .min(4, "Precisa ter um horário de início")
    .refine((val) => val !== "00:00", "Horário de início não pode ser 00:00"),
  finalHour: z
    .string()
    .min(5, "Horário de fim é obrigatório")
    .refine((val) => val !== "00:00", "Horário de fim não pode ser 00:00"),
});

export type CreateProductFormSchemaData = z.infer<
  typeof CreateProductFormSchema
>;
