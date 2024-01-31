import { BadRequestError } from '../errors/appErrors';

export function NotEmpty() {
  return (target: any, key: string) => {
    let _value = target[key];
    const attribute = key.replace(/_/g, '');

    const getter = () => _value;
    const setter = (value: string) => {
      _value = value;
    };

    Object.defineProperty(target, key, {
      get: getter,
      set: setter,
      configurable: true,
    });
  };
}

export function notEmptyValidator(value: string, attribute: string) {
  if (!value || value.trim() === '') {
    throw new BadRequestError(`The value for '${attribute}' must not be empty.`);
  }
  return value;
}
