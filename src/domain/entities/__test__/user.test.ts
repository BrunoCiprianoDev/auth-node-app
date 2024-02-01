import { ValidationError } from '@src/domain/util/errors/validationErrors';
import { User } from '../auth/user';

describe('User entity tests', () => {
  test('Must return a user instance successfully', () => {
    const userData = {
      id: '09e10f59-0e4a-4248-8f37-1f19f7258c5e',
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: 'p@ssw0rd!@#$',
    };

    const sut = new User(userData);

    expect(sut).toEqual(expect.objectContaining(userData));
  });

  test('Should return Error create a user if the id does not match the pattern', () => {
    const userData = {
      id: 'anyString',
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: 'p@ssw0rd!@#$',
    };

    expect(() => new User(userData)).toThrow(new ValidationError(`The id entered does not match the uuid pattern`));
  });

  test('It should return an error when trying to set an invalid id', () => {
    const userData = {
      id: '09e10f59-0e4a-4248-8f37-1f19f7258c5e',
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: 'p@ssw0rd!@#$',
    };

    const sut = new User(userData);

    expect(() => (sut.id = 'anyString')).toThrow(new ValidationError(`The id entered does not match the uuid pattern`));
  });

  test('It should return an error if the email does not match the pattern', () => {
    const userData = {
      id: '09e10f59-0e4a-4248-8f37-1f19f7258c5e',
      name: 'John Doe',
      email: 'Any string',
      password: 'p@ssw0rd!@#$',
    };

    expect(() => new User(userData)).toThrow(new ValidationError(`Invalid email`));
  });

  test('It should return an error when trying to set an invalid email', () => {
    const userData = {
      id: '09e10f59-0e4a-4248-8f37-1f19f7258c5e',
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: 'p@ssw0rd!@#$',
    };

    const sut = new User(userData);

    expect(() => (sut.email = 'anyString')).toThrow(new ValidationError(`Invalid email`));
  });

  test('It should return an error if the password does not match the pattern', () => {
    const userData = {
      id: '09e10f59-0e4a-4248-8f37-1f19f7258c5e',
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '',
    };

    expect(() => new User(userData)).toThrow(new ValidationError(`The password must be at least 8 characters long.`));
  });

  test('It should return an error when trying to set an invalid password', () => {
    const userData = {
      id: '09e10f59-0e4a-4248-8f37-1f19f7258c5e',
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: 'p@ssw0rd!@#$',
    };

    const sut = new User(userData);

    expect(() => (sut.password = '123')).toThrow(
      new ValidationError(`The password must be at least 8 characters long.`),
    );
  });

  test('It should return an error if the name is empty', () => {
    const userData = {
      id: '09e10f59-0e4a-4248-8f37-1f19f7258c5e',
      name: '',
      email: 'johndoe@email.com',
      password: 'p@ssw0rd!@#$',
    };

    expect(() => new User(userData)).toThrow(new ValidationError(`The value for 'name' must not be empty.`));
  });

  test('It should return an error when trying to set an invalid name', () => {
    const userData = {
      id: '09e10f59-0e4a-4248-8f37-1f19f7258c5e',
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: 'p@ssw0rd!@#$',
    };

    const sut = new User(userData);

    expect(() => (sut.name = '')).toThrow(new ValidationError(`The value for 'name' must not be empty.`));
  });

  test('Must return object of type IUser', () => {
    const user = new User({
      id: '09e10f59-0e4a-4248-8f37-1f19f7258c5e',
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: 'p@ssw0rd!@#$',
    });

    const sut = new User(user.userData);
    expect(sut.userData).toEqual({
      id: '09e10f59-0e4a-4248-8f37-1f19f7258c5e',
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: 'p@ssw0rd!@#$',
    });
  });

  test('Must return object of type IUserReadyOnly', () => {
    const user = new User({
      id: '09e10f59-0e4a-4248-8f37-1f19f7258c5e',
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: 'p@ssw0rd!@#$',
    });

    const sut = new User(user);
    expect(sut.userDataReadyOnly).toEqual({
      id: '09e10f59-0e4a-4248-8f37-1f19f7258c5e',
      name: 'John Doe',
      email: 'johndoe@email.com',
    });
  });
});
