import { IPermission } from '@src/domain/entities/auth/permission';

export interface IPermissionRepository {
  createPermissions(permissions: IPermission[]): Promise<IPermission[]>;
  existsPermission(userId: string, role: string): Promise<boolean>;
  findPermissionsByUser(userId: string): Promise<IPermission[]>;
  deletePermission(userId: string, role: string): Promise<void>;
}
