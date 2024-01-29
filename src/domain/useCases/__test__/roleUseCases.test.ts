import { IRoleRepository } from '@src/domain/interfaces/repositories/roleRepository';
import { RoleUseCases } from '../roleUseCases';
import { InternalServerError, NotFoundError } from '@src/domain/util/errors/appErrors';

describe('RoleUseCases tests', () => {
  let mockedRoleRepository: jest.Mocked<IRoleRepository>;
  let roleUseCases: RoleUseCases;

  beforeAll(() => {
    mockedRoleRepository = {
      findById: jest.fn(),
      findAll: jest.fn(),
    };

    roleUseCases = new RoleUseCases(mockedRoleRepository);
  });

  describe('Function FindById tests', () => {
    test('It should return a role by id', async () => {
      const roleExpected = { id: 'uuid', name: 'admin' };

      jest.spyOn(mockedRoleRepository, 'findById').mockResolvedValue(roleExpected);

      const sut = await roleUseCases.findById('uuid');

      expect(sut).toEqual(roleExpected);
    });

    test('It should return an error when it does not find role by id', async () => {
      jest.spyOn(mockedRoleRepository, 'findById').mockResolvedValue(null);

      await expect(roleUseCases.findById('uuid')).rejects.toEqual(
        new NotFoundError(`Role not found by id = uuid`),
      );
    });

    test('Should return InternalServerError when an unexpected error occurs in the repository', async () => {
      jest.spyOn(mockedRoleRepository, 'findById').mockRejectedValue(new Error());

      await expect(roleUseCases.findById('uuid')).rejects.toEqual(
        new InternalServerError(`An unexpected error has occurred. Please try again later.`),
      );
    });
  });

  describe('Function FindAll tests', () => {
    test('It should return a list roles', async () => {
      const roleOneExpected = { id: 'uuid1', name: 'admin' };
      const roleTwoExpected = { id: 'uuid2', name: 'user' };

      jest
        .spyOn(mockedRoleRepository, 'findAll')
        .mockResolvedValue([roleOneExpected, roleTwoExpected]);

      const sut = await roleUseCases.findAll();

      expect(sut.length).toEqual(2);
      expect(sut).toEqual([roleOneExpected, roleTwoExpected]);
    });

    test('Should return InternalServerError when an unexpected error occurs in the repository', async () => {
      jest.spyOn(mockedRoleRepository, 'findAll').mockRejectedValue(new Error());

      await expect(roleUseCases.findAll()).rejects.toEqual(
        new InternalServerError(`An unexpected error has occurred. Please try again later.`),
      );
    });
  });
});
