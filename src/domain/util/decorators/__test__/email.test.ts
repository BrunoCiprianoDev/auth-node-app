import { ValidationError } from '../../errors/validationErrors';
import { emailValidator } from '../email';

describe('Email decorator tests', () => {
  test('It should return the email if it is valid', () => {
    const sut = emailValidator('email@email.com');
    expect(sut).toEqual('email@email.com');
  });

  test('Should return BadRequestError when email is invalid', () => {
    expect(() => emailValidator('anyStrign')).toThrow(new ValidationError(`Invalid email`));
  });
});
