import { Role } from './role';
import { UserReadyOnly } from './user';

export interface Permission {
  id: string;
  user: UserReadyOnly;
  role: Role;
}

export interface CreatePermissionData {
  userId: string;
  roleId: string;
}
