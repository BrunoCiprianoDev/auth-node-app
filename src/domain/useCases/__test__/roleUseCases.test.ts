import { IRoleRepository } from '@src/domain/interfaces/repositories/roleRepository';
import { IRoleUseCases, RoleUseCases } from '../roleUseCases';
import { InternalServerError, NotFoundError } from '@src/domain/util/errors/appErrors';

describe('RoleUseCases tests', () => {
  let mockedRoleRepository: jest.Mocked<IRoleRepository>;
  let roleUseCases: IRoleUseCases;

  beforeAll(() => {
    mockedRoleRepository = {
      findByName: jest.fn(),
    };

    roleUseCases = new RoleUseCases(mockedRoleRepository);
  });

  describe('FindByName tests', () => {
    test('Should return Role by name successfully', async () => {
      const roleExpected = { id: '2f9fb62d-ddc6-41c0-9d4b-4c66ddc725a8', name: 'admin' };

      jest.spyOn(mockedRoleRepository, 'findByName').mockResolvedValue(roleExpected);

      const sut = await roleUseCases.findByName('admin');

      expect(sut).toEqual({ id: '2f9fb62d-ddc6-41c0-9d4b-4c66ddc725a8', name: 'admin' });
    });

    test('It should return NotFoundError when it does not find role by name', async () => {
      jest.spyOn(mockedRoleRepository, 'findByName').mockResolvedValue(null);

      await expect(roleUseCases.findByName('admin')).rejects.toEqual(
        new NotFoundError(`Role not found by name`),
      );
    });

    test('It should return NotFoundError when a unexpected error ocurred', async () => {
      jest.spyOn(mockedRoleRepository, 'findByName').mockRejectedValue(new Error('Any string'));

      await expect(roleUseCases.findByName('admin')).rejects.toEqual(
        new InternalServerError(`An unexpected error has occurred. Please try again later.`),
      );
    });
  });
});
