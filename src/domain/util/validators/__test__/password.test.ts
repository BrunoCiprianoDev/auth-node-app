import { isValidPassword } from '../password';

describe('isValidPassword tests', () => {
  test('Must return true if the password is 8 characters or more', () => {
    const sut = isValidPassword('p@ssword123!');
    expect(sut).toEqual(true);
  });
  test('must return false if password has less than 8 characters', () => {
    const sut = isValidPassword('');
    expect(sut).toEqual(false);
  });
});
