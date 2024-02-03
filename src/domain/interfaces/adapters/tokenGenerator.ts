import { ITokenPayload } from '@src/domain/entities/auth/credentials';

export interface ITokenGenerator {
  generateToken(email: string, roles: string[]): Promise<ITokenPayload>;
}
