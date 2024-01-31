import { IRole } from "../entities";
import { IRoleRepository } from "../interfaces/repositories/roleRepository";
import { InternalServerError, NotFoundError } from "../util/errors/appErrors";

export interface IRoleUseCases {

    findByName(name: string): Promise<IRole>;

}

export class RoleUseCases implements IRoleUseCases {

    constructor(private roleRepository: IRoleRepository) { }

    public async findByName(name: string): Promise<IRole> {
        try {
            const role = await this.roleRepository.findByName(name);
            if (!role) {
                throw new NotFoundError('Role not found by id');
            }
            return role;
        } catch (error) {
            throw new InternalServerError();
        }
    }

}