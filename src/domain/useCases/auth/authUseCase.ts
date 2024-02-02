import { IUserCreateData, IUserReadyOnly } from '@src/domain/entities';
import { ErrorHandler } from '../handleErrorUseCases';
import { IUserUseCases } from './userUseCases';
import { IPermissionUseCases } from './permissionUseCases';
import { RoleEnum } from '@src/domain/entities/auth/role';

export interface IAuthUseCases {
  createStandard(user: IUserCreateData): Promise<IUserReadyOnly>;

  createAdmin(user: IUserCreateData): Promise<IUserReadyOnly>;

  createSuperUser(user: IUserCreateData): Promise<IUserReadyOnly>;
}

export class AuthUseCases extends ErrorHandler implements IAuthUseCases {
  public constructor(
    private userUseCases: IUserUseCases,
    private permissionUseCases: IPermissionUseCases,
  ) {
    super();
  }

  public async createStandard(user: IUserCreateData): Promise<IUserReadyOnly> {
    return await this.create(user, [RoleEnum.Standard]);
  }

  public async createAdmin(user: IUserCreateData): Promise<IUserReadyOnly> {
    return await this.create(user, [RoleEnum.Admin]);
  }

  public async createSuperUser(user: IUserCreateData): Promise<IUserReadyOnly> {
    return await this.create(user, [RoleEnum.Standard, RoleEnum.Admin]);
  }

  private async create(user: IUserCreateData, roles: RoleEnum[]): Promise<IUserReadyOnly> {
    try {
      const userCreated = await this.userUseCases.create(user);

      const permissionsCreateData = roles.map(role => {
        return { userId: userCreated.id, role: role };
      });

      await this.permissionUseCases.createPermissions(permissionsCreateData);
      return userCreated;
    } catch (error) {
      this.handleError(error);
    }
  }
}
