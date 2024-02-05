import { IPermissionUseCases } from '@src/domain/useCases/auth/permissionUseCases';
import { IHttpContext } from '../../adapters/httpContext';
import { IPermissionController, PermissionController } from '../auth/permissionController';

describe('PermissionController tests', () => {
  let mockedPermissionUseCase: jest.Mocked<IPermissionUseCases>;
  let mockedHttpContext: jest.Mocked<IHttpContext>;
  let permissionController: IPermissionController;

  beforeAll(() => {
    mockedPermissionUseCase = {
      createPermissions: jest.fn(),
      existsPermissions: jest.fn(),
      findPermissionsByUser: jest.fn(),
      deletePermission: jest.fn(),
    };

    mockedHttpContext = {
      getRequest: jest.fn(),
      send: jest.fn(),
    };

    permissionController = new PermissionController(mockedPermissionUseCase);
  });

  describe('CreatePermission tests', () => {
    test('Should return a permission created successfully', async () => {
      const permissionExpected = {
        id: 'uuid',
        userId: 'userId',
        role: 'ADMIN',
      };

      jest.spyOn(mockedPermissionUseCase, 'createPermissions').mockResolvedValue([permissionExpected]);

      (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
        headers: { any: '' },
        body: {
          userId: 'userId',
          role: 'ADMIN',
        },
      });

      await permissionController.createPermission(mockedHttpContext);

      expect(mockedHttpContext.send).toHaveBeenCalledWith({
        statusCode: 201,
        body: [
          {
            id: 'uuid',
            userId: 'userId',
            role: 'ADMIN',
          },
        ],
      });
      expect(mockedPermissionUseCase.createPermissions).toHaveBeenCalledWith([
        {
          userId: 'userId',
          role: 'ADMIN',
        },
      ]);
    });

    test('Must handle errors occurring in the request', async () => {
      jest.spyOn(mockedPermissionUseCase, 'createPermissions').mockRejectedValue(new Error('Any string'));

      (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
        headers: { any: '' },
        body: {
          userId: 'userId',
          role: 'ADMIN',
        },
      });

      await permissionController.createPermission(mockedHttpContext);

      expect(mockedHttpContext.send).toHaveBeenCalledWith({
        statusCode: 500,
        body: { message: 'Unexpected error occurred' },
      });
      expect(mockedPermissionUseCase.createPermissions).toHaveBeenCalledWith([
        {
          userId: 'userId',
          role: 'ADMIN',
        },
      ]);
    });

    test('Should handle uniformed attributes', async () => {
      (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
        headers: { any: '' },
        body: {},
      });

      await permissionController.createPermission(mockedHttpContext);

      expect(mockedPermissionUseCase.createPermissions).toHaveBeenCalledWith([
        {
          userId: '',
          role: '',
        },
      ]);
    });
  });

  describe('FindPermissionsByUser tests', () => {
    test('Should return list Permissions by user Id', async () => {
      const permissionExpected = [
        {
          id: 'uuid',
          userId: 'userId',
          role: 'ADMIN',
        },
      ];

      jest.spyOn(mockedPermissionUseCase, 'findPermissionsByUser').mockResolvedValue(permissionExpected);

      (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
        headers: { any: '' },
        body: {},
        params: { userId: 'userId' },
      });

      await permissionController.findPermissionsByUser(mockedHttpContext);

      expect(mockedHttpContext.send).toHaveBeenCalledWith({
        statusCode: 200,
        body: [
          {
            id: 'uuid',
            userId: 'userId',
            role: 'ADMIN',
          },
        ],
      });
      expect(mockedPermissionUseCase.findPermissionsByUser).toHaveBeenCalledWith('userId');
    });

    test('Should handle uniformed attributes', async () => {
      (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
        headers: { any: '' },
        body: {},
      });

      await permissionController.findPermissionsByUser(mockedHttpContext);

      expect(mockedPermissionUseCase.findPermissionsByUser).toHaveBeenCalledWith('');
    });

    test('Must handle errors occurring in the request', async () => {
      jest.spyOn(mockedPermissionUseCase, 'findPermissionsByUser').mockRejectedValue(new Error('Any string'));

      (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
        headers: { any: '' },
        body: {},
        params: { userId: 'userId' },
      });

      await permissionController.findPermissionsByUser(mockedHttpContext);

      expect(mockedHttpContext.send).toHaveBeenCalledWith({
        statusCode: 500,
        body: { message: 'Unexpected error occurred' },
      });
    });
  });

  describe('DeletePermission tests', () => {
    test('Should delete a permission by userId and role', async () => {
      jest.spyOn(mockedPermissionUseCase, 'deletePermission').mockResolvedValue();

      (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
        headers: { any: '' },
        body: { userId: 'userId', role: 'STANDARD' },
      });

      await permissionController.deletePermission(mockedHttpContext);

      expect(mockedHttpContext.send).toHaveBeenCalledWith({
        statusCode: 204,
        body: {},
      });
      expect(mockedPermissionUseCase.deletePermission).toHaveBeenCalledWith('userId', 'STANDARD');
    });

    test('Should handle uniformed attributes', async () => {
      (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
        headers: { any: '' },
        body: {},
      });

      await permissionController.deletePermission(mockedHttpContext);

      expect(mockedPermissionUseCase.deletePermission).toHaveBeenCalledWith('', '');
    });

    test('Must handle errors occurring in the request', async () => {
      jest.spyOn(mockedPermissionUseCase, 'deletePermission').mockRejectedValue(new Error('Any string'));

      (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
        headers: { any: '' },
        body: { userId: 'userId', role: 'STANDARD' },
      });

      await permissionController.deletePermission(mockedHttpContext);

      expect(mockedHttpContext.send).toHaveBeenCalledWith({
        statusCode: 500,
        body: { message: 'Unexpected error occurred' },
      });
    });
  });
});
