export interface ICredentials {
    email: string;
    password: string;
}

export interface ITokenPayload {
    userName: string;
    roles: string[];
    token: string;
}