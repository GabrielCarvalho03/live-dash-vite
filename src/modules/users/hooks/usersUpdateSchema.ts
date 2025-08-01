import { z } from 'zod';

export const userTypeEnum = z.enum(['Admin', 'User'], {
  error: () => ({ message: 'Selecione o tipo de usuário' }),
});

export const permitionsEnum = z.enum(
  ['CreateLive', 'UserManeger', 'Moderator'],
  {
    error: 'Selecione uma permissão do usuário',
  }
);

export const UsersUpdateSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.email({
    message: 'E-mail inválido',
  }),
  permitions: z.array(permitionsEnum),
  userType: userTypeEnum,
  status: z.enum(['Active', 'Inactive']),
});

export type UserUpdateDataSchema = z.infer<typeof UsersUpdateSchema>;
