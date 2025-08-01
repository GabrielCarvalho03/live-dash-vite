const passwordRequirementsList = [
  {
    id: "minLength",
    label: "Senha deve ter no mínimo 6 caracteres",
    test: (val: string) => val?.length >= 6,
  },
  {
    id: "uppercase",
    label: "Deve conter pelo menos uma letra maiúscula",
    test: (val: string) => /[A-Z]/.test(val),
  },
  {
    id: "lowercase",
    label: "Deve conter pelo menos uma letra minúscula",
    test: (val: string) => /[a-z]/.test(val),
  },
  {
    id: "number",
    label: "Deve conter pelo menos um número",
    test: (val: string) => /[0-9]/.test(val),
  },
  {
    id: "special",
    label: "Deve conter pelo menos um caractere especial",
    test: (val: string) => /[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/.test(val),
  },
];

export function PasswordRequirements({ password }: { password: string }) {
  return (
    <ul>
      {passwordRequirementsList.map(({ id, label, test }) => {
        const valid = test(password);
        return (
          <li
            className={`${valid ? "text-green-500" : "text-red-500"}`}
            key={id}
          >
            {valid ? "✔️" : "❌"} {label}
          </li>
        );
      })}
    </ul>
  );
}
