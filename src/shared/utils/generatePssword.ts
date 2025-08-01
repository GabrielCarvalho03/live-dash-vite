export const generatePassword = (length = 8) => {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()-_=+[]{};:,.<>?';

  if (length < 4) {
    throw new Error('A senha deve ter no mínimo 4 caracteres');
  }

  // Garante exatamente 1 de cada obrigatório
  const required = [
    uppercase[Math.floor(Math.random() * uppercase.length)],
    lowercase[Math.floor(Math.random() * lowercase.length)],
    numbers[Math.floor(Math.random() * numbers.length)],
    symbols[Math.floor(Math.random() * symbols.length)], // apenas 1 símbolo
  ];

  const allLetters = uppercase + lowercase;

  // Preenche o restante só com letras (e números, opcionalmente)
  const remainingLength = length - required.length;
  for (let i = 0; i < remainingLength; i++) {
    const pool = Math.random() < 0.3 ? numbers : allLetters;
    required.push(pool[Math.floor(Math.random() * pool.length)]);
  }

  // Embaralha
  return required.sort(() => Math.random() - 0.5).join('');
};
