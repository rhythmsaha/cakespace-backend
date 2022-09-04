const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

const handleValidationError = (err, res) => {
    const fields = Object.values(err.errors).map((el) => ({ field: el.path, message: el.message }));
    let code = 400;
    res.status(code).send({ message: "validationError", fields });
};

const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;

    if (err.name === "ValidationError") return (err = handleValidationError(err, res));

    res.status(statusCode);
    res.json({
        type: err?.type,
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
    });
};

module.exports = { notFound, errorHandler };
