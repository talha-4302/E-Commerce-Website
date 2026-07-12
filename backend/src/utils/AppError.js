// Thrown for expected/business-rule failures (not found, invalid credentials, bad input).
// statusCode defaults to 200 to match this API's existing contract: the frontend reads
// response.data.success/message rather than HTTP status. Pass a real statusCode only if
// the frontend is updated to handle non-2xx responses.
class AppError extends Error {
    constructor(message, statusCode = 200) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

export default AppError;
