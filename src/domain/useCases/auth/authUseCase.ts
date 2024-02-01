import { IUserCreateData, IUserReadyOnly } from "@src/domain/entities"
import { ErrorHandler } from "../handleErrorUseCases";
import { IUserUseCases } from "./userUseCases";
import { IPermissionUseCases } from "./permissionUseCases";
import { RoleEnum } from "@src/domain/util/validators/role";

export interface IAuthUseCases {

    createStandart(user: IUserCreateData): Promise<IUserReadyOnly>;

    createAdmin(user: IUserCreateData): Promise<IUserReadyOnly>;

}

export class AuthUseCases extends ErrorHandler implements IAuthUseCases {

    public constructor(
        private userUseCases: IUserUseCases,
        private permissionUseCases: IPermissionUseCases
    ) { super() }

    public async createStandart(user: IUserCreateData): Promise<IUserReadyOnly> {
        try {
            const userCreated = await this.userUseCases.create(user);
            await this.permissionUseCases.createPermissions(
                [{ userId: userCreated.id, role: RoleEnum.Standard }]
            );
            return userCreated;
        } catch (error) {
            this.handleError(error);
        }
    }

    public async createAdmin(user: IUserCreateData): Promise<IUserReadyOnly> {
        try {
            const userCreated = await this.userUseCases.create(user);
            await this.permissionUseCases.createPermissions(
                [{ userId: userCreated.id, role: RoleEnum.Admin }]
            );
            return userCreated;
        } catch (error) {
            this.handleError(error);
        }
    }
}