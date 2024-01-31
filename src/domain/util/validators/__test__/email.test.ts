import { isValidEmail } from '../email';

describe('IsValidEmail tests', () => {
  test('It should return true when email is valid', () => {
    const sut = isValidEmail('johnDoe@email.com');
    expect(sut).toEqual(true);
  });

  test('It should return false when email is valid', () => {
    const sut = isValidEmail('anyString');
    expect(sut).toEqual(false);
  });
});
