export interface ICredentials {
  email: string;
  password: string;
}

export interface ITokenPayload {
  userEmail: string;
  roles: string[];
  token: string;
}

export interface IPayload extends Omit<ITokenPayload, 'token'> {}
