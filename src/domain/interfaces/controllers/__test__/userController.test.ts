import { IUserUseCases } from "@src/domain/useCases/userUseCases"
import UserController from "../userController";
import { IHttpContext } from "../../adapters/httpContext";
import { BadRequestError } from "@src/domain/util/errors/appErrors";

describe('UserController test', () => {

    let mockedUserUseCases: jest.Mocked<IUserUseCases>;
    let userController: UserController;
    let mockedHttpContext: jest.Mocked<IHttpContext>;

    beforeAll(() => {
        mockedUserUseCases = {
            createUser: jest.fn()
        }
        userController = new UserController(mockedUserUseCases);
        mockedHttpContext = {
            getRequest: jest.fn(),
            send: jest.fn(),
        };
    })

    describe('Function Create user tests', () => {

        test('It should return a role by id with status code = 200', async () => {

            const responseExpected = {
                id: 'uuid',
                name: 'John Doe',
                email: 'johnDoe@email.com',
            }

            jest.spyOn(mockedUserUseCases, 'createUser').mockResolvedValue(responseExpected);


            (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
                headers: { any: '' },
                body: {
                    name: 'John Doe',
                    email: 'johnDoe@email.com',
                    password: 'johnDoePass@!123',
                    confirmPassword: 'johnDoePass@!123'
                },
            });

            await userController.create(mockedHttpContext);

            expect(mockedHttpContext.send).toHaveBeenCalledWith({
                statusCode: 200,
                body: responseExpected
            });

        })

        test('Must return bad request when UserUseCase returns an error', async () => {
            jest.spyOn(mockedUserUseCases, 'createUser').mockRejectedValue(new BadRequestError('Any string'));

            (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
                headers: { any: '' },
                body: {
                    name: 'John Doe',
                    email: 'johnDoe@email.com',
                    password: 'johnDoePass@!123',
                    confirmPassword: 'johnDoePass@!123'
                },
            });

            await userController.create(mockedHttpContext);

            expect(mockedHttpContext.send).toHaveBeenCalledWith({
                statusCode: 400,
                body: { message: `Any string` },
            });

        })

        test('It should return error 500 if an unexpected error occurs', async () => {
            jest.spyOn(mockedUserUseCases, 'createUser').mockRejectedValue(new Error('Unexpected'));

            (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
                headers: { any: '' },
                body: {
                    name: 'John Doe',
                    email: 'johnDoe@email.com',
                    password: 'johnDoePass@!123',
                    confirmPassword: 'johnDoePass@!123'
                },
            });

            await userController.create(mockedHttpContext);

            expect(mockedHttpContext.send).toHaveBeenCalledWith({
                statusCode: 500,
                body: { message: `Unexpected error occurred.` },
            });
        });

        test('Must handle entries when some attribute is not found', async () => {

            (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
                headers: { any: '' },
                body: {
                },
            });

            await userController.create(mockedHttpContext);

            expect(mockedUserUseCases.createUser).toHaveBeenCalledWith({
                name: '',
                email: '',
                password: '',
                confirmPassword: ''
            })
        })
    });






})