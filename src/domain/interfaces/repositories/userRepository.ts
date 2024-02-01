import { IUser, IUserReadyOnly } from '@src/domain/entities';

export interface IUserRepository {
  create({ id, name, email, password }: IUser): Promise<IUserReadyOnly>;

  existsByEmail(email: string): Promise<boolean>;

  findById(id: string): Promise<IUserReadyOnly | null>;
}
