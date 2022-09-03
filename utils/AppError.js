class AppError extends Error {
    constructor(message, statusCode, type = "error") {
        super(message);
        this.type = type;
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;
