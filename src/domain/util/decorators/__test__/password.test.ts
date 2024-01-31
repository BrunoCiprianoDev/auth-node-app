import { BadRequestError } from '../../errors/appErrors';
import { passwordValidator } from '../password';

describe('Email decorator tests', () => {
  test('It should return the password if is valid', () => {
    const sut = passwordValidator('p@ssw0rd!@#12343456');
    expect(sut).toEqual('p@ssw0rd!@#12343456');
  });

  test('Should return BadRequestError password is empty', () => {
    expect(() => passwordValidator('')).toThrow(
      new BadRequestError(`The value for 'password' must not be empty.`),
    );
  });

  test('Should return error if password is less than 8 characters', () => {
    expect(() => passwordValidator('ssw0rd!')).toThrow(
      new BadRequestError(`The password must be at least 8 characters long.`),
    );
  });

  test('Should return an error if the password does not have a digit', () => {
    expect(() => passwordValidator('p@sswrd!@#')).toThrow(
      new BadRequestError(`The password must contain at least 1 digit.`),
    );
  });
  test('Should return error if password does not have at least 2 special characters', () => {
    expect(() => passwordValidator('p1232134123')).toThrow(
      new BadRequestError(`The password must contain at least 2 special characters.`),
    );
  });
});
