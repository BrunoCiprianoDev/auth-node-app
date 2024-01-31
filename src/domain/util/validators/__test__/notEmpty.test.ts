import { isNotEmpty } from '../notEmpty';

describe('IsNotEmpty tests', () => {
  test('It should return true when value is not empty', () => {
    const sut = isNotEmpty('anyString');
    expect(sut).toEqual(true);
  });

  test('It should return false when value is empty', () => {
    const sut = isNotEmpty('');
    expect(sut).toEqual(false);
  });
});
