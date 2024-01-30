import { IPermissionUseCases } from '@src/domain/useCases/permissionUseCases';
import BaseController from './baseController';
import { IHttpContext } from '../adapters/httpContext';

export class PermissionController extends BaseController {
  constructor(private permissionUseCases: IPermissionUseCases) {
    super();
  }

  public async create(httpContext: IHttpContext): Promise<void> {
    try {
      const body = httpContext.getRequest().body;
      const userId = (body.userId as string) ?? '';
      const roleId = (body.roleId as string) ?? '';

      const result = await this.permissionUseCases.create({ userId, roleId });

      httpContext.send({ statusCode: 201, body: result });
    } catch (error: unknown) {
      httpContext.send(this.handleClientErrors(error));
    }
  }

  public async findById(httpContext: IHttpContext): Promise<void> {
    try {
      const id = (httpContext.getRequest().params?.id as string) ?? '';
      const result = await this.permissionUseCases.findById(id);
      httpContext.send({ statusCode: 200, body: result });
    } catch (error: unknown) {
      httpContext.send(this.handleClientErrors(error));
    }
  }

  public async findByUserId(httpContext: IHttpContext): Promise<void> {
    try {
      const id = (httpContext.getRequest().params?.id as string) ?? '';
      const result = await this.permissionUseCases.findByUserId(id);
      httpContext.send({ statusCode: 200, body: result });
    } catch (error: unknown) {
      httpContext.send(this.handleClientErrors(error));
    }
  }

  public async findByRoleId(httpContext: IHttpContext): Promise<void> {
    try {
      const id = (httpContext.getRequest().params?.id as string) ?? '';
      const result = await this.permissionUseCases.findByRoleId(id);
      httpContext.send({ statusCode: 200, body: result });
    } catch (error: unknown) {
      httpContext.send(this.handleClientErrors(error));
    }
  }

  public async delete(httpContext: IHttpContext): Promise<void> {
    try {
      const id = (httpContext.getRequest().params?.id as string) ?? '';
      await this.permissionUseCases.delete(id);
      httpContext.send({ statusCode: 204, body: {} });
    } catch (error: unknown) {
      httpContext.send(this.handleClientErrors(error));
    }
  }
}
