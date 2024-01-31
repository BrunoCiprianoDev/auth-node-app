import { ValidationError } from '@src/domain/util/errors/validationErrors';
import { Role } from '../role';

describe('Role tests', () => {
  test('Must return a role instance successfully', () => {
    const roleData = { id: '09e10f59-0e4a-4248-8f37-1f19f7258c5e', name: 'admin' };

    const sut = new Role(roleData);

    expect(sut).toEqual(expect.objectContaining(roleData));
  });
  test('Should return Error create a user if the id does not match the pattern', () => {
    const roleData = { id: 'anyString', name: 'admin' };

    expect(() => new Role(roleData)).toThrow(
      new ValidationError(`The id entered does not match the uuid pattern`),
    );
  });

  test('It should return an error when trying to set an invalid id', () => {
    const role = new Role({ id: '09e10f59-0e4a-4248-8f37-1f19f7258c5e', name: 'admin' });

    expect(() => (role.id = 'anyString')).toThrow(
      new ValidationError(`The id entered does not match the uuid pattern`),
    );
  });

  test('It should return an error if the name is empty', () => {
    const roleData = { id: '09e10f59-0e4a-4248-8f37-1f19f7258c5e', name: '' };

    expect(() => new Role(roleData)).toThrow(
      new ValidationError(`The value for 'name' must not be empty.`),
    );
  });

  test('It should return an error when trying to set an invalid name', () => {
    const sut = new Role({ id: '09e10f59-0e4a-4248-8f37-1f19f7258c5e', name: 'admin' });

    expect(() => (sut.name = '')).toThrow(
      new ValidationError(`The value for 'name' must not be empty.`),
    );
  });

  test('Must return object of type IRole', () => {
    const role = new Role({ id: '09e10f59-0e4a-4248-8f37-1f19f7258c5e', name: 'admin' });
    expect(role.roleData).toEqual({ id: '09e10f59-0e4a-4248-8f37-1f19f7258c5e', name: 'admin' });
  })
});
