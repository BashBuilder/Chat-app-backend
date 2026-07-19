import { ZodError } from 'zod';
import { HttpError } from '../errors/http-error';
const formatedError = (error) => error.errors.map((issue) => ({
    path: issue.path.join('.'),
    message: issue.message,
}));
export const validateRequest = (schemas) => {
    return (req, res, next) => {
        try {
            if (schemas.body) {
                const parsedBody = schemas.body.parse(req.body);
                req.body = parsedBody;
                req.validated = {
                    body: parsedBody,
                };
            }
            if (schemas.params) {
                const parsedParams = schemas.params.parse(req.params);
                req.params = parsedParams;
                req.validated = {
                    params: parsedParams,
                };
            }
            if (schemas.query) {
                const parsedQuery = schemas.query.parse(req.query);
                req.validated = {
                    query: parsedQuery,
                };
            }
            next();
        }
        catch (error) {
            if (error instanceof ZodError) {
                next(new HttpError(422, 'Validation Error', {
                    issues: formatedError(error),
                }));
                return;
            }
            return next(error);
        }
    };
};
//# sourceMappingURL=validate-request.js.map