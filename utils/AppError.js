class AppError extends Error {
    constructor(message, statusCode, type = undefined) {
        super(message);
        this.type = type;
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;
