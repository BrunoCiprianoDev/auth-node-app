import { IUserController, UserController } from '@src/domain/interfaces/controllers/auth/userController';
import { UserUseCases } from '@src/domain/useCases/auth/userUseCases';
import { UserRepositoryPrisma } from '@src/main/infraestructure/prismaORM/repositories/userRepositoryPrisma';
import { PasswordEncryptor } from '../ports/passwordEncryptor';
import { UuidGenerator } from '../ports/uuidGenerator';

let cachedUserController: UserController | null = null;

export function userFactory(): IUserController {
  if (!cachedUserController) {
    const userRepository = new UserRepositoryPrisma();
    const passwordEncryptor = new PasswordEncryptor();
    const uuidGenerator = new UuidGenerator();
    const userUseCases = new UserUseCases(userRepository, uuidGenerator, passwordEncryptor);
    cachedUserController = new UserController(userUseCases);
  }
  return cachedUserController;
}
