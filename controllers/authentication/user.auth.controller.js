const jwt = require("jsonwebtoken");
const UserMoodel = require("../../models/user.model");
const { isEmail } = require("validator");
const asyncHandler = require("express-async-handler");

exports.registerUser = asyncHandler(async (req, res) => {
    const { firstname, middlename, lastname, email, password } = req.body;

    if (!firstname || !lastname || !email || !password) {
        res.status(400);
        throw new Error("Please fill the required fields!");
    }

    if (!isEmail(email)) {
        res.status(400);
        throw new Error("Please provide valid email address!");
    }

    const _user = await UserMoodel.findOne({ email });

    if (_user && _user.verified) {
        res.status(400);
        throw new Error("This email address is registered with another account!");
    }

    if (_user && !_user.verified) {
        res.status(400);
        throw new Error("Please verify your account!");
    }

    const user = new UserModel({
        firstname,
        middlename,
        lastname,
        email,
    });

    user.hashPassword(password);

    const verificationToken = user.generateVerificationToken();

    const saveUser = user.save();

    if (!saveUser) {
        res.status(400);
        throw new Error("Oops! Something went wrong");
    }

    return res.status(201).json({
        message: "Please check your email address to verify your account!",
    });
});

exports.loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !isEmail(email)) {
        res.status(400);
        throw new Error("Please provide valid email address!");
    }

    const user = await UserMoodel.findOne({ email });

    if (!user) {
        res.status(403);
        throw new Error("Invalid email address!");
    }

    if (!user.verified) {
        res.status(403);
        throw new Error("Account isn't verified!");
    }

    const checkPassword = await user.verifyPassword(password);

    if (!checkPassword) {
        res.status(403);
        throw new Error("Incorrect Password!");
    }

    const JWT_TOKEN = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
    });

    return res.status(200).json({ JWT_TOKEN, message: "Login Successfull!" });
});

exports.getUser = asyncHandler(async (req, res) => {
    const { _id } = req.userData;
    const user = await UserModel.findById(_id);

    if (!user) return res.status(404).json({ message: "Account Not Found!" });

    return res.status(200).json({
        firstname: user.firstname,
        middlename: user.middlename,
        lastname: user.lastname,
        email: user.email,
    });
});

exports.verifyUser = asyncHandler(async (req, res) => {});
exports.userVerificationLink = asyncHandler(async (req, res) => {});

exports.forgetUserPassword = asyncHandler(async (req, res) => {});
exports.resetUserPassword = asyncHandler(async (req, res) => {});
