import { Permission, PermissionWithoutId } from '@src/domain/entities/permission';

export interface IPermissionRepository {
  create(userRole: PermissionWithoutId): Promise<Permission>;

  findById(id: string): Promise<Permission | null>;

  findByUserId(useId: string): Promise<Permission[]>;

  findByRoleId(roleId: string): Promise<Permission[]>;

  delete(id: string): Promise<boolean>;
}
