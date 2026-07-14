export const createEnv = (schema, options = {}) => {
    const { source = process.env, serviceName = "service" } = options;
    const parsed = schema.safeParse(source);
    if (!parsed.success) {
        const formatedErrors = parsed.error.format();
        throw new Error(`[${serviceName}] Environment variable validation failed : ${JSON.stringify(formatedErrors)} `);
    }
    return parsed.data;
};
//# sourceMappingURL=env.js.map