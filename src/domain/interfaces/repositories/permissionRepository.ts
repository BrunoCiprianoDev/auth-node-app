import { IPermission } from "@src/domain/entities/auth/permission";

export interface IPermissionRepository {

    createPermissions(permissions: IPermission[]): Promise<IPermission[]>;

}