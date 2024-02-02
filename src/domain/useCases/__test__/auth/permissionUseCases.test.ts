import { IuuidGenerator } from '@src/domain/interfaces/adapters/uuidGenerator';
import { IPermissionUseCases, PermissionUseCases } from '../../auth/permissionUseCases';
import { BadRequestError, InternalServerError } from '@src/domain/util/errors/appErrors';
import { IPermissionRepository } from '@src/domain/interfaces/repositories/auth/permissionRepository';
import { RoleEnum } from '@src/domain/entities/auth/role';

describe('PermissionUseCases tests', () => {
  let uuidGenerator: IuuidGenerator;
  let permissionRepository: IPermissionRepository;
  let permissionUseCase: IPermissionUseCases;

  beforeAll(() => {
    uuidGenerator = {
      generate: jest.fn(),
    };

    permissionRepository = {
      createPermissions: jest.fn(),
      existsPermission: jest.fn(),
      deletePermission: jest.fn(),
      findPermissionsByUser: jest.fn(),
    };

    permissionUseCase = new PermissionUseCases(uuidGenerator, permissionRepository);
  });

  describe('Create Permissions tests', () => {
    test('Should create permission succesfully', async () => {
      const permissionsExpected = [
        {
          id: '2f9fb62d-ddc6-41c0-9d4b-4c66ddc725a8',
          userId: '2f9fb62d-ddc6-41c0-9d4b-4c66ddc725a8',
          role: RoleEnum.Admin,
        },
        {
          id: '2f9fb62d-ddc6-41c0-9d4b-4c66ddc725a8',
          userId: '2f9fb62d-ddc6-41c0-9d4b-4c66ddc725a8',
          role: RoleEnum.Admin,
        },
      ];

      jest.spyOn(uuidGenerator, 'generate').mockResolvedValue('2f9fb62d-ddc6-41c0-9d4b-4c66ddc725a8');
      jest.spyOn(permissionRepository, 'existsPermission').mockResolvedValueOnce(false);
      jest.spyOn(permissionRepository, 'createPermissions').mockResolvedValue(permissionsExpected);

      const sut = await permissionUseCase.createPermissions([
        {
          userId: '2f9fb62d-ddc6-41c0-9d4b-4c66ddc725a8',
          role: RoleEnum.Admin,
        },
        {
          userId: '2f9fb62d-ddc6-41c0-9d4b-4c66ddc725a8',
          role: RoleEnum.Admin,
        },
      ]);

      expect(sut).toEqual(permissionsExpected);
    });

    test('Should return BadRequestError when already exists a Permission with userId and role', async () => {
      jest.spyOn(permissionRepository, 'existsPermission').mockResolvedValueOnce(true);
      await expect(
        permissionUseCase.createPermissions([
          {
            userId: '2f9fb62d-ddc6-41c0-9d4b-4c66ddc725a8',
            role: RoleEnum.Admin,
          },
        ]),
      ).rejects.toEqual(new BadRequestError(`The user already has ${RoleEnum.Admin} permission`));
    });

    test('Should return BadRequestError when a ValidationError occur', async () => {
      jest.spyOn(uuidGenerator, 'generate').mockResolvedValue('2f9fb62d-ddc6-41c0-9d4b-4c66ddc725a8');
      jest.spyOn(permissionRepository, 'existsPermission').mockResolvedValueOnce(false);
      await expect(
        permissionUseCase.createPermissions([
          {
            userId: 'anyString',
            role: RoleEnum.Admin,
          },
          {
            userId: '2f9fb62d-ddc6-41c0-9d4b-4c66ddc725a8',
            role: RoleEnum.Admin,
          },
        ]),
      ).rejects.toEqual(new BadRequestError(`The userId entered does not match the uuid pattern`));
    });

    test('Should return InternalServerError when a unexpected error occur', async () => {
      jest.spyOn(uuidGenerator, 'generate').mockResolvedValue('2f9fb62d-ddc6-41c0-9d4b-4c66ddc725a8');
      jest.spyOn(permissionRepository, 'existsPermission').mockResolvedValueOnce(false);
      jest.spyOn(permissionRepository, 'createPermissions').mockRejectedValue(new Error('Any'));
      await expect(
        permissionUseCase.createPermissions([
          {
            userId: '2f9fb62d-ddc6-41c0-9d4b-4c66ddc725a8',
            role: RoleEnum.Admin,
          },
          {
            userId: '2f9fb62d-ddc6-41c0-9d4b-4c66ddc725a8',
            role: RoleEnum.Admin,
          },
        ]),
      ).rejects.toBeInstanceOf(InternalServerError);
    });
  });

  describe('Tests existsPermissions', () => {
    test('Should return true when permisstion exists', async () => {
      jest.spyOn(permissionRepository, 'existsPermission').mockResolvedValueOnce(true);

      const sut = await permissionUseCase.existsPermissions(
        '2f9fb62d-ddc6-41c0-9d4b-4c66ddc725a8',
        '2f9fb62d-ddc6-41c0-9d4b-4c66ddc725a8',
      );

      expect(sut).toEqual(true);
    });

    test('Should return false when permisstion not exists', async () => {
      jest.spyOn(permissionRepository, 'existsPermission').mockResolvedValueOnce(false);

      const sut = await permissionUseCase.existsPermissions(
        '2f9fb62d-ddc6-41c0-9d4b-4c66ddc725a8',
        '2f9fb62d-ddc6-41c0-9d4b-4c66ddc725a8',
      );

      expect(sut).toEqual(false);
    });

    test('Should return InternalServerError when a unexpected error occur', async () => {
      jest.spyOn(permissionRepository, 'existsPermission').mockRejectedValue(new Error('Any string'));

      await expect(
        permissionUseCase.existsPermissions(
          '2f9fb62d-ddc6-41c0-9d4b-4c66ddc725a8',
          '2f9fb62d-ddc6-41c0-9d4b-4c66ddc725a8',
        ),
      ).rejects.toBeInstanceOf(InternalServerError);
    });
  });

  describe('FindPermissionsByUser tests', () => {
    test('Should return Permissions by userId successfully', async () => {
      const permissionsExpected = [
        {
          id: '2f9fb62d-ddc6-41c0-9d4b-4c66ddc725a8',
          userId: '2f9fb62d-ddc6-41c0-9d4b-4c66ddc725a8',
          role: RoleEnum.Admin,
        },
        {
          id: '2f9fb62d-ddc6-41c0-9d4b-4c66ddc725a8',
          userId: '2f9fb62d-ddc6-41c0-9d4b-4c66ddc725a8',
          role: RoleEnum.Admin,
        },
      ];

      jest.spyOn(permissionRepository, 'findPermissionsByUser').mockResolvedValue(permissionsExpected);

      const sut = await permissionUseCase.findPermissionsByUser('2f9fb62d-ddc6-41c0-9d4b-4c66ddc725a8');

      expect(sut).toEqual(permissionsExpected);
    });

    test('Should return BadRequestError when not found permission by user id', async () => {
      jest.spyOn(permissionRepository, 'findPermissionsByUser').mockResolvedValue([]);

      await expect(permissionUseCase.findPermissionsByUser('2f9fb62d-ddc6-41c0-9d4b-4c66ddc725a8')).rejects.toEqual(
        new BadRequestError('No permissions found for this user'),
      );
    });
  });

  describe('DeletePermission tests', () => {
    test('Should delete permission successfully', async () => {
      jest.spyOn(permissionRepository, 'deletePermission');
      jest.spyOn(permissionRepository, 'existsPermission').mockResolvedValue(true);

      await permissionUseCase.deletePermission('2f9fb62d-ddc6-41c0-9d4b-4c66ddc725a8', RoleEnum.Standard);

      expect(permissionRepository.existsPermission).toHaveBeenCalledWith(
        '2f9fb62d-ddc6-41c0-9d4b-4c66ddc725a8',
        'STANDARD',
      );
      expect(permissionRepository.deletePermission).toHaveBeenCalledWith(
        '2f9fb62d-ddc6-41c0-9d4b-4c66ddc725a8',
        'STANDARD',
      );
    });

    test('Should return BadRequestError when not found Permission', async () => {
      jest.spyOn(permissionRepository, 'deletePermission');
      jest.spyOn(permissionRepository, 'existsPermission').mockResolvedValue(false);

      await expect(
        permissionUseCase.deletePermission('2f9fb62d-ddc6-41c0-9d4b-4c66ddc725a8', RoleEnum.Standard),
      ).rejects.toEqual(new BadRequestError('Permission not found'));
    });
  });
});
