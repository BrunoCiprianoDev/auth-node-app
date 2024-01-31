import { BadRequestError } from '../../errors/appErrors';
import { notEmptyValidator } from '../notEmpty';

describe('Email decorator tests', () => {
  test('Must return the value if it is valid', () => {
    const sut = notEmptyValidator('anyString', 'attribute_name');
    expect(sut).toEqual('anyString');
  });

  test('It should return an error if the string is missing', () => {
    expect(() => notEmptyValidator('', 'attribute_name')).toThrow(
      new BadRequestError(`The value for 'attribute_name' must not be empty.`),
    );
  });
});
