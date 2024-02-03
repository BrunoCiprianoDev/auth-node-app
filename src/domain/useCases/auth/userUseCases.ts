import { IPageable } from '@src/domain/interfaces/adapters/pageable';
import { IUserCreateData, IUserReadyOnly, User } from '../../entities';
import { IPasswordEncryptor } from '../../interfaces/adapters/passwordEncryptor';
import { IuuidGenerator } from '../../interfaces/adapters/uuidGenerator';
import { IUserRepository } from '../../interfaces/repositories/auth/auth/userRepository';
import { BadRequestError, NotFoundError, UnauthorizedError } from '../../util/errors/appErrors';
import { ErrorHandler } from '../handleErrorUseCases';

export interface IUserUseCases {
  create(user: IUserCreateData): Promise<IUserReadyOnly>;
  comparePassword(email: string, password: string): Promise<IUserReadyOnly>;
  findById(id: string): Promise<IUserReadyOnly>;
  findAll(query: string, pageable: IPageable): Promise<IUserReadyOnly[]>;
}

export class UserUseCases extends ErrorHandler implements IUserUseCases {
  constructor(
    private userRepository: IUserRepository,
    private uuidGenerator: IuuidGenerator,
    private passwordEncryptor: IPasswordEncryptor,
  ) {
    super();
  }

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
      this.handleError(error);
    }
  }

  public async comparePassword(email: string, password: string): Promise<IUserReadyOnly> {
    try {
      const user = await this.userRepository.findByEmail(email);
      if (!user) {
        throw new UnauthorizedError('Invalid email or password');
      }
      const passwordIsValid = await this.passwordEncryptor.passwordCompare(password, user.password);
      if (!passwordIsValid) {
        throw new UnauthorizedError('Invalid email or password');
      }
      return { id: user.id, name: user.name, email: user.email };
    } catch (error) {
      this.handleError(error);
    }
  }
  public async findById(id: string): Promise<IUserReadyOnly> {
    try {
      const result = await this.userRepository.findById(id);
      if (!result) {
        throw new NotFoundError('User not found by id');
      }
      return result;
    } catch (error) {
      this.handleError(error);
    }
  }

  public async findAll(query: string, pageable: IPageable): Promise<IUserReadyOnly[]> {
    try {
      return await this.userRepository.findAll(query, pageable);
    } catch (error) {
      this.handleError(error);
    }
  }
}
