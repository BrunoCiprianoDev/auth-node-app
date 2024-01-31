import { ValidationError } from '../errors/validationErrors';

export function Uuid() {
  return (target: any, key: string) => {
    let _value = target[key];

    const getter = () => _value;
    const setter = (value: string) => {
      if (!isValidUuid(value)) {
        throw new ValidationError('The id entered does not match the uuid pattern');
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

/**
 * Validates a string as a UUID (Universally Unique Identifier) of version 4.
 *
 * @param {string} value - The string to be validated as a UUID.
 * @returns {string} - The validated UUID string.
 * @throws {ValidationError} - Thrown if the provided string does not match the UUID pattern.
 *
 * @description
 * This function checks if the provided string adheres to the UUID version 4 pattern,
 * which consists of 32 hexadecimal digits displayed in five groups separated by hyphens.
 * If the input is an empty string, it is considered valid, and the function returns it unchanged.
 *
 * @see {@link https://www.uuidgenerator.net/version4}
 * for more information about UUID version 4.
 *
 * @author BrunoCiprianoDev
 */
export function isValidUuid(value: string): boolean {
  const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
  return uuidRegex.test(value);
}
