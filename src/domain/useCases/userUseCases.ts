import { IUserCreateData, IUserReadyOnly, User } from '../entities';
import { IPasswordEncryptor } from '../interfaces/adapters/passwordEncryptor';
import { IuuidGenerator } from '../interfaces/adapters/uuidGenerator';
import { IUserRepository } from '../interfaces/repositories/userRepository';
import { BadRequestError, InternalServerError } from '../util/errors/appErrors';
import { ValidationError } from '../util/errors/validationErrors';

export interface IUserUseCases {
  create(user: IUserCreateData): Promise<IUserReadyOnly>;
}

export class UserUseCases implements IUserUseCases {
  constructor(
    private userRepository: IUserRepository,
    private uuidGenerator: IuuidGenerator,
    private passwordEncryptor: IPasswordEncryptor,
  ) { }

  public async create({ name, email, password }: IUserCreateData): Promise<IUserReadyOnly> {
    try {
      const id = await this.uuidGenerator.generate();

      const user = new User({ id, name, email, password });

      const alreadyExists = await this.userRepository.existsByEmail(email);

      if (alreadyExists) {
        throw new BadRequestError('There is already a user with this email');
      }

      user.password = await this.passwordEncryptor.encryptor(password);

      return await this.userRepository.create(user.userData);
    } catch (error) {
      if (error instanceof BadRequestError) {
        throw error;
      }
      if (error instanceof ValidationError) {
        throw new BadRequestError(error.message);
      }
      throw new InternalServerError();
    }
  }
}
