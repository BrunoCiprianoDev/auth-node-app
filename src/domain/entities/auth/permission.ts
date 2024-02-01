import { Uuid } from "@src/domain/util/validators/uuid";
import { Role } from "../../util/validators/role";


export interface IPermission {
    id: string;
    userId: string;
    role: string;
}

export interface IPermissionCreateData extends Omit<IPermission, 'id'> { }

export class Permission implements IPermission {

    @Uuid()
    private _id: string;

    @Uuid()
    private _userId: string;

    @Role()
    private _role: string;

    constructor({ id, userId, role }: IPermission) {
        this._id = id;
        this._userId = userId;
        this._role = role;
    }

    set id(id: string) {
        this._id = id;
    }

    get id(): string {
        return this._id;
    }

    set userId(userId: string) {
        this._userId = userId;
    }

    get userId(): string {
        return this._userId;
    }

    set role(role: string) {
        this._role = role;
    }

    get role(): string {
        return this._role;
    }

    get permissionData(): IPermission {
        return {
            id: this.id,
            userId: this.userId,
            role: this.role
        }
    }

}