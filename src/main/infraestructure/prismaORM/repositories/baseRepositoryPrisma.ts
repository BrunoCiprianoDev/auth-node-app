import {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';
import { DbClientPrisma } from '../dbClientPrisma';

export default abstract class BaseRepository {
  constructor(protected dbClientInstance = new DbClientPrisma().getInstance()) {}

  protected handleError(error: unknown): never {
    if (error instanceof Error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new Error(error.message);
      }
      if (error instanceof PrismaClientUnknownRequestError) {
        throw new Error(error.message);
      }
      if (error instanceof PrismaClientValidationError) {
        throw new Error(error.message);
      }
    }
    throw new Error('Something unexpeted happened to the database');
  }
}
