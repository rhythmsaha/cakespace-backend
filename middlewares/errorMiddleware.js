const AppError = require("../utils/AppError");

const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

const handleCastError = (error) => {
    const message = `Invalid ${error.path}: ${error.value}`;
    return new AppError(message, 400);
};

const handleValidationError = (err, res) => {
    const fields = Object.values(err.errors).map((el) => ({ field: el.path, message: el.message }));
    let code = 400;
    res.status(code).send({ type: "validationError", fields });
};

const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const status = err.status || "error";

    if (err.name === "CastError") error = handleCastError(error);
    if (err.name === "ValidationError") return (err = handleValidationError(err, res));

    res.status(statusCode);
    res.json({
        type: err?.type,
        status: status,
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
    });
};

module.exports = { notFound, errorHandler };
