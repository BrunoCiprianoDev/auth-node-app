import { User, UserWithoutId } from '../../entities/user';

export interface IUserRepository {
  createUser(user: UserWithoutId): Promise<User>;

  findById(id: string): Promise<User | null>;

  findByEmail(email: string): Promise<User | null>;

  updatePassword(id: string, newPassword: string): Promise<User>;

  updateName(id: string, newName: string): Promise<User>;
}
