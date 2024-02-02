import { InternalServerError } from '@src/domain/util/errors/appErrors';
import { AuthUseCases, IAuthUseCases } from '../../auth/authUseCase';
import { IPermissionUseCases } from '../../auth/permissionUseCases';
import { IUserUseCases } from '../../auth/userUseCases';
import { RoleEnum } from '@src/domain/entities/auth/role';

describe('AuthUseCases tests', () => {
  let mockedUserUseCases: jest.Mocked<IUserUseCases>;
  let mockedPermissionUseCases: jest.Mocked<IPermissionUseCases>;
  let authUseCases: IAuthUseCases;

  beforeAll(() => {
    mockedUserUseCases = {
      create: jest.fn(),
    };

    mockedPermissionUseCases = {
      createPermissions: jest.fn(),
      existsPermissions: jest.fn(),
      findPermissionsByUser: jest.fn(),
      deletePermission: jest.fn(),
    };

    authUseCases = new AuthUseCases(mockedUserUseCases, mockedPermissionUseCases);
  });

  describe('CreateStandard tests', () => {
    test('Shoud create user with standard permission', async () => {
      const userExpected = {
        id: '5f4dcc3b5aa765d61d8327deb882cf99',
        name: 'John Doe',
        email: 'johndoe@email.com',
        password: '2f9fb62d-ddc6-41c0-9d4b-4c66ddc725a8',
      };

      const roleExpected = {
        id: '2f9fb62d-ddc6-41c0-9d4b-4c66ddc725a8',
        userId: '2f9fb62d-ddc6-41c0-9d4b-4c66ddc725a8',
        role: 'STANDARD',
      };

      jest.spyOn(mockedUserUseCases, 'create').mockResolvedValue(userExpected);
      jest.spyOn(mockedPermissionUseCases, 'createPermissions').mockResolvedValue([roleExpected]);

      const sut = await authUseCases.createStandard({
        name: 'John Doe',
        email: 'johndoe@email.com',
        password: '2f9fb62d-ddc6-41c0-9d4b-4c66ddc725a8',
      });

      expect(sut).toEqual(userExpected);
      expect(mockedUserUseCases.create).toHaveBeenCalledTimes(1);
      expect(mockedPermissionUseCases.createPermissions).toHaveBeenCalledWith([
        {
          userId: '5f4dcc3b5aa765d61d8327deb882cf99',
          role: RoleEnum.Standard,
        },
      ]);
    });

    test('Should return exception when a error ocorrus', async () => {
      jest.spyOn(mockedUserUseCases, 'create').mockRejectedValue(new Error('Any String'));

      await expect(
        authUseCases.createStandard({
          name: 'John Doe',
          email: 'johndoe@email.com',
          password: '2f9fb62d-ddc6-41c0-9d4b-4c66ddc725a8',
        }),
      ).rejects.toBeInstanceOf(InternalServerError);
    });
  });

  describe('CreateAdmin tests', () => {
    test('Shoud create user with admin permission', async () => {
      const userExpected = {
        id: '5f4dcc3b5aa765d61d8327deb882cf99',
        name: 'John Doe',
        email: 'johndoe@email.com',
        password: '2f9fb62d-ddc6-41c0-9d4b-4c66ddc725a8',
      };

      const roleExpected = {
        id: '2f9fb62d-ddc6-41c0-9d4b-4c66ddc725a8',
        userId: '2f9fb62d-ddc6-41c0-9d4b-4c66ddc725a8',
        role: 'ADMIN',
      };

      jest.spyOn(mockedUserUseCases, 'create').mockResolvedValue(userExpected);
      jest.spyOn(mockedPermissionUseCases, 'createPermissions').mockResolvedValue([roleExpected]);

      const sut = await authUseCases.createAdmin({
        name: 'John Doe',
        email: 'johndoe@email.com',
        password: '2f9fb62d-ddc6-41c0-9d4b-4c66ddc725a8',
      });

      expect(sut).toEqual(userExpected);
      expect(mockedUserUseCases.create).toHaveBeenCalledTimes(1);
      expect(mockedPermissionUseCases.createPermissions).toHaveBeenCalledWith([
        {
          userId: '5f4dcc3b5aa765d61d8327deb882cf99',
          role: RoleEnum.Admin,
        },
      ]);
    });

    describe('CreateSuperUser tests', () => {
      test('Shoud create user with admin and user permissions', async () => {
        const userExpected = {
          id: '5f4dcc3b5aa765d61d8327deb882cf99',
          name: 'John Doe',
          email: 'johndoe@email.com',
          password: '2f9fb62d-ddc6-41c0-9d4b-4c66ddc725a8',
        };

        const roleExpected = [
          {
            id: '2f9fb62d-ddc6-41c0-9d4b-4c66ddc725a8',
            userId: '2f9fb62d-ddc6-41c0-9d4b-4c66ddc725a8',
            role: 'ADMIN',
          },
          {
            id: '2f9fb62d-ddc6-41c0-9d4b-4c66ddc725a8',
            userId: '2f9fb62d-ddc6-41c0-9d4b-4c66ddc725a8',
            role: 'STANDARD',
          },
        ];

        jest.spyOn(mockedUserUseCases, 'create').mockResolvedValue(userExpected);
        jest.spyOn(mockedPermissionUseCases, 'createPermissions').mockResolvedValue(roleExpected);

        const sut = await authUseCases.createSuperUser({
          name: 'John Doe',
          email: 'johndoe@email.com',
          password: '2f9fb62d-ddc6-41c0-9d4b-4c66ddc725a8',
        });

        expect(sut).toEqual(userExpected);
        expect(mockedUserUseCases.create).toHaveBeenCalledTimes(1);
        expect(mockedPermissionUseCases.createPermissions).toHaveBeenCalledWith([
          {
            userId: '5f4dcc3b5aa765d61d8327deb882cf99',
            role: RoleEnum.Standard,
          },
          {
            userId: '5f4dcc3b5aa765d61d8327deb882cf99',
            role: RoleEnum.Admin,
          },
        ]);
      });
    });
  });
});
