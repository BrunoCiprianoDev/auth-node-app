import { CreateUserData, UserReadyOnly } from '../entities/user';
import { IPasswordEncryptor } from '../interfaces/adapters/passwordEncryptor';
import { IUserRepository } from '../interfaces/repositories/userRepository';
import { BadRequestError, InternalServerError, NotFoundError } from '../util/errors/appErrors';
import { isValidEmail } from '../util/validators/emailValidator';
import { isValidPassword } from '../util/validators/passwordValidator';
import { isValidString } from '../util/validators/stringValidator';

export interface IUserUseCases {
  createUser(user: CreateUserData): Promise<UserReadyOnly>;

  findById(id: string): Promise<UserReadyOnly>;

  findByEmail(email: string): Promise<UserReadyOnly>;

  updatePassword(
    id: string,
    newPassword: string,
    confirmNewPassword: string,
  ): Promise<UserReadyOnly>;

  updateName(id: string, newName: string): Promise<UserReadyOnly>;

  passwordMatches(email: string, password: string): Promise<boolean>;
}

export class UserUseCases implements IUserUseCases {
  constructor(
    private userRepository: IUserRepository,
    private passwordEncryptor: IPasswordEncryptor,
  ) {}

  public async createUser(user: CreateUserData): Promise<UserReadyOnly> {
    try {
      this.validateUserData(user);

      const existsByEmail = await this.userRepository.findByEmail(user.email);

      if (existsByEmail) {
        throw new BadRequestError(
          `There is already a registered user with email(${existsByEmail.email})`,
        );
      }

      const passwordHash = await this.passwordEncryptor.encryptor(user.password);

      user.password = passwordHash;

      return await this.userRepository.createUser(user);
    } catch (error) {
      if (error instanceof BadRequestError) {
        throw error;
      }
      throw new InternalServerError();
    }
  }

  public async findById(id: string): Promise<UserReadyOnly> {
    try {
      const result = await this.userRepository.findById(id);

      if (!result) {
        throw new NotFoundError(`Not found user with id ${id}`);
      }

      return { id: result.id, name: result.name, email: result.email };
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new InternalServerError();
    }
  }

  public async findByEmail(email: string): Promise<UserReadyOnly> {
    try {
      const result = await this.userRepository.findByEmail(email);

      if (!result) {
        throw new NotFoundError(`Not found user with email ${email}`);
      }

      return { id: result.id, name: result.name, email: result.email };
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new InternalServerError();
    }
  }

  public async updatePassword(
    id: string,
    newPassword: string,
    confirmNewPassword: string,
  ): Promise<UserReadyOnly> {
    try {
      if (newPassword !== confirmNewPassword) {
        throw new BadRequestError(
          'Passwords do not match. Please make sure the password and confirm password are identical.',
        );
      }

      if (!isValidPassword(newPassword)) {
        throw new BadRequestError(
          'The password is invalid. It must be at least 8 characters long and contain at least 2 special characters.',
        );
      }

      const existsById = await this.userRepository.findById(id);

      if (!existsById) {
        throw new NotFoundError(`Unable to update password. User not found.`);
      }

      const result = await this.userRepository.updatePassword(id, newPassword);

      return { id: result.id, name: result.name, email: result.email };
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof BadRequestError) {
        throw error;
      }
      throw new InternalServerError();
    }
  }

  public async updateName(id: string, newName: string): Promise<UserReadyOnly> {
    try {
      if (!isValidString(newName)) {
        throw new BadRequestError('Invalid name');
      }

      const existsById = await this.userRepository.findById(id);

      if (!existsById) {
        throw new NotFoundError(`Not found user with id ${id}`);
      }

      const result = await this.userRepository.updateName(id, newName);

      return { id: result.id, name: result.name, email: result.email };
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof BadRequestError) {
        throw error;
      }
      throw new InternalServerError();
    }
  }

  public async passwordMatches(email: string, password: string): Promise<boolean> {
    try {
      const user = await this.userRepository.findByEmail(email);
      if (!user) {
        return false;
      }
      const passwordMatch = await this.passwordEncryptor.passwordCompare(password, user.password);
      if (!passwordMatch) {
        return false;
      }
      return true;
    } catch (error) {
      throw new InternalServerError();
    }
  }

  private validateUserData({ email, password, confirmPassword, name }: CreateUserData): void {
    if (!isValidEmail(email)) {
      throw new BadRequestError('Invalid email');
    }

    if (password !== confirmPassword) {
      throw new BadRequestError(
        'Passwords do not match. Please make sure the password and confirm password are identical.',
      );
    }

    if (!isValidPassword(password)) {
      throw new BadRequestError(
        'The password is invalid. It must be at least 8 characters long and contain at least 2 special characters.',
      );
    }
    if (!isValidString(name)) {
      throw new BadRequestError('Invalid name');
    }
  }
}
