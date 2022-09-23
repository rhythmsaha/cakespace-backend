const jwt = require("jsonwebtoken");
const { default: validator } = require("validator");
const asyncHandler = require("express-async-handler");
const FormError = require("../../utils/formError");
const User = require("../../models/user.model");
const AppError = require("../../utils/AppError");

exports.registerUser = asyncHandler(async (req, res) => {
    const { firstname, lastname, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        throw new FormError("Passwords don't match!", 400, "validationError", [
            {
                message: "Passwords don't match!",
                type: "validationError",
                path: "confirmPassword",
                value: confirmPassword,
            },
        ]);
    }

    const _user = new User({ firstname, lastname, email, password });

    const user = _user.save();

    if (!user) {
        throw new AppError("Something went wrong", 500, "serverError");
    }

    return res.status(201).json({
        message: "Please check your email address to verify your account!",
    });
});

exports.loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !validator.isEmail(email)) {
        throw new FormError("Please provide a valid email address!", 400, "validationError", [
            {
                message: "Please provide a valid email address!",
                type: "validationError",
                path: "email",
                value: email,
            },
        ]);
    }

    const user = await User.findOne({ email });

    if (!user) {
        throw new FormError("Email doesn't exist!", 404, "validationError", [
            {
                message: "Email doesn't exist!",
                type: "validationError",
                path: "email",
                value: email,
            },
        ]);
    }

    if (!user.verified) {
        throw new FormError("Email isn't verified!", 404, "verificationError", [
            {
                message: "Email isn't verified!",
                type: "verificationError",
                path: "email",
                value: email,
            },
        ]);
    }

    const checkPassword = await user.verifyPassword(password);

    if (!checkPassword) {
        throw new FormError("Incorrect Password!", 403, "validationError", [
            {
                message: "Incorrect Password!",
                type: "validationError",
                path: "password",
                value: password,
            },
        ]);
    }

    const JWT_TOKEN = createJWT({ role: "USER", type: "AUTH_TOKEN", _id: user._id }, "1d");

    return res.status(200).json({
        message: "Login Successfull!",
        authToken: JWT_TOKEN,
    });
});

exports.getUser = asyncHandler(async (req, res) => {
    const { _id, role, type } = req?.user;
    if (type !== "AUTH_TOKEN" && role !== "USER") throw new AppError("Access Denied!", 403, "authorization");

    const user = await User.findById(_id);

    if (!user) throw new AppError("Access Denied!", 403, "authorization");

    return res.status(200).json({
        authToken: JWT_TOKEN,
        user: {
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
        },
    });
});

exports.verifyUser = asyncHandler(async (req, res) => {});
exports.userVerificationLink = asyncHandler(async (req, res) => {});

exports.forgetUserPassword = asyncHandler(async (req, res) => {});
exports.resetUserPassword = asyncHandler(async (req, res) => {});
