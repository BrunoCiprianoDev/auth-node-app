import { ValidationError } from '../../errors/validationErrors';
import { uuidValidator } from '../uuid';

describe('Uuid tests', () => {
  test('Must return the value if the id is empty', () => {
    const sut = uuidValidator('');
    expect(sut).toEqual('');
  });
  test('Must return value when uuid is valid', () => {
    const sut = uuidValidator('8c270c84-0aef-495d-9154-8bc4b4a9d7ff');
    expect(sut).toEqual('8c270c84-0aef-495d-9154-8bc4b4a9d7ff');
  });
  test('Should return an error if the uuid does not match the pattern', () => {
    expect(() => uuidValidator('anyString')).toThrow(
      new ValidationError(`The id entered does not match the uuid pattern`),
    );
  });
});
