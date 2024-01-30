import { CreatePermissionData, Permission } from '../entities/permission';
import { IPermissionRepository } from '../interfaces/repositories/permissionRepository';
import { BadRequestError, InternalServerError, NotFoundError } from '../util/errors/appErrors';
import { IRoleUseCases } from './roleUseCases';
import { IUserUseCases } from './userUseCases';

export interface IPermissionUseCases {
  create(permission: CreatePermissionData): Promise<Permission>;

  exists(userId: string, roleId: string): Promise<boolean>;

  findById(id: string): Promise<Permission>;

  findByUserId(userId: string): Promise<Permission[]>;

  findByRoleId(roleId: string): Promise<Permission[]>;

  findByUserEmail(userEmail: string): Promise<Permission[]>;

  delete(id: string): Promise<void>;
}

export class PermissionUseCases implements IPermissionUseCases {
  public constructor(
    private permissionRepository: IPermissionRepository,
    private userUseCases: IUserUseCases,
    private roleUseCases: IRoleUseCases,
  ) {}

  public async create({ userId, roleId }: CreatePermissionData): Promise<Permission> {
    try {
      const exists = await this.exists(userId, roleId);

      if (exists) {
        throw new BadRequestError('The permission you are trying to register already exists');
      }

      await this.userUseCases.findById(userId);
      await this.roleUseCases.findById(roleId);

      return await this.permissionRepository.create({ userId, roleId });
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof BadRequestError) {
        throw error;
      }
      throw new InternalServerError();
    }
  }

  public async exists(userId: string, roleId: string): Promise<boolean> {
    try {
      return await this.permissionRepository.exists(userId, roleId);
    } catch (error) {
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

  public async findByUserEmail(userEmail: string): Promise<Permission[]> {
    try {
      const result = await this.permissionRepository.findByUserEmail(userEmail);

      if (result.length === 0) {
        throw new NotFoundError(`Not found permission with userEmail ${userEmail}`);
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
