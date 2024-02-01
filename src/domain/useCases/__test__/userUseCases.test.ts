import { IPasswordEncryptor } from '@src/domain/interfaces/adapters/passwordEncryptor';
import { IuuidGenerator } from '@src/domain/interfaces/adapters/uuidGenerator';
import { IUserRepository } from '@src/domain/interfaces/repositories/userRepository';
import { IUserUseCases, UserUseCases } from '../userUseCases';
import { BadRequestError, InternalServerError } from '@src/domain/util/errors/appErrors';

describe('UserUseCases tests', () => {
  let mockedUserRepository: jest.Mocked<IUserRepository>;
  let mockedUuidGenerator: jest.Mocked<IuuidGenerator>;
  let mockedpasswordEncryptor: jest.Mocked<IPasswordEncryptor>;
  let userUseCases: IUserUseCases;

  beforeAll(() => {
    mockedUserRepository = {
      create: jest.fn(),
      existsByEmail: jest.fn()
    };

    mockedUuidGenerator = {
      generate: jest.fn(),
    };

    mockedpasswordEncryptor = {
      encryptor: jest.fn(),
      passwordCompare: jest.fn(),
    };

    userUseCases = new UserUseCases(
      mockedUserRepository,
      mockedUuidGenerator,
      mockedpasswordEncryptor,
    );
  });

  describe('Create user tests', () => {
    test('It should return user created successfully', async () => {
      const userExpect = {
        id: '5f4dcc3b5aa765d61d8327deb882cf99',
        name: 'John Doe',
        email: 'johndoe@email.com',
        password: '2f9fb62d-ddc6-41c0-9d4b-4c66ddc725a8',
      };

      jest
        .spyOn(mockedUuidGenerator, 'generate')
        .mockResolvedValue('2f9fb62d-ddc6-41c0-9d4b-4c66ddc725a8');
      jest
        .spyOn(mockedpasswordEncryptor, 'encryptor')
        .mockResolvedValue('5f4dcc3b5aa765d61d8327deb882cf99');
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
      jest
        .spyOn(mockedUuidGenerator, 'generate')
        .mockResolvedValue('2f9fb62d-ddc6-41c0-9d4b-4c66ddc725a8');
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
      jest
        .spyOn(mockedUuidGenerator, 'generate')
        .mockResolvedValue('2f9fb62d-ddc6-41c0-9d4b-4c66ddc725a8');

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
      ).rejects.toEqual(
        new InternalServerError(`An unexpected error has occurred. Please try again later.`),
      );
    });
  });
});
