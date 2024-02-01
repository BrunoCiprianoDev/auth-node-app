import { ValidationError } from "@src/domain/util/errors/validationErrors";

export enum RoleEnum {
    Standard = "STANDARD",
    Admin = "ADMIN"
}


export function Role() {
    return (target: any, key: string) => {
        let _value = target[key];

        const getter = () => _value;
        const setter = (value: string) => {
            _value = converterStringToRoleEnum(value);
        };

        Object.defineProperty(target, key, {
            get: getter,
            set: setter,
            configurable: true,
        });
    };

}

export function converterStringToRoleEnum(roleString: string): string {
    switch (roleString) {
        case RoleEnum.Standard:
            return RoleEnum.Standard;
        case RoleEnum.Admin:
            return RoleEnum.Admin;
        default:
            throw new ValidationError(`The value '${roleString}' is not valid for Role`);
    }
}



