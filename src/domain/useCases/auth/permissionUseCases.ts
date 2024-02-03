import { IPermission, IPermissionCreateData, Permission } from '../../entities/auth/permission';
import { IuuidGenerator } from '../../interfaces/adapters/uuidGenerator';
import { IPermissionRepository } from '../../interfaces/repositories/auth/auth/permissionRepository';
import { BadRequestError } from '../../util/errors/appErrors';
import { ErrorHandler } from '../handleErrorUseCases';

export interface IPermissionUseCases {
  createPermissions(permissionsCreateData: IPermissionCreateData[]): Promise<IPermission[]>;
  existsPermissions(userId: string, role: string): Promise<boolean>;
  findPermissionsByUser(userId: string): Promise<IPermission[]>;
  deletePermission(userId: string, role: string): Promise<void>;
}

export class PermissionUseCases extends ErrorHandler implements IPermissionUseCases {
  constructor(
    private uuidGenerator: IuuidGenerator,
    private permissionRepository: IPermissionRepository,
  ) {
    super();
  }

  public async createPermissions(permissionsCreateData: IPermissionCreateData[]): Promise<IPermission[]> {
    try {
      const permissions = await Promise.all(
        permissionsCreateData.map(async ({ userId, role }) => {
          const existsPermission = await this.existsPermissions(userId, role);

          if (existsPermission) {
            throw new BadRequestError(`The user already has ${role} permission`);
          }

          const id = await this.uuidGenerator.generate();

          const permissionData = new Permission({ id, userId, role });

          return permissionData.permissionData;
        }),
      );

      return await this.permissionRepository.createPermissions(permissions);
    } catch (error) {
      this.handleError(error);
    }
  }

  public async existsPermissions(userId: string, role: string): Promise<boolean> {
    try {
      return await this.permissionRepository.existsPermission(userId, role);
    } catch (error) {
      this.handleError(error);
    }
  }

  public async findPermissionsByUser(userId: string): Promise<IPermission[]> {
    try {
      const result = await this.permissionRepository.findPermissionsByUser(userId);

      if (result.length === 0) {
        throw new BadRequestError(`No permissions found for this user`);
      }

      return result;
    } catch (error) {
      this.handleError(error);
    }
  }

  public async deletePermission(userId: string, role: string): Promise<void> {
    try {
      const exists = await this.existsPermissions(userId, role);
      if (!exists) {
        throw new BadRequestError(`Permission not found`);
      }
      await this.permissionRepository.deletePermission(userId, role);
    } catch (error) {
      this.handleError(error);
    }
  }
}
