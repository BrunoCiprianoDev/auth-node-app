import { isValidEmail } from '../emailValidator';

describe('Test isValidEmail', () => {
  test('It should return true when the email is valid', () => {
    const sut = isValidEmail('email@mail.com');

    expect(sut).toEqual(true);
  });

  test('It should return false when the email is empty', () => {
    const sut = isValidEmail('');

    expect(sut).toEqual(false);
  });

  test('It should return false when the email does not match the pattern', () => {
    const sut = isValidEmail('email');

    expect(sut).toEqual(false);
  });
});
