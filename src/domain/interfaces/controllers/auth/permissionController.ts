import { IPermissionUseCases } from '@src/domain/useCases/auth/permissionUseCases';
import { IHttpContext } from '../../adapters/httpContext';
import BaseController from '../baseController';
import { IPermissionCreateData } from '@src/domain/entities';

export interface IPermissionController {
  createPermission(httpContext: IHttpContext): Promise<void>;

  findPermissionsByUser(httpContext: IHttpContext): Promise<void>;

  deletePermission(httpContext: IHttpContext): Promise<void>;
}

export class PermissionController extends BaseController implements IPermissionController {
  constructor(private permissionUserCases: IPermissionUseCases) {
    super();
  }

  public async createPermission(httpContext: IHttpContext): Promise<void> {
    try {
      const body = httpContext.getRequest().body as IPermissionCreateData;
      const permissionData = {
        userId: body.userId ?? '',
        role: body.role ?? '',
      };
      const result = await this.permissionUserCases.createPermissions([permissionData]);
      httpContext.send({ statusCode: 201, body: result });
    } catch (error) {
      httpContext.send(this.handleClientErrors(error));
    }
  }

  public async findPermissionsByUser(httpContext: IHttpContext): Promise<void> {
    try {
      const userId = (httpContext.getRequest().params?.userId as string) ?? '';
      const result = await this.permissionUserCases.findPermissionsByUser(userId);
      httpContext.send({ statusCode: 200, body: result });
    } catch (error) {
      httpContext.send(this.handleClientErrors(error));
    }
  }

  public async deletePermission(httpContext: IHttpContext): Promise<void> {
    try {
      const body = httpContext.getRequest().body as IPermissionCreateData;
      const userId = body.userId ?? '';
      const role = body.role ?? '';
      await this.permissionUserCases.deletePermission(userId, role);
      httpContext.send({ statusCode: 204, body: {} });
    } catch (error) {
      httpContext.send(this.handleClientErrors(error));
    }
  }
}
