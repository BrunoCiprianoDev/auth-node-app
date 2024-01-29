import { IPermissionRepository } from "@src/domain/interfaces/repositories/permissionRepository";
import { IRoleUseCases } from "../roleUseCases";
import { IUserUseCases } from "../userUseCases";
import { InternalServerError, NotFoundError } from "@src/domain/util/errors/appErrors";
import { PermissionUseCases } from "../permissionUseCases";

describe('PermissionUseCases tests', () => {

    let mockedPermissionRepository: jest.Mocked<IPermissionRepository>;
    let permissionUseCase: PermissionUseCases;
    let mockedUserUseCases: jest.Mocked<IUserUseCases>;
    let mockedRoleUseCases: jest.Mocked<IRoleUseCases>;

    beforeAll(() => {

        mockedPermissionRepository = {
            create: jest.fn(),
            findById: jest.fn(),
            findByUserId: jest.fn(),
            findByRoleId: jest.fn(),
            delete: jest.fn(),
        }

        mockedRoleUseCases = {
            findById: jest.fn(),
            findAll: jest.fn()
        }

        mockedUserUseCases = {
            createUser: jest.fn(),
            findById: jest.fn(),
            findByEmail: jest.fn(),
            updateName: jest.fn(),
            updatePassword: jest.fn(),
        }

        permissionUseCase = new PermissionUseCases(
            mockedPermissionRepository,
            mockedUserUseCases,
            mockedRoleUseCases
        );

    })

    // Create tests
    describe('Create tests', () => {

        test('Should save permission successfully', async () => {

            const userMockExpect = { id: 'uuidUser', name: 'John Doe', email: 'johnDoe@email.com' }
            const roleMockExpect = { id: 'uuidRole', name: 'admin' }
            const permissionExpect = { id: 'uuid', userId: 'uuidUser', roleId: 'uuidRole' }

            jest.spyOn(mockedUserUseCases, 'findById').mockResolvedValue(userMockExpect);
            jest.spyOn(mockedRoleUseCases, 'findById').mockResolvedValue(roleMockExpect);
            jest.spyOn(mockedPermissionRepository, 'create').mockResolvedValue(permissionExpect);

            const sut = await permissionUseCase.create({ userId: 'uuidUser', roleId: 'uuidRole' });

            expect(sut).toEqual(permissionExpect);
        })

        test('Should return NotFoundError if userId is not found', async () => {

            jest.spyOn(mockedUserUseCases, 'findById').mockRejectedValue(new NotFoundError('Not found user with id uuidUser'));

            await expect(permissionUseCase.create({ userId: 'uuidUser', roleId: 'uuidRole' })).rejects.toEqual(
                new NotFoundError(`Not found user with id uuidUser`),
            );
        })


        test('Should return NotFoundError if roleId is not found', async () => {

            const userMockExpect = { id: 'uuidUser', name: 'John Doe', email: 'johnDoe@email.com' }
            jest.spyOn(mockedUserUseCases, 'findById').mockResolvedValue(userMockExpect);
            jest.spyOn(mockedRoleUseCases, 'findById').mockRejectedValue(new NotFoundError('Role not found with id uuidRole'));

            await expect(permissionUseCase.create({ userId: 'uuidUser', roleId: 'uuidRole' })).rejects.toEqual(
                new NotFoundError(`Role not found with id uuidRole`),
            );
        })

        test('It should return an error if an error occurs when calling the repository', async () => {
            const userMockExpect = { id: 'uuidUser', name: 'John Doe', email: 'johnDoe@email.com' }
            const roleMockExpect = { id: 'uuidRole', name: 'admin' }

            jest.spyOn(mockedUserUseCases, 'findById').mockResolvedValue(userMockExpect);
            jest.spyOn(mockedRoleUseCases, 'findById').mockResolvedValue(roleMockExpect);
            jest.spyOn(mockedPermissionRepository, 'create').mockRejectedValue(new InternalServerError('Any string'));

            await expect(permissionUseCase.create({ userId: 'uuidUser', roleId: 'uuidRole' })).rejects.toEqual(
                new InternalServerError('An unexpected error has occurred. Please try again later.'),
            );
        })


    })

    // FindById tests
    describe('Function FindById tests', () => {
        test('It should return a permission by id', async () => {
            const permissionExpect = { id: 'uuid', userId: 'uuidUser', roleId: 'uuidRole' }

            jest.spyOn(mockedPermissionRepository, 'findById').mockResolvedValue(permissionExpect);

            const sut = await permissionUseCase.findById('uuid');

            expect(sut).toEqual(permissionExpect);
        });

        test('It should return an error when it does not find permission by id', async () => {
            jest.spyOn(mockedPermissionRepository, 'findById').mockResolvedValue(null);

            await expect(permissionUseCase.findById('uuid')).rejects.toEqual(
                new NotFoundError(`Not found permission with id uuid`),
            );
        });

        test('Should return InternalServerError when an unexpected error occurs in the repository', async () => {
            jest.spyOn(mockedPermissionRepository, 'findById').mockRejectedValue(new Error());

            await expect(permissionUseCase.findById('uuid')).rejects.toEqual(
                new InternalServerError(`An unexpected error has occurred. Please try again later.`),
            );
        });
    });

    // FindByUserId tests
    describe('Function FindByUserId tests', () => {
        test('It should return a permission by user id', async () => {
            const permissionAdminExpect = { id: 'uuid', userId: 'uuidUser', roleId: 'uuidRole' }
            const permissionUserExpect = { id: 'uuid', userId: 'uuidUser', roleId: 'uuidRole' }

            jest.spyOn(mockedPermissionRepository, 'findByUserId').mockResolvedValue([permissionAdminExpect, permissionUserExpect]);

            const sut = await permissionUseCase.findByUserId('uuid');

            expect(sut).toEqual([permissionAdminExpect, permissionUserExpect]);
        });

        test('It should return an error when it does not find permission by id', async () => {
            jest.spyOn(mockedPermissionRepository, 'findByUserId').mockResolvedValue([]);

            await expect(permissionUseCase.findByUserId('uuid')).rejects.toEqual(
                new NotFoundError(`Not found permission with userId uuid`),
            );
        });

        test('Should return InternalServerError when an unexpected error occurs in the repository', async () => {
            jest.spyOn(mockedPermissionRepository, 'findByUserId').mockRejectedValue(new Error());

            await expect(permissionUseCase.findByUserId('uuid')).rejects.toEqual(
                new InternalServerError(`An unexpected error has occurred. Please try again later.`),
            );
        });
    });

    // FindByRoleId tests
    describe('Function FindByRoleId tests', () => {
        test('It should return a permission by role id', async () => {
            const permissionAdminExpect = { id: 'uuid', userId: 'uuidUser', roleId: 'uuidRole' }
            const permissionUserExpect = { id: 'uuid', userId: 'uuidUser', roleId: 'uuidRole' }

            jest.spyOn(mockedPermissionRepository, 'findByRoleId').mockResolvedValue([permissionAdminExpect, permissionUserExpect]);

            const sut = await permissionUseCase.findByRoleId('uuid');

            expect(sut).toEqual([permissionAdminExpect, permissionUserExpect]);
        });

        test('It should return an error when it does not find permission by id', async () => {
            jest.spyOn(mockedPermissionRepository, 'findByRoleId').mockResolvedValue([]);

            await expect(permissionUseCase.findByRoleId('uuid')).rejects.toEqual(
                new NotFoundError(`Not found permission with RoleId uuid`),
            );
        });

        test('Should return InternalServerError when an unexpected error occurs in the repository', async () => {
            jest.spyOn(mockedPermissionRepository, 'findByRoleId').mockRejectedValue(new Error());

            await expect(permissionUseCase.findByRoleId('uuid')).rejects.toEqual(
                new InternalServerError(`An unexpected error has occurred. Please try again later.`),
            );
        });
    });

    // Deleted method tests
    describe('Function delete tests', () => {
        test('It should deleted a permission by id', async () => {
            const permissionAdminExpect = { id: 'uuid', userId: 'uuidUser', roleId: 'uuidRole' }

            jest.spyOn(mockedPermissionRepository, 'findById').mockResolvedValue(permissionAdminExpect);
            jest.spyOn(mockedPermissionRepository, 'delete').mockResolvedValue(true);

            await permissionUseCase.delete('uuid');

            expect(mockedPermissionRepository.delete).toHaveBeenCalledWith('uuid');
        });

        test('It should return an error when it does not find permission by id', async () => {
            jest.spyOn(mockedPermissionRepository, 'findById').mockRejectedValue(new NotFoundError('Not found permission with id uuid'));

            await expect(permissionUseCase.delete('uuid')).rejects.toEqual(
                new NotFoundError(`Not found permission with id uuid`),
            );
        });

        test('Should return InternalServerError when an unexpected error occurs in the repository', async () => {

            const permissionAdminExpect = { id: 'uuid', userId: 'uuidUser', roleId: 'uuidRole' }

            jest.spyOn(mockedPermissionRepository, 'findById').mockResolvedValue(permissionAdminExpect);

            jest.spyOn(mockedPermissionRepository, 'delete').mockRejectedValue(new Error());

            await expect(permissionUseCase.delete('uuid')).rejects.toEqual(
                new InternalServerError(`An unexpected error has occurred. Please try again later.`),
            );
        });
    });


})