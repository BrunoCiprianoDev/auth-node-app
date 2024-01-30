import { IPermissionUseCases } from '@src/domain/useCases/permissionUseCases';
import { PermissionController } from '../permissionController';
import { IHttpContext } from '../../adapters/httpContext';
import { NotFoundError } from '@src/domain/util/errors/appErrors';

describe('PermissionController test', () => {
  let mockedPermissionUseCases: jest.Mocked<IPermissionUseCases>;
  let permissionController: PermissionController;
  let mockedHttpContext: jest.Mocked<IHttpContext>;

  beforeAll(() => {
    mockedPermissionUseCases = {
      create: jest.fn(),
      exists: jest.fn(),
      findById: jest.fn(),
      findByRoleId: jest.fn(),
      findByUserId: jest.fn(),
      findByUserEmail: jest.fn(),
      delete: jest.fn(),
    };

    permissionController = new PermissionController(mockedPermissionUseCases);

    mockedHttpContext = {
      getRequest: jest.fn(),
      send: jest.fn(),
    };
  });

  //Create permission
  describe('Function create Permission tests', () => {
    test('It should create Permission and return status code 200', async () => {
      const userMockExpect = { id: 'uuidUser', name: 'John Doe', email: 'johnDoe@email.com' };
      const roleMockExpect = { id: 'uuidRole', name: 'admin' };
      const responseExpected = { id: 'uuid', user: userMockExpect, role: roleMockExpect };

      jest.spyOn(mockedPermissionUseCases, 'create').mockResolvedValue(responseExpected);

      (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
        headers: { any: '' },
        body: {
          id: 'uuid',
          userId: 'uuidUser',
          roleId: 'uuidRole',
        },
      });

      await permissionController.create(mockedHttpContext);

      expect(mockedHttpContext.send).toHaveBeenCalledWith({
        statusCode: 201,
        body: responseExpected,
      });
    });

    test('It should return error if an unexpected error occurs', async () => {
      jest.spyOn(mockedPermissionUseCases, 'create').mockRejectedValue(new Error('Unexpected'));

      (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
        headers: { any: '' },
        body: {
          id: 'uuid',
          userId: 'uuidUser',
          roleId: 'uuidRole',
        },
      });

      await permissionController.create(mockedHttpContext);

      expect(mockedHttpContext.send).toHaveBeenCalledWith({
        statusCode: 500,
        body: { message: `Unexpected error occurred.` },
      });
    });

    test('Must handle entries when some attribute is not found', async () => {
      (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
        headers: { any: '' },
        body: {},
      });

      await permissionController.create(mockedHttpContext);

      expect(mockedPermissionUseCases.create).toHaveBeenCalledWith({
        userId: '',
        roleId: '',
      });
    });
  });

  //FindById
  describe('Function FindById tests', () => {
    test('It should return a permission by id with status code = 200', async () => {
      const userMockExpect = { id: 'uuidUser', name: 'John Doe', email: 'johnDoe@email.com' };
      const roleMockExpect = { id: 'uuidRole', name: 'admin' };
      const responseExpected = { id: 'uuid', user: userMockExpect, role: roleMockExpect };

      jest.spyOn(mockedPermissionUseCases, 'findById').mockResolvedValue(responseExpected);

      (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
        headers: { any: '' },
        body: {},
        params: { id: 'uuid' },
        query: { any: '' },
      });

      await permissionController.findById(mockedHttpContext);

      expect(mockedHttpContext.send).toHaveBeenCalledWith({
        statusCode: 200,
        body: responseExpected,
      });
    });

    test('Should return 404 when id is not provided', async () => {
      jest
        .spyOn(mockedPermissionUseCases, 'findById')
        .mockRejectedValue(new NotFoundError(`Permission not found by id`));

      (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
        headers: { any: '' },
        body: {},
        query: { any: '' },
      });

      await permissionController.findById(mockedHttpContext);

      expect(mockedHttpContext.send).toHaveBeenCalledWith({
        statusCode: 404,
        body: { message: `Permission not found by id` },
      });
    });
  });

  //FindByUserId
  describe('Function FindByUserId tests', () => {
    test('It should return a permission by user id with status code = 200', async () => {
      const userMockExpect = { id: 'uuidUser', name: 'John Doe', email: 'johnDoe@email.com' };
      const roleMockExpect = { id: 'uuidRole', name: 'admin' };
      const responseExpected = { id: 'uuid', user: userMockExpect, role: roleMockExpect };

      jest.spyOn(mockedPermissionUseCases, 'findByUserId').mockResolvedValue([responseExpected]);

      (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
        headers: { any: '' },
        body: {},
        params: { id: 'uuid' },
        query: { any: '' },
      });

      await permissionController.findByUserId(mockedHttpContext);

      expect(mockedHttpContext.send).toHaveBeenCalledWith({
        statusCode: 200,
        body: [responseExpected],
      });
    });

    test('Should return 404 when id is not provided', async () => {
      jest
        .spyOn(mockedPermissionUseCases, 'findByUserId')
        .mockRejectedValue(new NotFoundError(`Permission not found by userId`));

      (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
        headers: { any: '' },
        body: {},
        query: { any: '' },
      });

      await permissionController.findByUserId(mockedHttpContext);

      expect(mockedHttpContext.send).toHaveBeenCalledWith({
        statusCode: 404,
        body: { message: `Permission not found by userId` },
      });
    });
  });

  //FindByRoleId
  describe('Function FindByRoleId tests', () => {
    test('It should return a permission by role id with status code = 200', async () => {
      const userMockExpect = { id: 'uuidUser', name: 'John Doe', email: 'johnDoe@email.com' };
      const roleMockExpect = { id: 'uuidRole', name: 'admin' };
      const responseExpected = { id: 'uuid', user: userMockExpect, role: roleMockExpect };

      jest.spyOn(mockedPermissionUseCases, 'findByRoleId').mockResolvedValue([responseExpected]);

      (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
        headers: { any: '' },
        body: {},
        params: { id: 'uuid' },
        query: { any: '' },
      });

      await permissionController.findByRoleId(mockedHttpContext);

      expect(mockedHttpContext.send).toHaveBeenCalledWith({
        statusCode: 200,
        body: [responseExpected],
      });
    });

    test('Should return 404 when id is not provided', async () => {
      jest
        .spyOn(mockedPermissionUseCases, 'findByRoleId')
        .mockRejectedValue(new NotFoundError(`Permission not found by roleId`));

      (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
        headers: { any: '' },
        body: {},
        query: { any: '' },
      });

      await permissionController.findByRoleId(mockedHttpContext);

      expect(mockedHttpContext.send).toHaveBeenCalledWith({
        statusCode: 404,
        body: { message: `Permission not found by roleId` },
      });
    });
  });

  //Delete
  describe('Function Delete tests', () => {
    test('It should delete a permission by role id with status code = 204', async () => {
      jest.spyOn(mockedPermissionUseCases, 'delete').mockResolvedValue();

      (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
        headers: { any: '' },
        body: {},
        params: { id: 'uuid' },
        query: { any: '' },
      });

      await permissionController.delete(mockedHttpContext);

      expect(mockedHttpContext.send).toHaveBeenCalledWith({
        statusCode: 204,
        body: {},
      });
    });

    test('Should return 404 when id is not provided', async () => {
      jest
        .spyOn(mockedPermissionUseCases, 'delete')
        .mockRejectedValue(new NotFoundError(`Permission not found by roleId`));

      (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
        headers: { any: '' },
        body: {},
        query: { any: '' },
      });

      await permissionController.delete(mockedHttpContext);

      expect(mockedHttpContext.send).toHaveBeenCalledWith({
        statusCode: 404,
        body: { message: `Permission not found by roleId` },
      });
    });
  });
});
