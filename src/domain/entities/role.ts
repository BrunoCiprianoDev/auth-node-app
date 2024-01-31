import { NotEmpty } from "../util/decorators";
import { Uuid } from "../util/decorators/uuid";

export interface IRole {
    id: string;
    name: string;
}

export class Role implements IRole {

    @Uuid()
    private _id: string;

    @NotEmpty()
    private _name: string;

    constructor({ id, name }: IRole) {
        this._id = id;
        this._name = name;
    }

    set id(id: string) {
        this._id = id;
    }

    get id(): string {
        return this._id;
    }

    set name(name: string) {
        this._name = name;
    }

    get name(): string {
        return this._name;
    }

}