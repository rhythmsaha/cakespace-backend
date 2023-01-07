const AppError = require("../utils/AppError");

const notFound = (req, res, next) => {
  const error = new Error(`invalid request!`);
  res.status(404);
  next(error);
};

const handleCastError = (error) => {
  const message = `Invalid ${error.path}: ${error.value}`;
  return new AppError(message, 400);
};

/**
 *
 * @param {Error} error
 * @param {import { Response } from "express";} res
 * @returns
 */
const handleValidationError = (err, res) => {
  const fields = Object.values(err.errors).map((el) => el.properties);
  let code = 400;
  return res.status(code).send({ type: "validationError", fields });
};

/**
 *
 * @param {Error} error
 * @param {import { Request } from "express";} req
 * @param {import { Response } from "express";} res
 * @param {import { NextFunction } from "express"} next
 * @returns
 */
const errorHandler = (error, req, res, next) => {
  const statusCode = error.statusCode || 500;

  if (error.name === "CastError") error = handleCastError(error);
  if (error.name === "ValidationError") return handleValidationError(error, res);

  res.status(statusCode);
  res.json({
    ...error,
    type: error.type,
    message: error.message,
    stack: process.env.NODE_ENV === "production" ? null : error.stack,
  });

  next();
};

module.exports = { notFound, errorHandler };
