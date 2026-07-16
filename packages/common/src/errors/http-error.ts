export class HttpError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = new.target.name;

    // Maintains proper stack trace in V8
    Error.captureStackTrace?.(this, this.constructor);
  }
}

export class BadRequestError extends HttpError {
  constructor(message = 'Bad Request', details?: Record<string, unknown>) {
    super(400, message, details);
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message = 'Unauthorized', details?: Record<string, unknown>) {
    super(401, message, details);
  }
}

export class ForbiddenError extends HttpError {
  constructor(message = 'Forbidden', details?: Record<string, unknown>) {
    super(403, message, details);
  }
}

export class NotFoundError extends HttpError {
  constructor(message = 'Resource not found', details?: Record<string, unknown>) {
    super(404, message, details);
  }
}

export class ConflictError extends HttpError {
  constructor(message = 'Conflict', details?: Record<string, unknown>) {
    super(409, message, details);
  }
}

export class ValidationError extends HttpError {
  constructor(message = 'Validation failed', details?: Record<string, unknown>) {
    super(422, message, details);
  }
}

export class TooManyRequestsError extends HttpError {
  constructor(message = 'Too many requests', details?: Record<string, unknown>) {
    super(429, message, details);
  }
}

export class InternalServerError extends HttpError {
  constructor(message = 'Internal Server Error', details?: Record<string, unknown>) {
    super(500, message, details);
  }
}

export class NotImplementedError extends HttpError {
  constructor(message = 'Not Implemented', details?: Record<string, unknown>) {
    super(501, message, details);
  }
}

export class BadGatewayError extends HttpError {
  constructor(message = 'Bad Gateway', details?: Record<string, unknown>) {
    super(502, message, details);
  }
}

export class ServiceUnavailableError extends HttpError {
  constructor(message = 'Service Unavailable', details?: Record<string, unknown>) {
    super(503, message, details);
  }
}

export class GatewayTimeoutError extends HttpError {
  constructor(message = 'Gateway Timeout', details?: Record<string, unknown>) {
    super(504, message, details);
  }
}
