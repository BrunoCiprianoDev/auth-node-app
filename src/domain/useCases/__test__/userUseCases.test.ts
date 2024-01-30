import { IUserRepository } from '@src/domain/interfaces/repositories/userRepository';
import { UserUseCases } from '../userUseCases';
import { IPasswordEncryptor } from '@src/domain/interfaces/adapters/passwordEncryptor';
import {
  BadRequestError,
  InternalServerError,
  NotFoundError,
} from '@src/domain/util/errors/appErrors';

describe('UserUseCases tests', () => {
  let mockedUserRepository: jest.Mocked<IUserRepository>;
  let mockedIPasswordEncryptor: jest.Mocked<IPasswordEncryptor>;
  let userUseCases: UserUseCases;

  beforeAll(() => {
    mockedUserRepository = {
      createUser: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      updatePassword: jest.fn(),
      updateName: jest.fn(),
    };

    mockedIPasswordEncryptor = {
      encryptor: jest.fn(),
      passwordCompare: jest.fn(),
    };

    userUseCases = new UserUseCases(mockedUserRepository, mockedIPasswordEncryptor);
  });

  //CreateUser tests
  describe('CreateUser tests', () => {
    test('Must create user successfully', async () => {
      const userExpected = {
        id: 'uuid',
        name: 'John Doe',
        email: 'johnDoe@email.com',
        password: 'johnDoePass',
      };

      jest.spyOn(mockedIPasswordEncryptor, 'encryptor').mockResolvedValue('passwordHash');
      jest.spyOn(mockedUserRepository, 'findByEmail').mockResolvedValue(null);
      jest.spyOn(mockedUserRepository, 'createUser').mockResolvedValue(userExpected);

      const sut = await userUseCases.createUser({
        name: 'John Doe',
        email: 'johnDoe@email.com',
        password: 'johnDoePass@!123',
        confirmPassword: 'johnDoePass@!123',
      });

      expect(sut.name).toEqual(userExpected.name);
      expect(sut.email).toEqual(userExpected.email);
      expect(mockedIPasswordEncryptor.encryptor).toHaveBeenCalledWith('johnDoePass@!123');
      expect(sut.id).toEqual('uuid');
    });

    test('Should return BadRequestError when email is invalid', async () => {
      await expect(
        userUseCases.createUser({
          name: 'John Doe',
          email: 'email',
          password: 'johnDoePass@!123',
          confirmPassword: 'johnDoePass@!123',
        }),
      ).rejects.toEqual(new BadRequestError(`Invalid email`));
    });

    test('It should return an error if the password does not match confirm password', async () => {
      await expect(
        userUseCases.createUser({
          name: '',
          email: 'johnDoe@email.com',
          password: 'johnDoePass@!123',
          confirmPassword: '',
        }),
      ).rejects.toEqual(
        new BadRequestError(
          `Passwords do not match. Please make sure the password and confirm password are identical.`,
        ),
      );
    });

    test('Should return BadRequestError when password is invalid', async () => {
      await expect(
        userUseCases.createUser({
          name: 'John Doe',
          email: 'johnDoe@email.com',
          password: 'password',
          confirmPassword: 'password',
        }),
      ).rejects.toEqual(
        new BadRequestError(
          `The password is invalid. It must be at least 8 characters long and contain at least 2 special characters.`,
        ),
      );
    });

    test('Should return BadRequestError when name is invalid', async () => {
      await expect(
        userUseCases.createUser({
          name: '',
          email: 'johnDoe@email.com',
          password: 'johnDoePass@!123',
          confirmPassword: 'johnDoePass@!123',
        }),
      ).rejects.toEqual(new BadRequestError(`Invalid name`));
    });

    test('Should return BadRequestError when email exists', async () => {
      const userExpected = {
        id: 'uuid',
        name: 'John Doe',
        email: 'johnDoe@email.com',
        password: 'johnDoePass',
      };

      jest.spyOn(mockedUserRepository, 'findByEmail').mockResolvedValue(userExpected);

      await expect(
        userUseCases.createUser({
          name: 'John Doe',
          email: 'johnDoe@email.com',
          password: 'johnDoePass@!123',
          confirmPassword: 'johnDoePass@!123',
        }),
      ).rejects.toEqual(
        new BadRequestError(`There is already a registered user with email(johnDoe@email.com)`),
      );
    });

    test('Should return InternalServerError when an error occurs in the repository when calling findByEmail', async () => {
      jest.spyOn(mockedUserRepository, 'findByEmail').mockRejectedValue(new Error());

      await expect(
        userUseCases.createUser({
          name: 'John Doe',
          email: 'johnDoe@email.com',
          password: 'johnDoePass@!123',
          confirmPassword: 'johnDoePass@!123',
        }),
      ).rejects.toEqual(
        new InternalServerError(`An unexpected error has occurred. Please try again later.`),
      );
    });

    test('Should return InternalServerError when an error occurs in the repository when calling findCreateUser', async () => {
      jest.spyOn(mockedIPasswordEncryptor, 'encryptor').mockResolvedValue('passwordHash');
      jest.spyOn(mockedUserRepository, 'findByEmail').mockResolvedValue(null);
      jest.spyOn(mockedUserRepository, 'createUser').mockRejectedValue(new Error());

      await expect(
        userUseCases.createUser({
          name: 'John Doe',
          email: 'johnDoe@email.com',
          password: 'johnDoePass@!123',
          confirmPassword: 'johnDoePass@!123',
        }),
      ).rejects.toEqual(
        new InternalServerError(`An unexpected error has occurred. Please try again later.`),
      );
    });

    test('Should return InternalServerError when an error occurs in the PasswordEncryptor when calling encryptor', async () => {
      jest.spyOn(mockedIPasswordEncryptor, 'encryptor').mockRejectedValue(new Error());
      jest.spyOn(mockedUserRepository, 'findByEmail').mockResolvedValue(null);

      await expect(
        userUseCases.createUser({
          name: 'John Doe',
          email: 'johnDoe@email.com',
          password: 'johnDoePass@!123',
          confirmPassword: 'johnDoePass@!123',
        }),
      ).rejects.toEqual(
        new InternalServerError(`An unexpected error has occurred. Please try again later.`),
      );
    });
  });

  //FindById tests
  describe('FindById tests', () => {
    test('Must return user by id', async () => {
      const userExpected = {
        id: 'uuid',
        name: 'John Doe',
        email: 'johnDoe@email.com',
        password: 'johnDoePass',
      };

      jest.spyOn(mockedUserRepository, 'findById').mockResolvedValue(userExpected);

      const sut = await userUseCases.findById('uuid');

      expect(sut).toEqual({
        id: 'uuid',
        name: 'John Doe',
        email: 'johnDoe@email.com',
      });
    });

    test('should return NotFoundError if it does not find the user by id', async () => {
      jest.spyOn(mockedUserRepository, 'findById').mockResolvedValue(null);

      await expect(userUseCases.findById('uuid')).rejects.toEqual(
        new NotFoundError(`Not found user with id uuid`),
      );
    });

    test('Should return InternalServerError if the repository returns an error', async () => {
      jest.spyOn(mockedUserRepository, 'findById').mockRejectedValue(new Error('Any'));

      await expect(userUseCases.findById('uuid')).rejects.toEqual(
        new InternalServerError(`An unexpected error has occurred. Please try again later.`),
      );
    });

    //FindByEmail tests
    describe('FindByEmail tests', () => {
      test('Must return user by email', async () => {
        const userExpected = {
          id: 'uuid',
          name: 'John Doe',
          email: 'johnDoe@email.com',
          password: 'johnDoePass',
        };

        jest.spyOn(mockedUserRepository, 'findByEmail').mockResolvedValue(userExpected);

        const sut = await userUseCases.findByEmail('johnDoe@email.com');

        expect(sut).toEqual({
          id: 'uuid',
          name: 'John Doe',
          email: 'johnDoe@email.com',
        });
      });

      test('should return NotFoundError if it does not find the user by email', async () => {
        jest.spyOn(mockedUserRepository, 'findByEmail').mockResolvedValue(null);

        await expect(userUseCases.findByEmail('johnDoe@email.com')).rejects.toEqual(
          new NotFoundError(`Not found user with email johnDoe@email.com`),
        );
      });

      test('Should return InternalServerError if the repository returns an error', async () => {
        jest.spyOn(mockedUserRepository, 'findByEmail').mockRejectedValue(new Error('Any'));

        await expect(userUseCases.findByEmail('johnDoe@email.com')).rejects.toEqual(
          new InternalServerError(`An unexpected error has occurred. Please try again later.`),
        );
      });
    });

    //UpdatePassword tests
    describe('UpdatePassword Tests', () => {
      test('Must update password successfully', async () => {
        const userExpected = {
          id: 'uuid',
          name: 'John Doe',
          email: 'johnDoe@email.com',
          password: 'johnDoePass',
        };

        jest.spyOn(mockedUserRepository, 'findById').mockResolvedValue(userExpected);
        jest.spyOn(mockedUserRepository, 'updatePassword').mockResolvedValue(userExpected);

        const sut = await userUseCases.updatePassword(
          'uuid',
          'johnDoePass@!123',
          'johnDoePass@!123',
        );

        expect(sut).toEqual({
          id: 'uuid',
          name: 'John Doe',
          email: 'johnDoe@email.com',
        });
      });

      test('It should return an error if the password does not match confirm password', async () => {
        await expect(
          userUseCases.updatePassword('uuid', 'johnDoePass@!123', 'anyString'),
        ).rejects.toEqual(
          new BadRequestError(
            `Passwords do not match. Please make sure the password and confirm password are identical.`,
          ),
        );
      });

      test('It should return an error if the password is invalid', async () => {
        await expect(
          userUseCases.updatePassword('uuid', 'johnDoePass', 'johnDoePass'),
        ).rejects.toEqual(
          new BadRequestError(
            `The password is invalid. It must be at least 8 characters long and contain at least 2 special characters.`,
          ),
        );
      });

      test('Must return NotFoundError when not finding user by id', async () => {
        jest.spyOn(mockedUserRepository, 'findById').mockResolvedValue(null);
        await expect(
          userUseCases.updatePassword('uuid', 'johnDoePass@!123', 'johnDoePass@!123'),
        ).rejects.toEqual(new NotFoundError(`Unable to update password. User not found.`));
      });

      test('Should return InternalServerError if the repository returns an error', async () => {
        jest.spyOn(mockedUserRepository, 'findById').mockRejectedValue(new Error('Any'));

        await expect(
          userUseCases.updatePassword('uuid', 'johnDoePass@!123', 'johnDoePass@!123'),
        ).rejects.toEqual(
          new InternalServerError(`An unexpected error has occurred. Please try again later.`),
        );
      });
    });

    describe('UpdateName Tests', () => {
      test('Must update name successfully', async () => {
        const userExpected = {
          id: 'uuid',
          name: 'newName',
          email: 'johnDoe@email.com',
          password: 'johnDoePass',
        };

        jest.spyOn(mockedUserRepository, 'findById').mockResolvedValue(userExpected);
        jest.spyOn(mockedUserRepository, 'updateName').mockResolvedValue(userExpected);

        const sut = await userUseCases.updateName('uuid', 'newName');

        expect(sut).toEqual({
          id: 'uuid',
          name: 'newName',
          email: 'johnDoe@email.com',
        });
      });
      test('Must return NotFoundError when not finding user by id', async () => {
        jest.spyOn(mockedUserRepository, 'findById').mockResolvedValue(null);
        await expect(userUseCases.updateName('uuid', 'newName')).rejects.toEqual(
          new NotFoundError(`Not found user with id uuid`),
        );
      });

      test('It should return an error if the name is invalid', async () => {
        await expect(userUseCases.updateName('uuid', '')).rejects.toEqual(
          new BadRequestError(`Invalid name`),
        );
      });

      test('Should return InternalServerError if the repository returns an error', async () => {
        jest.spyOn(mockedUserRepository, 'findById').mockRejectedValue(new Error('Any'));

        await expect(userUseCases.updateName('uuid', 'newName')).rejects.toEqual(
          new InternalServerError(`An unexpected error has occurred. Please try again later.`),
        );
      });
    });

    // Test ComparePassword
    describe('ComparePassword tests', () => {
      test('Must return true when the password is valid.', async () => {
        const userExpected = {
          id: 'uuid',
          name: 'John Doe',
          email: 'johnDoe@email.com',
          password: 'johnDoePass',
        };
        jest.spyOn(mockedUserRepository, 'findByEmail').mockResolvedValue(userExpected);
        jest.spyOn(mockedIPasswordEncryptor, 'passwordCompare').mockResolvedValue(true);

        const sut = await userUseCases.passwordMatches('johnDoe@email.com', 'johnDoePass');

        expect(sut).toEqual(true);
      });

      test('Must return false when user email not found.', async () => {
        jest.spyOn(mockedUserRepository, 'findByEmail').mockResolvedValue(null);

        const sut = await userUseCases.passwordMatches('johnDoe@email.com', 'johnDoePass');

        expect(sut).toEqual(false);
      });

      test('Must return false when password not match.', async () => {
        const userExpected = {
          id: 'uuid',
          name: 'John Doe',
          email: 'johnDoe@email.com',
          password: 'johnDoePass',
        };
        jest.spyOn(mockedUserRepository, 'findByEmail').mockResolvedValue(userExpected);
        jest.spyOn(mockedIPasswordEncryptor, 'passwordCompare').mockResolvedValue(false);

        const sut = await userUseCases.passwordMatches('johnDoe@email.com', 'johnDoePass');

        expect(sut).toEqual(false);
      });

      test('Should return InternalServerError if the repository returns an error', async () => {
        jest.spyOn(mockedUserRepository, 'findByEmail').mockRejectedValue(new Error('Any'));

        await expect(
          userUseCases.passwordMatches('johnDoe@email.com', 'johnDoePass'),
        ).rejects.toEqual(
          new InternalServerError(`An unexpected error has occurred. Please try again later.`),
        );
      });
    });
  });
});
