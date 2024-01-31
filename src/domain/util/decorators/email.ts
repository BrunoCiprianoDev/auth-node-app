import { BadRequestError } from '../errors/appErrors';

export function Email() {
  return (target: any, key: string) => {
    let _email = target[key];

    const getter = () => _email;
    const setter = (email: string) => {
      _email = emailValidator(email);
    };

    Object.defineProperty(target, key, {
      get: getter,
      set: setter,
      configurable: true,
    });
  };
}

export function emailValidator(email: string): string {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new BadRequestError('Invalid email');
  }
  return email;
}
