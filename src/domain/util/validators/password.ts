import { ValidationError } from '../errors/validationErrors';

export function Password() {
  return (target: any, key: string) => {
    let _password = target[key];

    const getter = () => _password;
    const setter = (password: string) => {
      if (!isValidPassword(password)) {
        throw new ValidationError(`The password must be at least 8 characters long.`);
      }
      _password = password;
    };

    Object.defineProperty(target, key, {
      get: getter,
      set: setter,
      configurable: true,
    });
  };
}

export function isValidPassword(password: string): boolean {
  if (!password || password.trim() === '' || password.length < 8) {
    return false;
  }
  return true;
}
