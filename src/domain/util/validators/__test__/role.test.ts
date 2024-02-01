import { ValidationError } from "@src/domain/util/errors/validationErrors";
import { RoleEnum, converterStringToRoleEnum } from "../role"

describe('Role converter tests', () => {

    test('Should return Role.Standard when roleString = "STANDARD"', () => {

        const sut = converterStringToRoleEnum('STANDARD');

        expect(sut).toEqual(RoleEnum.Standard);

    });

    test('Should return Role.Admin when roleString = "ADMIN"', () => {

        const sut = converterStringToRoleEnum('ADMIN');

        expect(sut).toEqual(RoleEnum.Admin);

    })

    test('Should return ValidationError when roleString not matches a enum options', () => {

        expect(() => (converterStringToRoleEnum('anyString'))).toThrow(
            new ValidationError(`The value 'anyString' is not valid for Role`),
        );
    })

})