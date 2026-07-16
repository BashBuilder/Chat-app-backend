export class HttpError extends Error {
    statusCode;
    details;
    constructor(statusCode, message, details) {
        super(message);
        this.statusCode = statusCode;
        this.details = details;
        this.name = new.target.name;
        // Maintains proper stack trace in V8
        Error.captureStackTrace?.(this, this.constructor);
    }
}
export class BadRequestError extends HttpError {
    constructor(message = 'Bad Request', details) {
        super(400, message, details);
    }
}
export class UnauthorizedError extends HttpError {
    constructor(message = 'Unauthorized', details) {
        super(401, message, details);
    }
}
export class ForbiddenError extends HttpError {
    constructor(message = 'Forbidden', details) {
        super(403, message, details);
    }
}
export class NotFoundError extends HttpError {
    constructor(message = 'Resource not found', details) {
        super(404, message, details);
    }
}
export class ConflictError extends HttpError {
    constructor(message = 'Conflict', details) {
        super(409, message, details);
    }
}
export class ValidationError extends HttpError {
    constructor(message = 'Validation failed', details) {
        super(422, message, details);
    }
}
export class TooManyRequestsError extends HttpError {
    constructor(message = 'Too many requests', details) {
        super(429, message, details);
    }
}
export class InternalServerError extends HttpError {
    constructor(message = 'Internal Server Error', details) {
        super(500, message, details);
    }
}
export class NotImplementedError extends HttpError {
    constructor(message = 'Not Implemented', details) {
        super(501, message, details);
    }
}
export class BadGatewayError extends HttpError {
    constructor(message = 'Bad Gateway', details) {
        super(502, message, details);
    }
}
export class ServiceUnavailableError extends HttpError {
    constructor(message = 'Service Unavailable', details) {
        super(503, message, details);
    }
}
export class GatewayTimeoutError extends HttpError {
    constructor(message = 'Gateway Timeout', details) {
        super(504, message, details);
    }
}
//# sourceMappingURL=http-error.js.map