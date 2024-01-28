import { Role } from "../entities/roles";
import { IRoleRepository } from "../interfaces/repositories/roleRepository";
import { InternalServerError, NotFoundError } from "../util/errors/appErrors";

export interface IRoleUseCase {
    findById(id: string): Promise<Role>
    findAll(): Promise<Role[]>
}


export class RoleUseCases implements IRoleUseCase {

    constructor(private roleRepository: IRoleRepository) { }

    public async findById(id: string): Promise<Role> {
        let response: Role | null;
        try {
            response = await this.roleRepository.findById(id);
        } catch (error) {
            throw new InternalServerError();
        }
        if (!response) {
            throw new NotFoundError(`Role not found by id = ${id}`);
        }
        return response;
    }

    public async findAll(): Promise<Role[]> {
        try {
            return await this.roleRepository.findAll();
        } catch (error) {
            throw new InternalServerError();
        }

    }
}