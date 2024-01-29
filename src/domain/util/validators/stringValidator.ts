export function isValidString(name: string) {
  if (name.length === 0 || name.trim() === '') {
    return false;
  }
  return true;
}
