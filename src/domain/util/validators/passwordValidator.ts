export function isValidPassword(password: string) {
  if (password.length < 8 || password.trim() === '') {
    return false;
  }

  // eslint-disable-next-line no-useless-escape
  const specialCharCount = (password.match(/[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/g) || []).length;

  if (specialCharCount < 2) {
    return false;
  }

  return true;
}
