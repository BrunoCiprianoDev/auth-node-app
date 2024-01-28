import { AppError } from "@src/domain/util/errors/appErrors";
import { IResponse } from "../adapters/httpContext";

export default abstract class BaseController {
    protected handleClientErrors(error: unknown): IResponse {
        if (error instanceof AppError) {
            return {
                statusCode: error.code,
                body: {
                    message: error.message,
                },
            };
        }
        return {
            statusCode: 500,
            body: { message: 'Unexpected error occurred.' },
        };
    }
}