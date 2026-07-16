const toError = (error) => {
    return error instanceof Error ? error : new Error(String(error));
};
const forwardError = (nextFn, error) => {
    nextFn(toError(error));
};
export const asyncHandler = (handler) => {
    return (req, res, next) => {
        void handler(req, res, next).catch((error) => {
            forwardError(next, error);
        });
    };
};
//# sourceMappingURL=async-handler.js.map