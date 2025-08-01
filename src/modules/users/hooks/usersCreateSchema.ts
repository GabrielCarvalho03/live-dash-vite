import { z } from 'zod';

export const userTypeEnum = z.enum(['Admin', 'User'], {
  error: 'Selecione o tipo de usuário',
});
export const permitionsEnum = z.enum(
  ['CreateLive', 'UserManeger', 'Moderator'],
  {
    error: 'Selecione uma permissão do usuário',
  }
);

export const UsersCreateSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.email({
    message: 'E-mail inválido',
  }),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  permitions: z.array(permitionsEnum),
  userType: userTypeEnum,
});

export type UseCreateDataSchema = z.infer<typeof UsersCreateSchema>;
