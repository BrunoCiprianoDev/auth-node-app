import { IRoleUseCases } from '@src/domain/useCases/roleUseCases';
import BaseController from './baseController';
import { IHttpContext } from '../adapters/httpContext';

export default class RoleController extends BaseController {
  constructor(private roleUseCases: IRoleUseCases) {
    super();
  }

  public async findById(httpContext: IHttpContext): Promise<void> {
    try {
      const id = (httpContext.getRequest().params?.id as string) ?? '';
      const result = await this.roleUseCases.findById(id);
      httpContext.send({ statusCode: 200, body: result });
    } catch (error: unknown) {
      httpContext.send(this.handleClientErrors(error));
    }
  }

  public async findAll(httpContext: IHttpContext): Promise<void> {
    try {
      const result = await this.roleUseCases.findAll();
      httpContext.send({ statusCode: 200, body: result });
    } catch (error: unknown) {
      httpContext.send(this.handleClientErrors(error));
    }
  }
}
