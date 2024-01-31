import { ValidationError } from '../errors/validationErrors';

export function NotEmpty() {
  return (target: any, key: string) => {
    let _value = target[key];
    const attribute = key.replace(/_/g, '');

    const getter = () => _value;
    const setter = (value: string) => {
      if (!isNotEmpty(value)) {
        throw new ValidationError(`The value for '${attribute}' must not be empty.`);
      }
      _value = value;
    };

    Object.defineProperty(target, key, {
      get: getter,
      set: setter,
      configurable: true,
    });
  };
}

export function isNotEmpty(value: string) {
  if (!value || value.trim() === '') {
    return false;
  }
  return true;
}
