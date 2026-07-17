import { UnauthorizedError } from '../errors/http-error';
const DEFAULT_HEADER_NAME = 'x-internal-token';
export const createInternalAuthMiddleware = (expectedToken, options = {}) => {
    const headerName = options.headerName?.toLowerCase() ?? DEFAULT_HEADER_NAME;
    const exemptPaths = new Set(options.exemptPath ?? []);
    return (req, _, next) => {
        if (exemptPaths.has(req.path)) {
            return next();
        }
        const provided = req.headers[headerName];
        const token = Array.isArray(provided) ? provided[0] : provided;
        if (typeof token !== 'string' || token !== expectedToken) {
            return next(new UnauthorizedError());
        }
        return next();
    };
};
//# sourceMappingURL=internal-auth.js.map