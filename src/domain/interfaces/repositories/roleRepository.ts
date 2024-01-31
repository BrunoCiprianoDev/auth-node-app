import { IRole } from "@src/domain/entities";

export interface IRoleRepository {

    findByName(name: string): Promise<IRole | null>;

}