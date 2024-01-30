import { CreatePermissionData, Permission } from '@src/domain/entities/permission';

export interface IPermissionRepository {
  create(permission: CreatePermissionData): Promise<Permission>;

  exists(userId: string, roleId: string): Promise<boolean>;

  findById(id: string): Promise<Permission | null>;

  findByUserId(useId: string): Promise<Permission[]>;

  findByUserEmail(userEmail: string): Promise<Permission[]>;

  findByRoleId(roleId: string): Promise<Permission[]>;

  delete(id: string): Promise<boolean>;
}
