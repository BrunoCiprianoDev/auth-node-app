import { NotEmpty } from '../util/validators';
import { Uuid } from '../util/validators/uuid';

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

  get roleData(): IRole {
    return {
      id: this.id,
      name: this.name,
    };
  }
}
