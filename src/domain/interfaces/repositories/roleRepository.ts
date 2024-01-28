import { Role } from "@src/domain/entities/roles";

export interface IRoleRepository {

    findById(id: string): Promise<Role | null>;
    findAll(): Promise<Role[]>

}