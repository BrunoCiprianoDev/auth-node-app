export interface ICredentials {
  email: string;
  password: string;
}

export interface ITokenPayload {
  userEmail: string;
  roles: string[];
  token: string;
}
