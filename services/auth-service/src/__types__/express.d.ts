declare global {
  namespace Express {
    interface Request {
      validated?: {
        query?: Record<string, unknown>;
        body?: Record<string, unknown>;
        params?: Record<string, unknown>;
      };
    }
  }
}

export {};
