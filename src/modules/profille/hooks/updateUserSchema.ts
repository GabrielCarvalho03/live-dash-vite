import z from "zod";

export const updateUserSchema = z.object({
  avatar: z.string().optional(),
});

export type updateUserSchemaData = z.infer<typeof updateUserSchema>;
