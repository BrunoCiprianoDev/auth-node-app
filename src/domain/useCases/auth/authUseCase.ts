import { IUserCreateData, IUserReadyOnly } from '@src/domain/entities';
import { ErrorHandler } from '../handleErrorUseCases';
import { IUserUseCases } from './userUseCases';
import { IPermissionUseCases } from './permissionUseCases';
import { RoleEnum } from '@src/domain/entities/auth/role';
import { ICredentials, ITokenPayload } from '@src/domain/entities/auth/credentials';
import { ITokenGenerator } from '@src/domain/interfaces/adapters/tokenGenerator';

export interface IAuthUseCases {
  createUserWithStandardPermission(user: IUserCreateData): Promise<IUserReadyOnly>;

  createUserWithAdminPermission(user: IUserCreateData): Promise<IUserReadyOnly>;

  createUserWithAllPermissions(user: IUserCreateData): Promise<IUserReadyOnly>;

  authUser(credentials: ICredentials): Promise<ITokenPayload>;
}

export class AuthUseCases extends ErrorHandler implements IAuthUseCases {
  public constructor(
    private userUseCases: IUserUseCases,
    private permissionUseCases: IPermissionUseCases,
    private tokenGenerator: ITokenGenerator,
  ) {
    super();
  }

  public async createUserWithStandardPermission(user: IUserCreateData): Promise<IUserReadyOnly> {
    return await this.create(user, [RoleEnum.Standard]);
  }

  public async createUserWithAdminPermission(user: IUserCreateData): Promise<IUserReadyOnly> {
    return await this.create(user, [RoleEnum.Admin]);
  }

  public async createUserWithAllPermissions(user: IUserCreateData): Promise<IUserReadyOnly> {
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

  public async authUser({ email, password }: ICredentials): Promise<ITokenPayload> {
    try {
      const { id, name } = await this.userUseCases.comparePassword(email, password);
      const permissions = await this.permissionUseCases.findPermissionsByUser(id);
      const roles = permissions.map(permission => {
        return permission.role;
      });
      return await this.tokenGenerator.generateToken(name, email, roles);
    } catch (error) {
      this.handleError(error);
    }
  }
}
