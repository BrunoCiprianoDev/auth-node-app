import { Permission, PermissionWithoutId } from "../entities/permission";
import { IPermissionRepository } from "../interfaces/repositories/permissionRepository";
import { InternalServerError, NotFoundError } from "../util/errors/appErrors";
import { IRoleUseCases } from "./roleUseCases";
import { IUserUseCases } from "./userUseCases";

export interface IPermissionUseCases {

    create(userRole: PermissionWithoutId): Promise<Permission>;

    findById(id: string): Promise<Permission>;

    findByUserId(userId: string): Promise<Permission[]>;

    findByRoleId(roleId: string): Promise<Permission[]>;

    delete(id: string): Promise<void>;

}

export class PermissionUseCases implements IPermissionUseCases {

    public constructor(
        private permissionRepository: IPermissionRepository,
        private userUseCases: IUserUseCases,
        private roleUseCases: IRoleUseCases
    ) { }

    public async create(userRole: PermissionWithoutId): Promise<Permission> {
        try {
            await this.userUseCases.findById(userRole.userId);
            await this.roleUseCases.findById(userRole.roleId);
            return await this.permissionRepository.create(userRole);
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            throw new InternalServerError();
        }
    }

    public async findById(id: string): Promise<Permission> {
        try {
            const result = await this.permissionRepository.findById(id);

            if (!result) {
                throw new NotFoundError(`Not found permission with id ${id}`);
            }

            return result;
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            throw new InternalServerError();
        }
    }

    public async findByUserId(userId: string): Promise<Permission[]> {
        try {
            const result = await this.permissionRepository.findByUserId(userId);

            if (result.length === 0) {
                throw new NotFoundError(`Not found permission with userId ${userId}`);
            }
            return result;
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            throw new InternalServerError();
        }
    }

    public async findByRoleId(userId: string): Promise<Permission[]> {
        try {
            const result = await this.permissionRepository.findByRoleId(userId);

            if (result.length === 0) {
                throw new NotFoundError(`Not found permission with RoleId ${userId}`);
            }
            return result;
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            throw new InternalServerError();
        }
    }

    public async delete(id: string): Promise<void> {
        try {
            await this.findById(id);
            await this.permissionRepository.delete(id);
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            throw new InternalServerError();
        }
    }

}