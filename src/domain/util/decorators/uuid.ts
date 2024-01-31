import { BadRequestError } from '../errors/appErrors';

export function Uuid() {
  return (target: any, key: string) => {
    let _value = target[key];

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

export function uuidValidator(value: string): string {
  if (value === '') {
    return value;
  }
  const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
  if (!uuidRegex.test(value)) {
    throw new BadRequestError('The id entered does not match the uuid pattern');
  }
  return value;
}
