import { IAuthUseCases } from '@src/domain/useCases/auth/authUseCase';
import { IHttpContext } from '../../adapters/httpContext';
import BaseController from '../baseController';
import { IUserCreateData } from '@src/domain/entities';

export interface IAuthController {
    createStandard(httpContext: IHttpContext): Promise<void>;

    // createAdmin(httpContext: IHttpContext): Promise<void>;

    // createSuperUser(httpContext: IHttpContext): Promise<void>;

    // authUser(httpContext: IHttpContext): Promise<void>;
}

export class AuthController extends BaseController implements IAuthController {
    constructor(private authUseCase: IAuthUseCases) {
        super();
    }

    public async createStandard(httpContext: IHttpContext): Promise<void> {
        try {
            const result = await this.authUseCase.createStandard(this.getUser(httpContext));
            httpContext.send({ statusCode: 200, body: result });
        } catch (error) {
            httpContext.send(this.handleClientErrors(error));
        }
    }

    private getUser(httpContext: IHttpContext): IUserCreateData {
        const body = httpContext.getRequest().body as IUserCreateData;
        return {
            name: (body.name as string) ?? '',
            email: (body.email as string) ?? '',
            password: (body.password as string) ?? '',
        };
    }
}

// public async createAdmin(httpContext: IHttpContext): Promise<IResponse> {
//     try {

//     } catch (error) {
//         this.handleClientErrors(error);
//     }
// }

// public async createSuperUser(httpContext: IHttpContext): Promise<IResponse> {
//     try {

//     } catch (error) {
//         this.handleClientErrors(error);
//     }
// }

// public async authUser(httpContext: IHttpContext): Promise<IResponse> {
//     try {

//     } catch (error) {
//         this.handleClientErrors(error);
//     }
// }
