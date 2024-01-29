export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

export interface UserWithoutId extends Omit<User, 'id'> {}

export interface CreateUserData extends UserWithoutId {
  confirmPassword: string;
}

export interface UserReadyOnly extends Omit<User, 'password'> {}
