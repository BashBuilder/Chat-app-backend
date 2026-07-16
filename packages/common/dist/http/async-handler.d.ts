import { NextFunction, Request, RequestHandler, Response } from 'express';
export type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<unknown>;
export declare const asyncHandler: (handler: AsyncHandler) => RequestHandler;
//# sourceMappingURL=async-handler.d.ts.map