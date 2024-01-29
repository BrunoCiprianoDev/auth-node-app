import { isValidPassword } from '../passwordValidator';

describe('Password validator tests', () => {
  test('It should return true whe the password is valid', () => {
    const sut = isValidPassword('p@ssw0rd!123');

    expect(sut).toEqual(true);
  });

  test('It should return false when the password is empty', () => {
    const sut = isValidPassword('');

    expect(sut).toEqual(false);
  });

  test('It should return an error when the password is less than 8 characters long ', () => {
    const sut = isValidPassword('p@ss');

    expect(sut).toEqual(false);
  });

  test('It should return an erro when the password not contains 2 special char', () => {
    const sut = isValidPassword('passwordJohnDoe');

    expect(sut).toEqual(false);
  });
});
