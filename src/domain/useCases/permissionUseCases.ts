import { IPermission, IPermissionCreateData } from '../entities/permission';
import { IPermissionRepository } from '../interfaces/repositories/permissionRepository';
import { InternalServerError } from '../util/errors/appErrors';
import { IRoleUseCases } from './roleUseCases';
import { IUserUseCases } from './userUseCases';

export interface IPermissionUseCases {
  createUsersPermissions(permissions: IPermissionCreateData[]): Promise<IPermission>;
  findPermissionsRolesByUser(userId: string): Promise<IPermissionsRolesByUser>;
}

export class PermissionUseCases implements IPermissionUseCases {
  constructor(
    private permissionUseCases: IPermissionRepository,
    private userUseCases: IUserUseCases,
    private roleUseCases: IRoleUseCases,
  ) {}
  public async createUsersPermissions(permissions: IPermissionCreateData[]): Promise<IPermission> {
    throw new Error('Method not implemented.');
  }
  public async findPermissionsRolesByUser(userId: string): Promise<IPermissionsRolesByUser> {
    throw new Error('Method not implemented.');
  }
}
