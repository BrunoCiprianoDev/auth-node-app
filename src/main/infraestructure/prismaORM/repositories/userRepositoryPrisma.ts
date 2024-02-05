import { IUserRepository } from '@src/domain/interfaces/repositories/auth/auth/userRepository';
import { IUser, IUserReadyOnly } from '@src/domain/entities';
import BaseRepository from './baseRepositoryPrisma';
import { IPageable } from '@src/domain/interfaces/adapters/pageable';

export class UserRepositoryPrisma extends BaseRepository implements IUserRepository {
  public async create(user: IUser): Promise<IUserReadyOnly> {
    try {
      return await this.dbClientInstance.user.create({ data: user, select: { id: true, name: true, email: true } });
    } catch (error) {
      this.handleError(error);
    }
  }

  public async existsByEmail(email: string): Promise<boolean> {
    try {
      const result = await this.dbClientInstance.user.findUnique({ where: { email } });
      return result ? true : false;
    } catch (error) {
      this.handleError(error);
    }
  }

  public async findAll(contains: string, { page, size, order }: IPageable): Promise<IUserReadyOnly[]> {
    try {
      const result = await this.dbClientInstance.user.findMany({
        where: { email: { contains } },
        skip: (page - 1) * size,
        take: size,
        orderBy: {
          email: order === 'desc' ? 'desc' : 'asc',
        },
        select: { id: true, name: true, email: true },
      });
      return result;
    } catch (error) {
      this.handleError(error);
    }
  }

  public async findById(id: string): Promise<IUserReadyOnly | null> {
    try {
      const result = await this.dbClientInstance.user.findUnique({
        where: { id },
        select: { id: true, name: true, email: true },
      });
      return result;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Finds a user by email address.
   *
   * @param email - The email address of the user to be retrieved.
   * @returns A Promise resolving to an IUser object, containing sensitive information such as the password.
   *
   * @warning Avoid using this method to directly return data to the user, as the IUser object contains the password.
   * Use IUserReadyOnly when dealing with user information that will be exposed externally, as it excludes the password.
   *
   * @author BrunoCiprianoDev
   */
  public async findByEmail(email: string): Promise<IUser | null> {
    try {
      const result = await this.dbClientInstance.user.findUnique({ where: { email } });
      return result;
    } catch (error) {
      this.handleError(error);
    }
  }
}
