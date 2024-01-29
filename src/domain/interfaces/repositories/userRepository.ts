import { User, UserWithoutId } from '../../entities/user';

export interface IUserRepository {
  createUser(user: UserWithoutId): Promise<User>;

  findById(id: string): Promise<User | null>;

  findByEmail(email: string): Promise<User | null>;

  updatePassword(token: string, newPassword: string): Promise<User>;

  updateName(token: string, newName: string): Promise<User>;
}
