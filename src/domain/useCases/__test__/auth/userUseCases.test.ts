import { IPasswordEncryptor } from '@src/domain/interfaces/adapters/passwordEncryptor';
import { IuuidGenerator } from '@src/domain/interfaces/adapters/uuidGenerator';
import { IUserUseCases, UserUseCases } from '../../auth/userUseCases';
import {
  BadRequestError,
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
} from '@src/domain/util/errors/appErrors';
import { IPageable } from '@src/domain/interfaces/adapters/pageable';
import { IUserRepository } from '@src/domain/interfaces/repositories/auth/auth/userRepository';

describe('UserUseCases tests', () => {
  let mockedUserRepository: jest.Mocked<IUserRepository>;
  let mockedUuidGenerator: jest.Mocked<IuuidGenerator>;
  let mockedpasswordEncryptor: jest.Mocked<IPasswordEncryptor>;
  let mockedPageable: jest.Mocked<IPageable>;
  let userUseCases: IUserUseCases;

  beforeAll(() => {
    mockedUserRepository = {
      create: jest.fn(),
      existsByEmail: jest.fn(),
      findByEmail: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
    };

    mockedUuidGenerator = {
      generate: jest.fn(),
    };

    mockedpasswordEncryptor = {
      encryptor: jest.fn(),
      passwordCompare: jest.fn(),
    };

    userUseCases = new UserUseCases(mockedUserRepository, mockedUuidGenerator, mockedpasswordEncryptor);

    mockedPageable = {
      page: 1,
      size: 2,
      order: '',
      orderBy: '',
      getPage: jest.fn(),
      getSize: jest.fn(),
    };
  });

  describe('Create user tests', () => {
    test('It should return user created successfully', async () => {
      const userExpect = {
        id: '5f4dcc3b5aa765d61d8327deb882cf99',
        name: 'John Doe',
        email: 'johndoe@email.com',
        password: '2f9fb62d-ddc6-41c0-9d4b-4c66ddc725a8',
      };

      jest.spyOn(mockedUuidGenerator, 'generate').mockResolvedValue('2f9fb62d-ddc6-41c0-9d4b-4c66ddc725a8');
      jest.spyOn(mockedpasswordEncryptor, 'encryptor').mockResolvedValue('5f4dcc3b5aa765d61d8327deb882cf99');
      jest.spyOn(mockedUserRepository, 'existsByEmail').mockResolvedValue(false);
      jest.spyOn(mockedUserRepository, 'create').mockResolvedValue(userExpect);

      const sut = await userUseCases.create({
        name: 'John Doe',
        email: 'johndoe@email.com',
        password: 'p@ssw0rd!@',
      });

      expect(mockedpasswordEncryptor.encryptor).toHaveBeenCalledWith('p@ssw0rd!@');
      expect(mockedUserRepository.existsByEmail).toHaveBeenCalledWith('johndoe@email.com');
      expect(sut).toEqual(userExpect);
    });

    test('It should return an error if there is already another user using this email', async () => {
      jest.spyOn(mockedUuidGenerator, 'generate').mockResolvedValue('2f9fb62d-ddc6-41c0-9d4b-4c66ddc725a8');
      jest.spyOn(mockedUserRepository, 'existsByEmail').mockResolvedValue(true);

      await expect(
        userUseCases.create({
          name: 'John Doe',
          email: 'johndoe@email.com',
          password: 'p@ssw0rd!@',
        }),
      ).rejects.toEqual(new BadRequestError(`There is already a user with this email`));
    });

    test('Should return BadRequestError if an error occurs while validating the data', async () => {
      jest.spyOn(mockedUuidGenerator, 'generate').mockResolvedValue('2f9fb62d-ddc6-41c0-9d4b-4c66ddc725a8');

      await expect(
        userUseCases.create({
          name: '', // Name is empty
          email: 'johndoe@email.com',
          password: 'p@ssw0rd!@',
        }),
      ).rejects.toEqual(new BadRequestError(`The value for 'name' must not be empty.`));
    });

    test('It should return InternalServerError if an unexpected error occurs', async () => {
      jest.spyOn(mockedUuidGenerator, 'generate').mockRejectedValue(new Error('Any string'));

      await expect(
        userUseCases.create({
          name: 'John Doe',
          email: 'johndoe@email.com',
          password: 'p@ssw0rd!@',
        }),
      ).rejects.toEqual(new InternalServerError(`An unexpected error has occurred. Please try again later.`));
    });
  });

  describe('Compare password tests', () => {
    test('Shoud return UserReadyOnly whne email and password is valid', async () => {
      const userExpect = {
        id: 'userId',
        name: 'John Doe',
        email: 'johndoe@email.com',
        password: 'passwordEncrypted',
      };

      jest.spyOn(mockedUserRepository, 'findByEmail').mockResolvedValue(userExpect);

      jest.spyOn(mockedpasswordEncryptor, 'passwordCompare').mockResolvedValue(true);

      const sut = await userUseCases.comparePassword('johndoe@email.com', 'password');

      expect(sut).toEqual({
        id: 'userId',
        name: 'John Doe',
        email: 'johndoe@email.com',
      });

      expect(mockedUserRepository.findByEmail).toHaveBeenCalledWith('johndoe@email.com');
      expect(mockedpasswordEncryptor.passwordCompare).toHaveBeenCalledWith('password', 'passwordEncrypted');
    });

    test('Shoud return UnauthorizedError when email is not found', async () => {
      jest.spyOn(mockedUserRepository, 'findByEmail').mockResolvedValue(null);

      await expect(userUseCases.comparePassword('johndoe@email.com', 'password')).rejects.toEqual(
        new UnauthorizedError('Invalid email or password'),
      );
    });

    test('Shoud return UnauthorizedError when password is invalid', async () => {
      const userExpect = {
        id: 'userId',
        name: 'John Doe',
        email: 'johndoe@email.com',
        password: 'passwordEncrypted',
      };

      jest.spyOn(mockedUserRepository, 'findByEmail').mockResolvedValue(userExpect);

      jest.spyOn(mockedpasswordEncryptor, 'passwordCompare').mockResolvedValue(false);

      await expect(userUseCases.comparePassword('johndoe@email.com', 'password')).rejects.toEqual(
        new UnauthorizedError('Invalid email or password'),
      );
    });
  });
  describe('FindById tests', () => {
    test('Should return user by id successfully', async () => {
      const userExpected = {
        id: '5f4dcc3b5aa765d61d8327deb882cf99',
        name: 'John Doe',
        email: 'johndoe@email.com',
      };

      jest.spyOn(mockedUserRepository, 'findById').mockResolvedValue(userExpected);

      const sut = await userUseCases.findById('5f4dcc3b5aa765d61d8327deb882cf99');

      expect(sut).toEqual(userExpected);
      expect(mockedUserRepository.findById).toHaveBeenCalledWith('5f4dcc3b5aa765d61d8327deb882cf99');
    });

    test('Should return NotFoundError when not found user by id', async () => {
      jest.spyOn(mockedUserRepository, 'findById').mockResolvedValue(null);

      await expect(userUseCases.findById('5f4dcc3b5aa765d61d8327deb882cf99')).rejects.toEqual(
        new NotFoundError('User not found by id'),
      );
    });
  });

  describe('FindAll tests', () => {
    test('Should return a list users by query', async () => {
      const usersExpected = [
        {
          id: '5f4dcc3b5aa765d61d8327deb882cf99',
          name: 'John Doe1',
          email: 'johndoe1@email.com',
        },
        {
          id: '5f4dcc3b5aa765d61d8327deb882cf88',
          name: 'John Doe2',
          email: 'johndoe2@email.com',
        },
      ];

      jest.spyOn(mockedUserRepository, 'findAll').mockResolvedValue(usersExpected);

      const sut = await userUseCases.findAll('queryEmail', mockedPageable);

      expect(sut).toEqual(usersExpected);
    });

    test('Should return a InternalServerError when a unpexpected error ocorrus', async () => {
      jest.spyOn(mockedUserRepository, 'findAll').mockRejectedValue(new Error('Any string'));

      await expect(userUseCases.findAll('queryEmail', mockedPageable)).rejects.toBeInstanceOf(InternalServerError);
    });
  });
});
