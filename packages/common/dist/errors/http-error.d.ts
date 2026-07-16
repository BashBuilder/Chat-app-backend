export declare class HttpError extends Error {
    readonly statusCode: number;
    readonly details?: Record<string, unknown> | undefined;
    constructor(statusCode: number, message: string, details?: Record<string, unknown> | undefined);
}
export declare class BadRequestError extends HttpError {
    constructor(message?: string, details?: Record<string, unknown>);
}
export declare class UnauthorizedError extends HttpError {
    constructor(message?: string, details?: Record<string, unknown>);
}
export declare class ForbiddenError extends HttpError {
    constructor(message?: string, details?: Record<string, unknown>);
}
export declare class NotFoundError extends HttpError {
    constructor(message?: string, details?: Record<string, unknown>);
}
export declare class ConflictError extends HttpError {
    constructor(message?: string, details?: Record<string, unknown>);
}
export declare class ValidationError extends HttpError {
    constructor(message?: string, details?: Record<string, unknown>);
}
export declare class TooManyRequestsError extends HttpError {
    constructor(message?: string, details?: Record<string, unknown>);
}
export declare class InternalServerError extends HttpError {
    constructor(message?: string, details?: Record<string, unknown>);
}
export declare class NotImplementedError extends HttpError {
    constructor(message?: string, details?: Record<string, unknown>);
}
export declare class BadGatewayError extends HttpError {
    constructor(message?: string, details?: Record<string, unknown>);
}
export declare class ServiceUnavailableError extends HttpError {
    constructor(message?: string, details?: Record<string, unknown>);
}
export declare class GatewayTimeoutError extends HttpError {
    constructor(message?: string, details?: Record<string, unknown>);
}
//# sourceMappingURL=http-error.d.ts.map