import { IUser, IUserReadyOnly } from '@src/domain/entities';
import { IPageable } from '../../../adapters/pageable';

export interface IUserRepository {
  create({ id, name, email, password }: IUser): Promise<IUserReadyOnly>;

  existsByEmail(email: string): Promise<boolean>;

  findAll(query: string, pageable: IPageable): Promise<IUserReadyOnly[]>;

  findById(id: string): Promise<IUserReadyOnly | null>;

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
  findByEmail(email: string): Promise<IUser | null>;
}
