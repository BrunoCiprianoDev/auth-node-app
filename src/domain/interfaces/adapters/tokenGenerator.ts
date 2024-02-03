import { IPayload, ITokenPayload } from '@src/domain/entities/auth/credentials';

export interface ITokenGenerator {
  generateToken(email: string, roles: string[]): Promise<ITokenPayload>;
  getPayload(token: string): Promise<IPayload>;
}
