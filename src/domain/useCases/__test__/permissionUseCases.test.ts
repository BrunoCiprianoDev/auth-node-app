import { IuuidGenerator } from "@src/domain/interfaces/adapters/uuidGenerator"
import { IPermissionRepository } from "@src/domain/interfaces/repositories/permissionRepository";
import { IPermissionUseCase, PermissionUseCase } from "../permissionUseCases";
import { RoleEnum } from "@src/domain/entities";
import { BadRequestError, InternalServerError } from "@src/domain/util/errors/appErrors";

describe('PermissionUseCases tests', () => {

    let uuidGenerator: IuuidGenerator;
    let permissionRepository: IPermissionRepository;
    let permissionUseCase: IPermissionUseCase;

    beforeAll(() => {
        uuidGenerator = {
            generate: jest.fn(),
        }

        permissionRepository = {
            createPermissions: jest.fn(),
        }

        permissionUseCase = new PermissionUseCase(uuidGenerator, permissionRepository);

    })

    describe('Create Permissions tests', () => {

        test('Should create permission succesfully', async () => {

            const permissionsExpected = [{
                id: '2f9fb62d-ddc6-41c0-9d4b-4c66ddc725a8',
                userId: '2f9fb62d-ddc6-41c0-9d4b-4c66ddc725a8',
                role: RoleEnum.Admin
            },
            {
                id: '2f9fb62d-ddc6-41c0-9d4b-4c66ddc725a8',
                userId: '2f9fb62d-ddc6-41c0-9d4b-4c66ddc725a8',
                role: RoleEnum.Admin
            }
            ]

            jest.spyOn(uuidGenerator, 'generate').mockResolvedValue('2f9fb62d-ddc6-41c0-9d4b-4c66ddc725a8');
            jest.spyOn(permissionRepository, 'createPermissions').mockResolvedValue(permissionsExpected);

            const sut = await permissionUseCase.createPermissions([
                {
                    userId: '2f9fb62d-ddc6-41c0-9d4b-4c66ddc725a8',
                    role: RoleEnum.Admin
                },
                {
                    userId: '2f9fb62d-ddc6-41c0-9d4b-4c66ddc725a8',
                    role: RoleEnum.Admin
                }
            ])

            expect(sut).toEqual(permissionsExpected);
        })

        test('Should return BadRequestError when a ValidationError occur', async () => {

            jest.spyOn(uuidGenerator, 'generate').mockResolvedValue('2f9fb62d-ddc6-41c0-9d4b-4c66ddc725a8');
            await expect(
                permissionUseCase.createPermissions([
                    {
                        userId: 'anyString',
                        role: RoleEnum.Admin
                    },
                    {
                        userId: '2f9fb62d-ddc6-41c0-9d4b-4c66ddc725a8',
                        role: RoleEnum.Admin
                    }
                ]),
            ).rejects.toEqual(
                new BadRequestError(`The userId entered does not match the uuid pattern`),
            );
        })

        test('Should return Internal when a ValidationError occur', async () => {


            jest.spyOn(uuidGenerator, 'generate').mockResolvedValue('2f9fb62d-ddc6-41c0-9d4b-4c66ddc725a8');
            jest.spyOn(permissionRepository, 'createPermissions').mockRejectedValue(new Error('Any'));
            await expect(
                permissionUseCase.createPermissions([
                    {
                        userId: '2f9fb62d-ddc6-41c0-9d4b-4c66ddc725a8',
                        role: RoleEnum.Admin
                    },
                    {
                        userId: '2f9fb62d-ddc6-41c0-9d4b-4c66ddc725a8',
                        role: RoleEnum.Admin
                    }
                ]),
            ).rejects.toEqual(
                new InternalServerError(`An unexpected error has occurred. Please try again later.`),
            );
        })

    })


})