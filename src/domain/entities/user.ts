import { Email, NotEmpty, Password } from '../util/validators';
import { Uuid } from '../util/validators/uuid';

export interface IUser {
  id: string;
  name: string;
  email: string;
  password: string;
}

export interface IUserCreateData extends Omit<IUser, 'id'> { }

export interface IUserReadyOnly extends Omit<IUser, 'password'> { }

export class User implements IUser {
  @Uuid()
  private _id: string;

  @NotEmpty()
  private _name: string;

  @Email()
  private _email: string;

  @Password()
  private _password: string;

  public constructor({ id, name, email, password }: IUser) {
    this._id = id;
    this._name = name;
    this._email = email;
    this._password = password;
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

  set email(email: string) {
    this._email = email;
  }

  get email(): string {
    return this._email;
  }

  set password(password: string) {
    this._password = password;
  }

  get password(): string {
    return this._password;
  }

  get userData(): IUser {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      password: this.password,
    };
  }

  get userDataReadyOnly(): IUserReadyOnly {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
    };
  }
}
