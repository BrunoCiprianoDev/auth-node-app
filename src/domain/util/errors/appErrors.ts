export abstract class AppError extends Error {
  code: number;

  constructor(code: number, message: string) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends AppError {
  constructor(message: string) {
    super(400, message);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string) {
    super(401, message);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string) {
    super(403, message);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(404, message);
  }
}

export class MethodNOtAllowed extends AppError {
  constructor(message: string) {
    super(405, message);
  }
}

export class NotAcceptable extends AppError {
  constructor(message: string) {
    super(406, message);
  }
}

export class Conflict extends AppError {
  constructor(message: string) {
    super(409, message);
  }
}

export class TooManyRequests extends AppError {
  constructor(message: string) {
    super(429, message);
  }
}

export class InternalServerError extends AppError {
  constructor(message: string = 'An unexpected error has occurred. Please try again later.') {
    super(500, message);
  }
}
