import { IUserUseCases } from '@src/domain/useCases/auth/userUseCases';
import { IHttpContext } from '../../adapters/httpContext';
import { IUserController, UserController } from '../auth/userController';
import { BadRequestError } from '@src/domain/util/errors/appErrors';

describe('UserControllers tests', () => {
  let mockedUserUseCases: jest.Mocked<IUserUseCases>;
  let mockedHttpContext: jest.Mocked<IHttpContext>;
  let userController: IUserController;

  beforeAll(() => {
    mockedUserUseCases = {
      create: jest.fn(),
      comparePassword: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
    };

    mockedHttpContext = {
      getRequest: jest.fn(),
      send: jest.fn(),
    };

    userController = new UserController(mockedUserUseCases);
  });

  describe('FindById tests', () => {
    test('Should return a User by id', async () => {
      const userExpected = {
        id: 'userId',
        name: 'John Doe',
        email: 'johndoe@email.com',
      };

      jest.spyOn(mockedUserUseCases, 'findById').mockResolvedValue(userExpected);

      (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
        headers: { any: '' },
        params: { id: 'userId' },
      });

      await userController.findById(mockedHttpContext);

      expect(mockedHttpContext.send).toHaveBeenCalledWith({
        statusCode: 200,
        body: userExpected,
      });
      expect(mockedUserUseCases.findById).toHaveBeenCalledWith('userId');
    });

    test('Should return a NotFoundError message and status 400', async () => {
      jest.spyOn(mockedUserUseCases, 'findById').mockRejectedValue(new BadRequestError('User not found by id'));

      (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
        headers: { any: '' },
        params: { id: 'userId' },
      });

      await userController.findById(mockedHttpContext);

      expect(mockedHttpContext.send).toHaveBeenCalledWith({
        statusCode: 400,
        body: { message: 'User not found by id' },
      });
      expect(mockedUserUseCases.findById).toHaveBeenCalledWith('userId');
    });

    test('Must handle missing attributes', async () => {
      (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
        headers: { any: '' },
      });

      await userController.findById(mockedHttpContext);

      expect(mockedUserUseCases.findById).toHaveBeenCalledWith('');
    });
  });

  describe('FindAll tests', () => {
    test('Should return a list users', async () => {
      const usersExpected = [
        {
          id: 'userIdOne',
          name: 'John Doe',
          email: 'johndoe@email.com',
        },
        {
          id: 'userIdTwo',
          name: 'John Doe',
          email: 'johndoe@email.com',
        },
      ];

      jest.spyOn(mockedUserUseCases, 'findAll').mockResolvedValue(usersExpected);

      (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
        headers: { any: '' },
        query: {
          page: 1,
          size: 10,
          order: 'asc',
          contains: 'John',
        },
      });

      await userController.findAll(mockedHttpContext);

      expect(mockedHttpContext.send).toHaveBeenCalledWith({
        statusCode: 200,
        body: usersExpected,
      });
      expect(mockedUserUseCases.findAll).toHaveBeenCalledWith('John', {
        page: 1,
        size: 10,
        order: 'asc',
      });
    });

    test('Must handle missing attributes', async () => {
      (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
        headers: { any: '' },
      });

      await userController.findAll(mockedHttpContext);

      expect(mockedUserUseCases.findAll).toHaveBeenCalledWith('', {
        page: 0,
        size: 0,
        order: '',
      });
    });

    test('Should return InternalServerError when an unexpected error occurs', async () => {
      jest.spyOn(mockedUserUseCases, 'findAll').mockRejectedValue(new Error('AnyString'));

      (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
        headers: { any: '' },
      });

      await userController.findAll(mockedHttpContext);

      expect(mockedHttpContext.send).toHaveBeenCalledWith({
        statusCode: 500,
        body: { message: 'Unexpected error occurred' },
      });
    });
  });
});
