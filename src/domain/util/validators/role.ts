import { RoleEnum } from '@src/domain/entities/auth/role';
import { ValidationError } from '@src/domain/util/errors/validationErrors';

export function Role() {
  return (target: any, key: string) => {
    let _value = target[key];

    const getter = () => _value;
    const setter = (value: string) => {
      if (!isValidRole(value)) {
        throw new ValidationError(`The value '${value}' is not valid for Role`);
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

export function isValidRole(roleString: string): boolean {
  const roleValues: string[] = Object.values(RoleEnum);
  return roleValues.includes(roleString);
}
