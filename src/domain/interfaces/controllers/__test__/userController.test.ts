import { IUserUseCases } from '@src/domain/useCases/userUseCases';
import UserController from '../userController';
import { IHttpContext } from '../../adapters/httpContext';
import { BadRequestError } from '@src/domain/util/errors/appErrors';

describe('UserController test', () => {
  let mockedUserUseCases: jest.Mocked<IUserUseCases>;
  let userController: UserController;
  let mockedHttpContext: jest.Mocked<IHttpContext>;

  beforeAll(() => {
    mockedUserUseCases = {
      createUser: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      updatePassword: jest.fn(),
      updateName: jest.fn(),
    };
    userController = new UserController(mockedUserUseCases);
    mockedHttpContext = {
      getRequest: jest.fn(),
      send: jest.fn(),
    };
  });

  describe('Function Create user tests', () => {
    test('Must create user successfully and return status code = 201', async () => {
      const responseExpected = {
        id: 'uuid',
        name: 'John Doe',
        email: 'johnDoe@email.com',
      };

      jest.spyOn(mockedUserUseCases, 'createUser').mockResolvedValue(responseExpected);

      (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
        headers: { any: '' },
        body: {
          name: 'John Doe',
          email: 'johnDoe@email.com',
          password: 'johnDoePass@!123',
          confirmPassword: 'johnDoePass@!123',
        },
      });

      await userController.create(mockedHttpContext);

      expect(mockedHttpContext.send).toHaveBeenCalledWith({
        statusCode: 201,
        body: responseExpected,
      });
    });

    test('Must return bad request when UserUseCase returns an error', async () => {
      jest
        .spyOn(mockedUserUseCases, 'createUser')
        .mockRejectedValue(new BadRequestError('Any string'));

      (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
        headers: { any: '' },
        body: {
          name: 'John Doe',
          email: 'johnDoe@email.com',
          password: 'johnDoePass@!123',
          confirmPassword: 'johnDoePass@!123',
        },
      });

      await userController.create(mockedHttpContext);

      expect(mockedHttpContext.send).toHaveBeenCalledWith({
        statusCode: 400,
        body: { message: `Any string` },
      });
    });

    test('It should return error 500 if an unexpected error occurs', async () => {
      jest.spyOn(mockedUserUseCases, 'createUser').mockRejectedValue(new Error('Unexpected'));

      (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
        headers: { any: '' },
        body: {
          name: 'John Doe',
          email: 'johnDoe@email.com',
          password: 'johnDoePass@!123',
          confirmPassword: 'johnDoePass@!123',
        },
      });

      await userController.create(mockedHttpContext);

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

      await userController.create(mockedHttpContext);

      expect(mockedUserUseCases.createUser).toHaveBeenCalledWith({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
    });
  });

  describe('FindById tests', () => {
    test('It should return a User by id with status code = 200', async () => {
      const serviceResponseExpected = {
        id: 'uuid',
        name: 'John Doe',
        email: 'johnDoe@email.com',
      };

      jest.spyOn(mockedUserUseCases, 'findById').mockResolvedValue(serviceResponseExpected);

      (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
        headers: { any: '' },
        body: {},
        params: { id: 'uuid' },
        query: { any: '' },
      });

      await userController.findById(mockedHttpContext);

      expect(mockedHttpContext.send).toHaveBeenCalledWith({
        statusCode: 200,
        body: serviceResponseExpected,
      });
    });

    test('Must handle entries when id param is not found', async () => {
      (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
        headers: { any: '' },
        body: {},
        query: { any: '' },
      });

      await userController.findById(mockedHttpContext);

      expect(mockedUserUseCases.findById).toHaveBeenCalledWith('');
    });

    test('Must return bad request when UserUseCase returns an error', async () => {
      jest.spyOn(mockedUserUseCases, 'findById').mockRejectedValue(new Error('Unexpected'));

      (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
        headers: { any: '' },
        body: {},
        params: { id: 'uuid' },
        query: { any: '' },
      });

      await userController.findById(mockedHttpContext);

      expect(mockedHttpContext.send).toHaveBeenCalledWith({
        statusCode: 500,
        body: { message: `Unexpected error occurred.` },
      });
    });
  });

  describe('FindByEmail tests', () => {
    test('It should return a User by email with status code = 200', async () => {
      const serviceResponseExpected = {
        id: 'uuid',
        name: 'John Doe',
        email: 'johnDoe@email.com',
      };

      jest.spyOn(mockedUserUseCases, 'findByEmail').mockResolvedValue(serviceResponseExpected);

      (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
        headers: { any: '' },
        body: {},
        params: { email: 'johnDoe@email.com' },
        query: { any: '' },
      });

      await userController.findByEmail(mockedHttpContext);

      expect(mockedHttpContext.send).toHaveBeenCalledWith({
        statusCode: 200,
        body: serviceResponseExpected,
      });
    });

    test('Must handle entries when email param is not found', async () => {
      (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
        headers: { any: '' },
        body: {},
        query: { any: '' },
      });

      await userController.findByEmail(mockedHttpContext);

      expect(mockedUserUseCases.findByEmail).toHaveBeenCalledWith('');
    });

    test('Must return bad request when UserUseCase returns an error', async () => {
      jest.spyOn(mockedUserUseCases, 'findByEmail').mockRejectedValue(new Error('Unexpected'));

      (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
        headers: { any: '' },
        body: {},
        params: { email: 'johnDoe@email.com' },
        query: { any: '' },
      });

      await userController.findByEmail(mockedHttpContext);

      expect(mockedHttpContext.send).toHaveBeenCalledWith({
        statusCode: 500,
        body: { message: `Unexpected error occurred.` },
      });
    });
  });

  // Update Password tests
  describe('UpdatePassword tests', () => {
    test('Must update password successfylly (status = 200)', async () => {
      const serviceResponseExpected = {
        id: 'uuid',
        name: 'John Doe',
        email: 'johnDoe@email.com',
      };

      jest.spyOn(mockedUserUseCases, 'updatePassword').mockResolvedValue(serviceResponseExpected);

      (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
        headers: { any: '' },
        body: {
          id: 'uuid',
          newPassword: 'johnDoePass@!123',
          confirmNewPassword: 'johnDoePass@!123',
        },
      });

      await userController.updatePassword(mockedHttpContext);

      expect(mockedHttpContext.send).toHaveBeenCalledWith({
        statusCode: 200,
        body: serviceResponseExpected,
      });
    });

    test('Must handle entries when some attribute is not found', async () => {
      (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
        headers: { any: '' },
        body: {},
      });

      await userController.updatePassword(mockedHttpContext);

      expect(mockedUserUseCases.updatePassword).toHaveBeenCalledWith('', '', '');
    });

    test('Must return bad request when UserUseCase returns an error', async () => {
      jest.spyOn(mockedUserUseCases, 'updatePassword').mockRejectedValue(new Error('Unexpected'));

      (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
        headers: { any: '' },
        body: {
          id: 'uuid',
          newPassword: 'johnDoePass@!123',
          confirmNewPassword: 'johnDoePass@!123',
        },
      });

      await userController.updatePassword(mockedHttpContext);

      expect(mockedHttpContext.send).toHaveBeenCalledWith({
        statusCode: 500,
        body: { message: `Unexpected error occurred.` },
      });
    });
  });

  // Update Name tests
  describe('UpdateName tests', () => {
    test('Must update name successfylly (status = 200)', async () => {
      const serviceResponseExpected = {
        id: 'uuid',
        name: 'John Doe',
        email: 'johnDoe@email.com',
        password: 'password',
      };

      jest.spyOn(mockedUserUseCases, 'updateName').mockResolvedValue(serviceResponseExpected);

      (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
        headers: { any: '' },
        body: {
          id: 'uuid',
          newName: 'newName',
        },
      });

      await userController.updateName(mockedHttpContext);

      expect(mockedHttpContext.send).toHaveBeenCalledWith({
        statusCode: 200,
        body: serviceResponseExpected,
      });
    });

    test('Must handle entries when some attribute is not found', async () => {
      (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
        headers: { any: '' },
        body: {},
      });

      await userController.updateName(mockedHttpContext);

      expect(mockedUserUseCases.updateName).toHaveBeenCalledWith('', '');
    });

    test('Must return bad request when UserUseCase returns an error', async () => {
      jest.spyOn(mockedUserUseCases, 'updateName').mockRejectedValue(new Error('Unexpected'));

      (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
        headers: { any: '' },
        body: {
          id: 'uuid',
          newName: 'newName',
        },
      });

      await userController.updateName(mockedHttpContext);

      expect(mockedHttpContext.send).toHaveBeenCalledWith({
        statusCode: 500,
        body: { message: `Unexpected error occurred.` },
      });
    });
  });
});
