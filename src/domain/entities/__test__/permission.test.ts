import { ValidationError } from "@src/domain/util/errors/validationErrors";
import { Permission } from "../auth/permission"
import { RoleEnum } from "../../util/validators/role";

describe('Permission tests', () => {

    test('Should return Permission instance successfully', () => {

        const permissionData = {
            id: '2f9fb62d-ddc6-41c0-9d4b-4c66ddc725a8',
            userId: '2f9fb62d-ddc6-41c0-9d4b-4c66ddc725a9',
            role: RoleEnum.Standard
        }

        const sut = new Permission(permissionData);

        expect(sut.permissionData).toEqual(permissionData);

    })

    test('Should return ValidationError when role is not valid', () => {

        const permissionData = {
            id: '2f9fb62d-ddc6-41c0-9d4b-4c66ddc725a8',
            userId: '2f9fb62d-ddc6-41c0-9d4b-4c66ddc725a9',
            role: 'anyString'
        }

        expect(() => (new Permission(permissionData))).toThrow(
            new ValidationError(`The value '${permissionData.role}' is not valid for Role`),
        );

    })


    test('Should return ValidationError when set invalid id', () => {

        const permissionData = {
            id: '2f9fb62d-ddc6-41c0-9d4b-4c66ddc725a8',
            userId: '2f9fb62d-ddc6-41c0-9d4b-4c66ddc725a9',
            role: RoleEnum.Standard
        }


        const sut = new Permission(permissionData);

        expect(() => (sut.id = '')).toThrow(
            new ValidationError(`The id entered does not match the uuid pattern`),
        );

    })

    test('Should return ValidationError when set invalid userId', () => {

        const permissionData = {
            id: '2f9fb62d-ddc6-41c0-9d4b-4c66ddc725a8',
            userId: '2f9fb62d-ddc6-41c0-9d4b-4c66ddc725a9',
            role: RoleEnum.Admin
        }


        const sut = new Permission(permissionData);

        expect(() => (sut.userId = '')).toThrow(
            new ValidationError(`The userId entered does not match the uuid pattern`),
        );
    })

    test('Should return ValidationError when set invalid role', () => {

        const permissionData = {
            id: '2f9fb62d-ddc6-41c0-9d4b-4c66ddc725a8',
            userId: '2f9fb62d-ddc6-41c0-9d4b-4c66ddc725a9',
            role: RoleEnum.Admin
        }


        const sut = new Permission(permissionData);

        expect(() => (sut.role = 'anyString')).toThrow(
            new ValidationError(`The value 'anyString' is not valid for Role`),
        );
    })



})