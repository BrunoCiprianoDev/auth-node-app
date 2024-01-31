import { BadRequestError } from '../errors/appErrors';

export function Password() {
  return (target: any, key: string) => {
    let _password = target[key];

    const getter = () => _password;
    const setter = (password: string) => {
      _password = passwordValidator(password);
    };

    Object.defineProperty(target, key, {
      get: getter,
      set: setter,
      configurable: true,
    });
  };
}

export function passwordValidator(password: string): string {
  if (!password || password.trim() === '') {
    throw new BadRequestError(`The value for 'password' must not be empty.`);
  }

  if (password.length < 8) {
    throw new BadRequestError(`The password must be at least 8 characters long.`);
  }

  if (!/[0-9]/.test(password)) {
    throw new BadRequestError(`The password must contain at least 1 digit.`);
  }

  // eslint-disable-next-line no-useless-escape
  const specialCharCount = (password.match(/[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/g) || []).length;

  if (specialCharCount < 2) {
    throw new BadRequestError(`The password must contain at least 2 special characters.`);
  }
  return password;
}
