import { RequestHandler } from 'express';
export interface InternalAuthOptions {
    headerName?: string;
    exemptPath?: string;
}
export declare const createInternalAuthMiddleware: (expectedToken: string, options?: InternalAuthOptions) => RequestHandler;
//# sourceMappingURL=internal-auth.d.ts.map