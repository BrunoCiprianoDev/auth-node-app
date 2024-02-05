import { Router, Request, Response } from 'express';
import { ExpressHttpContext } from '../ports/expressHttpContext';
import { userFactory } from '../factories/userFactory';

export const userRoutes = Router();

userRoutes.get('/', (request: Request, response: Response) => {
  userFactory().findAll(new ExpressHttpContext(request, response));
});
