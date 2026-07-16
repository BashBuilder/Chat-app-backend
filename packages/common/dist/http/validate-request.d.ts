import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodTypeAny } from 'zod';
type Schema = AnyZodObject | ZodTypeAny;
export interface RequestValidationSchemas {
    body?: Schema;
    params?: Schema;
    query?: Schema;
}
export declare const validateRequest: (schemas: RequestValidationSchemas) => (req: Request, res: Response, next: NextFunction) => void;
export {};
//# sourceMappingURL=validate-request.d.ts.map