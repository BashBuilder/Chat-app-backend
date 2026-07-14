import type { Logger, LoggerOptions } from "pino";
type CreateLoggerOptions = LoggerOptions & {
    name: string;
};
export declare const createLogger: (options: CreateLoggerOptions) => Logger;
export {};
//# sourceMappingURL=logger.d.ts.map