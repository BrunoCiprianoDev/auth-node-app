import { IRoleUseCases } from '@src/domain/useCases/roleUseCases';
import RoleController from '../roleController';
import { IHttpContext } from '../../adapters/httpContext';
import { InternalServerError, NotFoundError } from '@src/domain/util/errors/appErrors';

describe('RoleController tests', () => {
  let mockedRoleUseCases: jest.Mocked<IRoleUseCases>;
  let roleController: RoleController;
  let mockedHttpContext: jest.Mocked<IHttpContext>;

  beforeAll(() => {
    mockedRoleUseCases = {
      findAll: jest.fn(),
      findById: jest.fn(),
    };
    roleController = new RoleController(mockedRoleUseCases);
    mockedHttpContext = {
      getRequest: jest.fn(),
      send: jest.fn(),
    };
  });

  describe('Function FindById tests', () => {
    test('It should return a role by id with status code = 200', async () => {
      const serviceResponseExpected = { id: 'uuid', name: 'admin' };

      jest.spyOn(mockedRoleUseCases, 'findById').mockResolvedValue(serviceResponseExpected);

      (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
        headers: { any: '' },
        body: {},
        params: { id: 'uuid' },
        query: { any: '' },
      });

      await roleController.findById(mockedHttpContext);

      expect(mockedHttpContext.send).toHaveBeenCalledWith({
        statusCode: 200,
        body: serviceResponseExpected,
      });
    });

    test('Should return 404 when id is not provided', async () => {
      jest
        .spyOn(mockedRoleUseCases, 'findById')
        .mockRejectedValue(new NotFoundError(`Role not found by id = `));

      (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
        headers: { any: '' },
        body: {},
        query: { any: '' },
      });

      await roleController.findById(mockedHttpContext);

      expect(mockedHttpContext.send).toHaveBeenCalledWith({
        statusCode: 404,
        body: { message: `Role not found by id = ` },
      });
    });

    test('It should return 404 when it does not find role by id', async () => {
      jest
        .spyOn(mockedRoleUseCases, 'findById')
        .mockRejectedValue(new NotFoundError(`Role not found by id = uuid`));

      (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
        headers: { any: '' },
        body: {},
        params: { id: 'uuid' },
        query: { any: '' },
      });

      await roleController.findById(mockedHttpContext);

      expect(mockedHttpContext.send).toHaveBeenCalledWith({
        statusCode: 404,
        body: { message: `Role not found by id = uuid` },
      });
    });

    test('It should return InternalError when an unexpected error occurs', async () => {
      jest.spyOn(mockedRoleUseCases, 'findById').mockRejectedValue(new Error('Any string'));

      (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
        headers: { any: '' },
        body: {},
        params: { id: 'uuid' },
        query: { any: '' },
      });

      await roleController.findById(mockedHttpContext);

      expect(mockedHttpContext.send).toHaveBeenCalledWith({
        statusCode: 500,
        body: { message: `Unexpected error occurred.` },
      });
    });
  });

  describe('Function FindAll tests', () => {
    test('It should return a list role with status code = 200', async () => {
      const serviceResponseOneExpected = { id: 'uuid1', name: 'admin' };
      const serviceResponseTwoExpected = { id: 'uuid2', name: 'user' };

      jest
        .spyOn(mockedRoleUseCases, 'findAll')
        .mockResolvedValue([serviceResponseOneExpected, serviceResponseTwoExpected]);

      (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
        headers: { any: '' },
        body: {},
      });

      await roleController.findAll(mockedHttpContext);

      expect(mockedHttpContext.send).toHaveBeenCalledWith({
        statusCode: 200,
        body: [serviceResponseOneExpected, serviceResponseTwoExpected],
      });
    });

    test('It should return status 500 when an unexpected error occurs', async () => {
      jest
        .spyOn(mockedRoleUseCases, 'findAll')
        .mockRejectedValue(
          new InternalServerError('An unexpected error has occurred. Please try again later.'),
        );

      (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
        headers: { any: '' },
        body: {},
      });

      await roleController.findAll(mockedHttpContext);

      expect(mockedHttpContext.send).toHaveBeenCalledWith({
        statusCode: 500,
        body: { message: 'An unexpected error has occurred. Please try again later.' },
      });
    });
  });
});
