import { isValidString } from '../stringValidator';

describe('String validator Tests', () => {
  test('It should return true when the string is valid', () => {
    const sut = isValidString('anyString');

    expect(sut).toEqual(true);
  });

  test('It should return false when the string is empty', () => {
    const sut = isValidString('');

    expect(sut).toEqual(false);
  });
});
