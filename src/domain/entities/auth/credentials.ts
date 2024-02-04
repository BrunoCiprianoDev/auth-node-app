export interface ICredentials {
  email: string;
  password: string;
}

export interface ITokenPayload {
  userName: string;
  userEmail: string;
  roles: string[];
  token: string;
}

export interface IPayload extends Omit<ITokenPayload, 'token'> {}
