const PASSWORD_SYMBOLS = '!@#$%^&*()_+-=[]{};\':"|<>?,./`~';

export function isValidPassword(password: string): boolean {
  if (password.length < 8) {
    return false;
  }

  if (!/[a-z]/.test(password)) {
    return false;
  }

  if (!/[A-Z]/.test(password)) {
    return false;
  }

  if (!/[0-9]/.test(password)) {
    return false;
  }

  return [...password].some((char) => PASSWORD_SYMBOLS.includes(char));
}
