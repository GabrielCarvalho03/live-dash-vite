import z from 'zod';

export const forgotPassordSchemaInStep1 = z.object({
  email: z.email({
    error: 'Digite um email válido',
  }),
});

export const forgotPassordSchemaInStep2 = z
  .object({
    password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
    confirmPassword: z.string(),
  })
  .superRefine((data, ctx) => {
    const { password, confirmPassword } = data;

    const erros: string[] = [];

    if (!/[A-Z]/.test(password)) {
      erros.push('Deve conter pelo menos uma letra maiúscula');
    }

    if (!/[a-z]/.test(password)) {
      erros.push('Deve conter pelo menos uma letra minúscula');
    }

    if (!/[0-9]/.test(password)) {
      erros.push('Deve conter pelo menos um número');
    }

    if (!/[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/.test(password)) {
      erros.push('Deve conter pelo menos um caractere especial');
    }

    // Adiciona todas as issues de uma vez para o campo password
    for (const erro of erros) {
      ctx.addIssue({
        path: ['password'],
        code: 'custom',
        message: erro,
      });
    }

    if (password !== confirmPassword) {
      ctx.addIssue({
        path: ['confirmPassword'],
        code: 'custom',
        message: 'As senhas não coincidem',
      });
    }
  });

export type ForgotPasswordDataInStep1 = z.infer<
  typeof forgotPassordSchemaInStep1
>;

export type ForgotPasswordDataInStep2 = z.infer<
  typeof forgotPassordSchemaInStep2
>;
