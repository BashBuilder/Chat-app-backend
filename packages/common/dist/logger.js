import pino from "pino";
export const createLogger = (options) => {
    const { name, ...rest } = options;
    const transport = process.env.NODE_ENV === "development"
        ? {
            target: "pino-pretty",
            options: {
                colorize: true,
                translateTime: "SYS:standard",
            },
        }
        : undefined;
    return pino({
        name,
        level: process.env.LOG_LEVEL || "info",
        transport,
        ...rest,
    });
};
//# sourceMappingURL=logger.js.map