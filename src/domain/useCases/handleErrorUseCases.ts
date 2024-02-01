import { AppError, BadRequestError, InternalServerError } from '../util/errors/appErrors';
import { ValidationError } from '../util/errors/validationErrors';

export abstract class ErrorHandler {
  constructor() {}

  protected handleError(error: unknown): never {
    if (error instanceof ValidationError) {
      throw new BadRequestError(error.message);
    }
    if (error instanceof AppError) {
      throw error;
    }
    throw new InternalServerError();
  }
}
