import { IPasswordEncryptor } from '@src/domain/interfaces/adapters/passwordEncryptor';
import logger from '@src/main/util/logger/logger';
import { compare, hash } from 'bcryptjs';

export class PasswordEncryptor implements IPasswordEncryptor {
  public async encryptor(password: string): Promise<string> {
    try {
      return await hash(password, 8);
    } catch (error) {
      const message = `Error PasswordEncryptor 'bcrypt' password`;
      logger.error(message);
      throw Error(message);
    }
  }

  public async passwordCompare(password: string, passwordEncrypt: string): Promise<boolean> {
    try {
      return await compare(password, passwordEncrypt);
    } catch (error) {
      const message = `Error PasswordCompare 'bcrypt' password`;
      logger.error(message);
      throw Error(message);
    }
  }
}
