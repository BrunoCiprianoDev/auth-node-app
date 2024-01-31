import { isValidUuid } from '../uuid';

describe('IsValidUuid tests', () => {
  test('Must return true if the uuid matches the pattern', () => {
    const sut = isValidUuid('2f9fb62d-ddc6-41c0-9d4b-4c66ddc725a8');
    expect(sut).toEqual(true);
  });

  test('Must return false if the uuid not matches the pattern', () => {
    const sut = isValidUuid('anyString');
    expect(sut).toEqual(false);
  });
});
