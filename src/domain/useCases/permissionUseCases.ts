import { IPermission, IPermissionCreateData, Permission } from "../entities/auth/permission";
import { IuuidGenerator } from "../interfaces/adapters/uuidGenerator";
import { IPermissionRepository } from "../interfaces/repositories/permissionRepository";
import { BadRequestError, InternalServerError } from "../util/errors/appErrors";
import { ValidationError } from "../util/errors/validationErrors";

export interface IPermissionUseCase {

    createPermissions(permissionsCreateData: IPermissionCreateData[]): Promise<IPermission[]>

}

export class PermissionUseCase implements IPermissionUseCase {

    constructor(
        private uuidGenerator: IuuidGenerator,
        private permissionRepository: IPermissionRepository) { }

    public async createPermissions(permissionsCreateData: IPermissionCreateData[]): Promise<IPermission[]> {
        try {
            const permissions = await Promise.all(permissionsCreateData.map(async ({ userId, role }) => {
                const id = await this.uuidGenerator.generate();
                const permissionData = new Permission({ id, userId, role });
                return permissionData.permissionData;
            }));
            return await this.permissionRepository.createPermissions(permissions);
        } catch (error) {
            if (error instanceof ValidationError) {
                throw new BadRequestError(error.message);
            }
            throw new InternalServerError();
        }
    }


}