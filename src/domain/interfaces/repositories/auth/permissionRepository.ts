import { IPermission } from '@src/domain/entities/auth/permission';

export interface IPermissionRepository {
  createPermissions(permissions: IPermission[]): Promise<IPermission[]>;
  existsPermission(userId: string, role: string): Promise<boolean>;
  deletePermission(userId: string, role: string): Promise<boolean>;
}
