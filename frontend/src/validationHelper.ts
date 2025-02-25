export function isValidEmail(email: string): boolean {
  const regexPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regexPattern.test(email);
}

export function isValidPassword(password: string): boolean {
  const regexPattern =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&_])[A-Za-z\d@$!%*?&_]{8,}$/;
  return regexPattern.test(password);
}

export function isValidName(name: string): boolean {
  const regexPattern = /^(.*[A-Za-z]){3,}.*$/;
  return regexPattern.test(name);
}
