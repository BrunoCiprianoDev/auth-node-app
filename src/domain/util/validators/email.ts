import { ValidationError } from '../errors/validationErrors';

export function Email() {
  return (target: any, key: string) => {
    let _email = target[key];

    const getter = () => _email;
    const setter = (email: string) => {
      if (!isValidEmail(email)) {
        throw new ValidationError('Invalid email');
      }
      _email = email;
    };

    Object.defineProperty(target, key, {
      get: getter,
      set: setter,
      configurable: true,
    });
  };
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
