import { IPermissionRepository } from '@src/domain/interfaces/repositories/permissionRepository';
import { IRoleUseCases } from '../roleUseCases';
import { IUserUseCases } from '../userUseCases';
import {
  BadRequestError,
  InternalServerError,
  NotFoundError,
} from '@src/domain/util/errors/appErrors';
import { PermissionUseCases } from '../permissionUseCases';

describe('PermissionUseCases tests', () => {
  let mockedPermissionRepository: jest.Mocked<IPermissionRepository>;
  let permissionUseCase: PermissionUseCases;
  let mockedUserUseCases: jest.Mocked<IUserUseCases>;
  let mockedRoleUseCases: jest.Mocked<IRoleUseCases>;

  beforeAll(() => {
    mockedPermissionRepository = {
      create: jest.fn(),
      exists: jest.fn(),
      findById: jest.fn(),
      findByUserId: jest.fn(),
      findByUserEmail: jest.fn(),
      findByRoleId: jest.fn(),
      delete: jest.fn(),
    };

    mockedRoleUseCases = {
      findById: jest.fn(),
      findAll: jest.fn(),
    };

    mockedUserUseCases = {
      createUser: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      updateName: jest.fn(),
      updatePassword: jest.fn(),
      passwordMatches: jest.fn(),
    };

    permissionUseCase = new PermissionUseCases(
      mockedPermissionRepository,
      mockedUserUseCases,
      mockedRoleUseCases,
    );
  });

  // Create tests
  describe('Create tests', () => {
    test('Should save permission successfully', async () => {
      const userMockExpect = { id: 'uuidUser', name: 'John Doe', email: 'johnDoe@email.com' };
      const roleMockExpect = { id: 'uuidRole', name: 'admin' };
      const permissionExpect = { id: 'uuid', user: userMockExpect, role: roleMockExpect };

      jest.spyOn(mockedUserUseCases, 'findById').mockResolvedValue(userMockExpect);
      jest.spyOn(mockedRoleUseCases, 'findById').mockResolvedValue(roleMockExpect);
      jest.spyOn(mockedPermissionRepository, 'exists').mockResolvedValue(false);
      jest
        .spyOn(mockedPermissionRepository, 'create')
        .mockResolvedValue({ id: 'uuid', user: userMockExpect, role: roleMockExpect });

      const sut = await permissionUseCase.create({ userId: 'uuidUser', roleId: 'uuidRole' });

      expect(sut).toEqual(permissionExpect);
    });

    test('Should return BadRequestError if permission already exists', async () => {
      jest.spyOn(mockedPermissionRepository, 'exists').mockResolvedValue(true);

      await expect(
        permissionUseCase.create({ userId: 'uuidUser', roleId: 'uuidRole' }),
      ).rejects.toEqual(
        new BadRequestError(`The permission you are trying to register already exists`),
      );
    });

    test('Should return NotFoundError if userId is not found', async () => {
      jest.spyOn(mockedPermissionRepository, 'exists').mockResolvedValue(false);
      jest
        .spyOn(mockedUserUseCases, 'findById')
        .mockRejectedValue(new NotFoundError('Not found user with id uuidUser'));

      await expect(
        permissionUseCase.create({ userId: 'uuidUser', roleId: 'uuidRole' }),
      ).rejects.toEqual(new NotFoundError(`Not found user with id uuidUser`));
    });

    test('Should return NotFoundError if roleId is not found', async () => {
      const userMockExpect = { id: 'uuidUser', name: 'John Doe', email: 'johnDoe@email.com' };
      jest.spyOn(mockedUserUseCases, 'findById').mockResolvedValue(userMockExpect);
      jest.spyOn(mockedPermissionRepository, 'exists').mockResolvedValue(false);
      jest
        .spyOn(mockedRoleUseCases, 'findById')
        .mockRejectedValue(new NotFoundError('Role not found with id uuidRole'));

      await expect(
        permissionUseCase.create({ userId: 'uuidUser', roleId: 'uuidRole' }),
      ).rejects.toEqual(new NotFoundError(`Role not found with id uuidRole`));
    });

    test('It should return an error if an error occurs when calling the repository', async () => {
      const userMockExpect = { id: 'uuidUser', name: 'John Doe', email: 'johnDoe@email.com' };
      const roleMockExpect = { id: 'uuidRole', name: 'admin' };

      jest.spyOn(mockedUserUseCases, 'findById').mockResolvedValue(userMockExpect);
      jest.spyOn(mockedRoleUseCases, 'findById').mockResolvedValue(roleMockExpect);
      jest.spyOn(mockedPermissionRepository, 'exists').mockResolvedValue(false);
      jest
        .spyOn(mockedPermissionRepository, 'create')
        .mockRejectedValue(new InternalServerError('Any string'));

      await expect(
        permissionUseCase.create({ userId: 'uuidUser', roleId: 'uuidRole' }),
      ).rejects.toEqual(
        new InternalServerError('An unexpected error has occurred. Please try again later.'),
      );
    });
  });

  //Exists tests
  describe('Function exists tests', () => {
    test('It should return true when exists permission', async () => {
      jest.spyOn(mockedPermissionRepository, 'exists').mockResolvedValue(true);

      const sut = await permissionUseCase.exists('userId', 'roleId');
      expect(sut).toEqual(true);
    });

    test('It should return false when not found permission', async () => {
      jest.spyOn(mockedPermissionRepository, 'exists').mockResolvedValue(false);

      const sut = await permissionUseCase.exists('userId', 'roleId');
      expect(sut).toEqual(false);
    });

    test('It should return InternalServerError when unexpected error', async () => {
      jest.spyOn(mockedPermissionRepository, 'exists').mockRejectedValue(new Error('Any string'));
      await expect(permissionUseCase.exists('uuidUser', 'uuidRole')).rejects.toEqual(
        new InternalServerError('An unexpected error has occurred. Please try again later.'),
      );
    });
  });

  // FindById tests
  describe('Function FindById tests', () => {
    test('It should return a permission by id', async () => {
      const userMockExpect = { id: 'uuidUser', name: 'John Doe', email: 'johnDoe@email.com' };
      const roleMockExpect = { id: 'uuidRole', name: 'admin' };

      jest
        .spyOn(mockedPermissionRepository, 'findById')
        .mockResolvedValue({ id: 'uuid', user: userMockExpect, role: roleMockExpect });

      const sut = await permissionUseCase.findById('uuid');

      expect(sut).toEqual({ id: 'uuid', user: userMockExpect, role: roleMockExpect });
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
      const userMockExpect = { id: 'uuidUser', name: 'John Doe', email: 'johnDoe@email.com' };
      const roleMockExpect = { id: 'uuidRole', name: 'admin' };

      const permissionAdminExpect = { id: 'uuid', user: userMockExpect, role: roleMockExpect };
      const permissionUserExpect = { id: 'uuid', user: userMockExpect, role: roleMockExpect };

      jest
        .spyOn(mockedPermissionRepository, 'findByUserId')
        .mockResolvedValue([permissionAdminExpect, permissionUserExpect]);

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

  // FindByUserEmail tests
  describe('Function FindByUserEmail tests', () => {
    test('It should return a permission by user email', async () => {
      const userMockExpect = { id: 'uuidUser', name: 'John Doe', email: 'johnDoe@email.com' };
      const roleMockExpect = { id: 'uuidRole', name: 'admin' };

      const permissionAdminExpect = { id: 'uuid', user: userMockExpect, role: roleMockExpect };
      const permissionUserExpect = { id: 'uuid', user: userMockExpect, role: roleMockExpect };

      jest
        .spyOn(mockedPermissionRepository, 'findByUserEmail')
        .mockResolvedValue([permissionAdminExpect, permissionUserExpect]);

      const sut = await permissionUseCase.findByUserEmail('johnDoe@email.com');

      expect(sut).toEqual([permissionAdminExpect, permissionUserExpect]);
    });

    test('It should return an error when it does not find permission by email', async () => {
      jest.spyOn(mockedPermissionRepository, 'findByUserEmail').mockResolvedValue([]);

      await expect(permissionUseCase.findByUserEmail('johnDoe@email.com')).rejects.toEqual(
        new NotFoundError(`Not found permission with userEmail johnDoe@email.com`),
      );
    });

    test('Should return InternalServerError when an unexpected error occurs in the repository', async () => {
      jest.spyOn(mockedPermissionRepository, 'findByUserEmail').mockRejectedValue(new Error());

      await expect(permissionUseCase.findByUserEmail('johnDoe@email.com')).rejects.toEqual(
        new InternalServerError(`An unexpected error has occurred. Please try again later.`),
      );
    });
  });

  // FindByRoleId tests
  describe('Function FindByRoleId tests', () => {
    test('It should return a permission by role id', async () => {
      const userMockExpect = { id: 'uuidUser', name: 'John Doe', email: 'johnDoe@email.com' };
      const roleMockExpect = { id: 'uuidRole', name: 'admin' };

      const permissionAdminExpect = { id: 'uuid', user: userMockExpect, role: roleMockExpect };
      const permissionUserExpect = { id: 'uuid', user: userMockExpect, role: roleMockExpect };

      jest
        .spyOn(mockedPermissionRepository, 'findByRoleId')
        .mockResolvedValue([permissionAdminExpect, permissionUserExpect]);

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
      const userMockExpect = { id: 'uuidUser', name: 'John Doe', email: 'johnDoe@email.com' };
      const roleMockExpect = { id: 'uuidRole', name: 'admin' };

      jest
        .spyOn(mockedPermissionRepository, 'findById')
        .mockResolvedValue({ id: 'uuid', user: userMockExpect, role: roleMockExpect });
      jest.spyOn(mockedPermissionRepository, 'delete').mockResolvedValue(true);

      await permissionUseCase.delete('uuid');

      expect(mockedPermissionRepository.delete).toHaveBeenCalledWith('uuid');
    });

    test('It should return an error when it does not find permission by id', async () => {
      jest
        .spyOn(mockedPermissionRepository, 'findById')
        .mockRejectedValue(new NotFoundError('Not found permission with id uuid'));

      await expect(permissionUseCase.delete('uuid')).rejects.toEqual(
        new NotFoundError(`Not found permission with id uuid`),
      );
    });

    test('Should return InternalServerError when an unexpected error occurs in the repository', async () => {
      const userMockExpect = { id: 'uuidUser', name: 'John Doe', email: 'johnDoe@email.com' };
      const roleMockExpect = { id: 'uuidRole', name: 'admin' };

      jest
        .spyOn(mockedPermissionRepository, 'findById')
        .mockResolvedValue({ id: 'uuid', user: userMockExpect, role: roleMockExpect });

      jest.spyOn(mockedPermissionRepository, 'delete').mockRejectedValue(new Error());

      await expect(permissionUseCase.delete('uuid')).rejects.toEqual(
        new InternalServerError(`An unexpected error has occurred. Please try again later.`),
      );
    });
  });
});
