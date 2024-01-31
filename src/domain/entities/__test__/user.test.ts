import { ValidationError } from "@src/domain/util/errors/validationErrors";
import { User } from "../user"

describe('User entity tests', () => {

    test('Must return a user instance successfully', () => {

        const userData = { id: '09e10f59-0e4a-4248-8f37-1f19f7258c5e', name: 'John Doe', email: 'johndoe@email.com', password: 'p@ssw0rd!@#$' }

        const sut = new User(userData);

        expect(sut).toEqual(expect.objectContaining(userData));

    })


    test('Must return a user instance successfully if uuid is empty', () => {

        const userData = { id: '', name: 'John Doe', email: 'johndoe@email.com', password: 'p@ssw0rd!@#$' }

        const sut = new User(userData);

        expect(sut).toEqual(expect.objectContaining(userData));

    })

    test('Should set the attributes of an instance when they are valid', () => {

        const userData = { id: '', name: 'John Doe', email: 'johndoe@email.com', password: 'p@ssw0rd!@#$' }

        const sut = new User(userData);

        sut.id = '09e10f59-0e4a-4248-8f37-1f19f7258c5e';
        sut.name = 'John Doe New';
        sut.email = 'johnDoeNew@emai.com';
        sut.password = 'p@ssw0rd!@$@!WDA2';

        expect(sut).toEqual(expect.objectContaining({
            id: '09e10f59-0e4a-4248-8f37-1f19f7258c5e',
            name: 'John Doe New',
            email: 'johnDoeNew@emai.com',
            password: 'p@ssw0rd!@$@!WDA2'
        }));

    })

    test('Should return Error create a user if the id does not match the pattern', () => {

        const userData = { id: 'anyString', name: 'John Doe', email: 'johndoe@email.com', password: 'p@ssw0rd!@#$' }

        expect(() => new User(userData)).toThrow(new ValidationError(`The id entered does not match the uuid pattern`));

    })

    test('It should return an error when trying to set an invalid id', () => {

        const userData = { id: '', name: 'John Doe', email: 'johndoe@email.com', password: 'p@ssw0rd!@#$' }

        const sut = new User(userData);

        expect(() => sut.id = 'anyString').toThrow(new ValidationError(`The id entered does not match the uuid pattern`));

    })


    test('It should return an error if the email does not match the pattern', () => {

        const userData = { id: '09e10f59-0e4a-4248-8f37-1f19f7258c5e', name: 'John Doe', email: 'Any string', password: 'p@ssw0rd!@#$' }

        expect(() => new User(userData)).toThrow(new ValidationError(`Invalid email`));

    })

    test('It should return an error when trying to set an invalid email', () => {

        const userData = { id: '', name: 'John Doe', email: 'johndoe@email.com', password: 'p@ssw0rd!@#$' }

        const sut = new User(userData);

        expect(() => sut.email = 'anyString').toThrow(new ValidationError(`Invalid email`));

    })


    test('It should return an error if the password does not match the pattern', () => {

        const userData = { id: '09e10f59-0e4a-4248-8f37-1f19f7258c5e', name: 'John Doe', email: 'johndoe@email.com', password: '' }

        expect(() => new User(userData)).toThrow(new ValidationError(`The value for 'password' must not be empty.`));

    })



    test('It should return an error when trying to set an invalid password', () => {

        const userData = { id: '', name: 'John Doe', email: 'johndoe@email.com', password: 'p@ssw0rd!@#$' }

        const sut = new User(userData);

        expect(() => sut.password = '').toThrow(new ValidationError(`The value for 'password' must not be empty.`));

    })


    test('It should return an error if the name is empty', () => {

        const userData = { id: '09e10f59-0e4a-4248-8f37-1f19f7258c5e', name: '', email: 'johndoe@email.com', password: 'p@ssw0rd!@#$' }

        expect(() => new User(userData)).toThrow(new ValidationError(`The value for 'name' must not be empty.`));

    })

    test('It should return an error when trying to set an invalid name', () => {

        const userData = { id: '', name: 'John Doe', email: 'johndoe@email.com', password: 'p@ssw0rd!@#$' }

        const sut = new User(userData);

        expect(() => sut.name = '').toThrow(new ValidationError(`The value for 'name' must not be empty.`));

    })



})