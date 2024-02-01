import { IRole } from './role';
import { IUserReadyOnly } from './user';

export interface IPermissionCreateData {
  userId: string;
  rolesId: string;
}

export interface IPermission {
  id: string;
  user: IUserReadyOnly;
  role: IRole;
}

export interface IRolesPermissionsByUser {
  role: IRole;
}
