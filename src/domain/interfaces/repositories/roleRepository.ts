import { Role } from '@src/domain/entities/role';

export interface IRoleRepository {
  findById(id: string): Promise<Role | null>;
  findAll(): Promise<Role[]>;
}
