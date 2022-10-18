const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");
const expressAsyncHandler = require("express-async-handler");

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
exports.authorize = expressAsyncHandler(async (req, res, next) => {
  if (!req.headers.authorization) throw new AppError("Acccess Denied!", 403, "authorization");

  try {
    const token = req.headers.authorization.split(" ")[1];
    const JWT_DATA = jwt.verify(token, process.env.JWT_SECRET);

    if (JWT_DATA?.role === "USER" || JWT_DATA?.role === "GUEST" || JWT_DATA?.role === "ADMIN") {
      req.user = JWT_DATA;
    } else {
      throw new AppError("Acccess Denied!", 403, "authorization");
    }
    next();
  } catch (error) {
    throw new AppError("Acccess Denied!", 403, "authorization");
  }
});

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
exports.publicAccess = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const JWT_DATA = jwt.verify(token, process.env.JWT_SECRET);
    req.user = JWT_DATA;
    next();
  } catch (error) {
    req.user = { role: "GUEST", type: "ACCESS" };
    next();
  }
};
