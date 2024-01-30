// import { Credentials, TokenPayload } from "../entities/auth";
// import { IPasswordEncryptor } from "../interfaces/adapters/passwordEncryptor";
// import { ITokenGenerator } from "../interfaces/adapters/tokenGenerator";
// import { ForbiddenError, InternalServerError } from "../util/errors/appErrors";
// import { IPermissionUseCases } from "./permissionUseCases";
// import { IUserUseCases } from "./userUseCases";

// export interface IAuthUseCase {

//     authUser(credentials: Credentials): Promise<TokenPayload>;

// }

// export class AuthUseCase implements IAuthUseCase {

//     constructor(
//         private userUseCase: IUserUseCases,
//         private permissionUseCase: IPermissionUseCases,
//         private passwordEncryptor: IPasswordEncryptor,
//         private tokenGenerator: ITokenGenerator
//     ) { }

//     public async authUser({ email, password }: Credentials): Promise<TokenPayload> {
//         try {
//             const passwordIsValid = await this.userUseCase.passwordMatches(email, password);
//             if (!passwordIsValid) {
//                 throw new ForbiddenError('Invalid email or password');
//             }
//             const permissions = await this.permissionUseCase.

//         } catch (error) {
//             if (error instanceof ForbiddenError) {
//                 throw error;
//             }
//             throw new InternalServerError();
//         }
//     }

// }
