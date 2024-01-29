import { IUserUseCases } from '@src/domain/useCases/userUseCases';
import BaseController from './baseController';
import { IHttpContext } from '../adapters/httpContext';

export default class UserController extends BaseController {
    constructor(private userUseCases: IUserUseCases) {
        super();
    }

    public async create(httpContext: IHttpContext): Promise<void> {
        try {
            const body = httpContext.getRequest().body;
            const name = (body.name as string) ?? '';
            const email = (body.email as string) ?? '';
            const password = (body.password as string) ?? '';
            const confirmPassword = (body.confirmPassword as string) ?? '';

            const result = await this.userUseCases.createUser({ name, email, password, confirmPassword });

            httpContext.send({ statusCode: 200, body: result });
        } catch (error: unknown) {
            httpContext.send(this.handleClientErrors(error));
        }
    }
}
