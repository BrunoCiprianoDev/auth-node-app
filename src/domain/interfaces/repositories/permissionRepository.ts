import { IPermission, IPermissionCreateData } from '@src/domain/entities/permission';

export interface IPermissionRepository {
  createUserPermissions(permissions: IPermissionCreateData[]): Promise<IPermission>;
}
