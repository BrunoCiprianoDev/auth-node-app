import { IAuthUseCases } from '@src/domain/useCases/auth/authUseCase';
import { IHttpContext } from '../../adapters/httpContext';
import { AuthController, IAuthController } from '../auth/authController';
import { BadRequestError } from '@src/domain/util/errors/appErrors';

describe('AuthControllers tests', () => {
  let mockedAuthUseCase: jest.Mocked<IAuthUseCases>;
  let mockedHttpContext: jest.Mocked<IHttpContext>;
  let authController: IAuthController;

  beforeAll(() => {
    mockedAuthUseCase = {
      createUserWithStandardPermission: jest.fn(),
      createUserWithAdminPermission: jest.fn(),
      createUserWithAllPermissions: jest.fn(),
      authUser: jest.fn(),
    };

    mockedHttpContext = {
      getRequest: jest.fn(),
      send: jest.fn(),
    };

    authController = new AuthController(mockedAuthUseCase);
  });

  describe('CreateStandard tests', () => {
    test('Should return a user created and status code 200', async () => {
      const userExpect = {
        id: 'userId',
        name: 'John Doe',
        email: 'johndoe@email.com',
        password: 'passwordEncrypted',
      };

      jest.spyOn(mockedAuthUseCase, 'createUserWithStandardPermission').mockResolvedValue(userExpect);

      (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
        headers: { any: '' },
        body: {
          name: 'John Doe',
          email: 'johndoe@email.com',
          password: 'passwordEncrypted',
        },
      });

      await authController.createUserWithStandardPermission(mockedHttpContext);

      expect(mockedHttpContext.send).toHaveBeenCalledWith({
        statusCode: 201,
        body: userExpect,
      });
    });

    test('Should return status error and message', async () => {
      jest
        .spyOn(mockedAuthUseCase, 'createUserWithStandardPermission')
        .mockRejectedValue(new BadRequestError('Error message'));

      (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
        headers: { any: '' },
        body: {
          name: 'John Doe',
          email: 'johndoe@email.com',
          password: 'passwordEncrypted',
        },
      });

      await authController.createUserWithStandardPermission(mockedHttpContext);

      expect(mockedHttpContext.send).toHaveBeenCalledWith({
        statusCode: 400,
        body: { message: 'Error message' },
      });
    });

    test('Should return status 500 when unesxpected error occur', async () => {
      jest.spyOn(mockedAuthUseCase, 'createUserWithStandardPermission').mockRejectedValue(new Error('Error message'));

      (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
        headers: { any: '' },
        body: {
          name: 'John Doe',
          email: 'johndoe@email.com',
          password: 'passwordEncrypted',
        },
      });

      await authController.createUserWithStandardPermission(mockedHttpContext);

      expect(mockedHttpContext.send).toHaveBeenCalledWith({
        statusCode: 500,
        body: { message: 'Unexpected error occurred' },
      });
    });

    test(`Should treat attributes not found as ''`, async () => {
      (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
        headers: { any: '' },
        body: {},
      });

      await authController.createUserWithStandardPermission(mockedHttpContext);

      expect(mockedAuthUseCase.createUserWithStandardPermission).toHaveBeenCalledWith({
        name: '',
        email: '',
        password: '',
      });
    });
  });

  describe('CreateAdmin tests', () => {
    test('Should return a user created and status code 200', async () => {
      const userExpect = {
        id: 'userId',
        name: 'John Doe',
        email: 'johndoe@email.com',
        password: 'passwordEncrypted',
      };

      jest.spyOn(mockedAuthUseCase, 'createUserWithAdminPermission').mockResolvedValue(userExpect);

      (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
        headers: { any: '' },
        body: {
          name: 'John Doe',
          email: 'johndoe@email.com',
          password: 'passwordEncrypted',
        },
      });

      await authController.createUserWithAdminPermission(mockedHttpContext);

      expect(mockedHttpContext.send).toHaveBeenCalledWith({
        statusCode: 201,
        body: userExpect,
      });
    });

    test('Should return status error and message', async () => {
      jest
        .spyOn(mockedAuthUseCase, 'createUserWithAdminPermission')
        .mockRejectedValue(new BadRequestError('Error message'));

      (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
        headers: { any: '' },
        body: {
          name: 'John Doe',
          email: 'johndoe@email.com',
          password: 'passwordEncrypted',
        },
      });

      await authController.createUserWithAdminPermission(mockedHttpContext);

      expect(mockedHttpContext.send).toHaveBeenCalledWith({
        statusCode: 400,
        body: { message: 'Error message' },
      });
    });
  });

  describe('CreateSuperUser tests', () => {
    test('Should return a user created and status code 200', async () => {
      const userExpect = {
        id: 'userId',
        name: 'John Doe',
        email: 'johndoe@email.com',
        password: 'passwordEncrypted',
      };

      jest.spyOn(mockedAuthUseCase, 'createUserWithAllPermissions').mockResolvedValue(userExpect);

      (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
        headers: { any: '' },
        body: {
          name: 'John Doe',
          email: 'johndoe@email.com',
          password: 'passwordEncrypted',
        },
      });

      await authController.createUserWithAllPermissions(mockedHttpContext);

      expect(mockedHttpContext.send).toHaveBeenCalledWith({
        statusCode: 201,
        body: userExpect,
      });
    });

    test('Should return status error and message', async () => {
      jest
        .spyOn(mockedAuthUseCase, 'createUserWithAllPermissions')
        .mockRejectedValue(new BadRequestError('Error message'));

      (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
        headers: { any: '' },
        body: {
          name: 'John Doe',
          email: 'johndoe@email.com',
          password: 'passwordEncrypted',
        },
      });

      await authController.createUserWithAllPermissions(mockedHttpContext);

      expect(mockedHttpContext.send).toHaveBeenCalledWith({
        statusCode: 400,
        body: { message: 'Error message' },
      });
    });
  });

  describe('AuthUser tests', () => {
    test('Should return a tokenPayload in body response', async () => {
      const tokenResponse = {
        userName: 'John Doe',
        userEmail: 'johndoe@email.com',
        roles: ['ADMIN', 'STANDARD'],
        token: 'StringTokenPayloadValue',
      };

      jest.spyOn(mockedAuthUseCase, 'authUser').mockResolvedValue(tokenResponse);

      (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
        headers: { any: '' },
        body: {
          email: 'johndoe@email.com',
          password: 'passwordEncrypted',
        },
      });

      await authController.authUser(mockedHttpContext);

      expect(mockedHttpContext.send).toHaveBeenCalledWith({
        statusCode: 200,
        body: tokenResponse,
      });
    });

    test('Should return a message and status when something Error ocurr', async () => {
      jest.spyOn(mockedAuthUseCase, 'authUser').mockRejectedValue(new BadRequestError('Error message'));

      (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
        headers: { any: '' },
        body: {
          email: 'johndoe@email.com',
          password: 'passwordEncrypted',
        },
      });

      await authController.authUser(mockedHttpContext);

      expect(mockedHttpContext.send).toHaveBeenCalledWith({
        statusCode: 400,
        body: { message: 'Error message' },
      });
    });

    test(`Should treat attributes not found as ''`, async () => {
      (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
        headers: { any: '' },
        body: {},
      });

      await authController.authUser(mockedHttpContext);

      expect(mockedAuthUseCase.authUser).toHaveBeenCalledWith({ email: '', password: '' });
    });
  });
});
