import { IUserUseCases } from '@src/domain/useCases/auth/userUseCases';
import { IHttpContext } from '../../adapters/httpContext';
import BaseController from '../baseController';
import { IPageable } from '../../adapters/pageable';

export interface IUserController {
  findById(httpContext: IHttpContext): Promise<void>;
  findAll(httpContext: IHttpContext): Promise<void>;
}

export class UserController extends BaseController implements IUserController {
  constructor(private userUserCases: IUserUseCases) {
    super();
  }

  public async findById(httpContext: IHttpContext): Promise<void> {
    try {
      const id = (httpContext.getRequest().params?.id as string) ?? '';
      const result = await this.userUserCases.findById(id);
      httpContext.send({ statusCode: 200, body: result });
    } catch (error) {
      httpContext.send(this.handleClientErrors(error));
    }
  }

  public async findAll(httpContext: IHttpContext): Promise<void> {
    try {
      const query = httpContext.getRequest().query ?? null;
      const pageable = {
        page: query?.page ?? 0,
        size: query?.size ?? 0,
        order: query?.order ?? '',
        orderBy: query?.orderBy ?? '',
      } as IPageable;

      const contains = (query?.contains as string) ?? '';

      const result = await this.userUserCases.findAll(contains, pageable);

      httpContext.send({ statusCode: 200, body: result });
    } catch (error) {
      httpContext.send(this.handleClientErrors(error));
    }
  }
}
