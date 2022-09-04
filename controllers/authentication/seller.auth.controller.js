const jwt = require("jsonwebtoken");
const Seller = require("../../models/seller.model");
const asyncHandler = require("express-async-handler");
const AppError = require("../../utils/AppError");
const { default: validator } = require("validator");
const sendMail = require("../../utils/mailgun");

exports.registerSeller = asyncHandler(async (req, res) => {
    const { fullName, email, password, confirmPassword, avatar } = req.body;

    if (password !== confirmPassword)
        return res.status(400).json([{ field: "confirmPassword", message: "Passwords don't match!" }]);

    const newSeller = new Seller({ fullName, email, password, avatar });

    const saveSeller = await newSeller.save();

    if (!saveSeller) {
        throw new AppError("Something went wrong", 500);
    }

    return res.status(201).json({
        message: "We've sent an OTP to your email address to verify your email address!",
    });
});

exports.loginSeller = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !validator.isEmail(email)) throw new AppError("Please provide a valid email address!", 400, "email");

    const seller = await Seller.findOne({ email });

    if (!seller) throw new AppError("Email doesn't exist!", 404, "email");

    const checkPassword = await seller.verifyPassword(password);

    if (!checkPassword) throw new AppError("Incorrect Password!", 403, "password");

    const JWT_TOKEN = jwt.sign({ role: "ADMIN", type: "AUTH_TOKEN", _id: seller._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
    });

    return res.status(200).json({
        JWT_TOKEN,
        user: {
            fullName: seller.fullName,
            email: seller.email,
            avatar: seller.avatar,
            role: "admin",
        },
        message: "Login Successful!",
    });
});

exports.getMe = asyncHandler(async (req, res) => {
    const { _id, role, type } = req?.user;

    if (type !== "AUTH_TOKEN" && role !== "ADMIN") new AppError("Access Denied!", 403);

    const seller = await Seller.findById(_id);

    if (!seller) new AppError("Account Doesn't exists!", 400);

    const JWT_TOKEN = jwt.sign({ role: "ADMIN", type: "AUTH_TOKEN", _id: seller._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
    });

    return res.status(200).json({
        JWT_TOKEN,
        user: {
            fullName: seller.fullName,
            email: seller.email,
            avatar: seller.avatar,
            role: "admin",
        },
    });
});

exports.forgetSellerPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email || !validator.isEmail(email)) new AppError("Please provide valid email address!", 400);

    const seller = await Seller.findOne({ email });

    if (!seller) new AppError("No user found with this email address!", 404);

    const passwordResetToken = jwt.sign(
        { role: "ADMIN", type: "RESET_PASSWORD", _id: seller._id },
        process.env.JWT_SECRET,
        {
            expiresIn: "1h",
        }
    );

    // Send verification link to user email

    return res.status(200).json({
        message: "We have sent a link to your email to reset your password",
    });
});

exports.resetSellerPassword = asyncHandler(async (req, res) => {
    const { _id, role, type } = req?.user;

    if (type !== "AUTH_TOKEN" && role !== "ADMIN") new AppError("Access Denied!", 403);

    const seller = await Seller.findById(_id);

    if (!seller) new AppError("User not found!", 404);

    const { password, confirmPassword } = req.body;

    if (password !== confirmPassword) return res.status(400).json({ message: "Passwords don't match!" });

    seller.password = password;

    const saveSeller = await newSeller.save();

    if (!saveSeller) new AppError("Oops! Something went wrong", 500);

    return res.status(200).json({
        message: "Password changed successfully!",
    });
});

exports.changeSellerPassword = asyncHandler(async (req, res) => {
    const { _id, role, type } = req?.user;
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (type !== "AUTH_TOKEN" && role !== "ADMIN") new AppError("Access Denied!", 403);

    const seller = await Seller.findById(_id);

    if (!seller) new AppError("User not found!", 404);

    const checkPassword = await seller.verifyPassword(oldPassword);

    if (!checkPassword) return res.status(403).json({ type: "OLD_PASSWORD", message: "Incorrect Password!" });

    if (!newPassword || !confirmPassword)
        return res.status(400).json({ type: "PASSWORD", message: "Passwords Can't be empty!" });

    if (newPassword !== confirmPassword)
        return res.status(400).json({ type: "PASSWORD", message: "Passwords don't match!" });

    seller.password = password;

    const saveSeller = newSeller.save();

    if (!saveSeller) {
        res.status(500);
        throw new Error("Oops! Something went wrong");
    }

    const JWT_TOKEN = jwt.sign({ role: "ADMIN", type: "AUTH_TOKEN", _id: seller._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
    });

    return res.status(201).json({
        JWT_TOKEN,
        message: "Password changed successfully",
    });
});

exports.changeSellerEmail = asyncHandler(async (req, res) => {
    const { _id, role, type } = req?.user;

    if (type !== "AUTH_TOKEN" && role !== "ADMIN")
        return res.status(403).josn({ type: "AUTHORZATON", message: "Access denied!" });

    const seller = await Seller.findById(_id);

    if (!seller) return res.status(404).json({ type: "ACCOUNT", message: "Account Not Found!" });

    const { email } = req.body;

    if (!email || !isEmail(email))
        return res.status(400).json({ type: "EMAIL", message: "Please provide valid email address!" });

    if (seller.email === email)
        return res.status(400).json({ type: "EMAIL", message: "This email address is already added to your account!" });

    // Generate OTP
    // Send email

    res.json({
        message: "Please verify your email address!",
    });
});

exports.updateSellerEmail = asyncHandler(async (req, res) => {
    const { _id, role, type } = req?.user;

    if (type !== "AUTH_TOKEN" && role !== "ADMIN")
        return res.status(403).josn({ type: "AUTHORZATON", message: "Access denied!" });

    const seller = await Seller.findById(_id);

    if (!seller) return res.status(404).json({ type: "ACCOUNT", message: "Account Not Found!" });

    const { code, email } = req.body;
    // Verify OTP

    seller.email = email;

    const saveSeller = await seller.save();

    res.json({
        Type: "UPDATE",
        message: "Updated Successfully!",

        user: {
            fullName: saveSeller.fullName,
            email: saveSeller.email,
            avatar: saveSeller.avatar,
        },
    });
});

exports.updateSellerInfo = asyncHandler(async (req, res) => {
    const { _id, role, type } = req?.user;
    if (type !== "AUTH_TOKEN" && role !== "ADMIN")
        return res.status(403).josn({ type: "AUTHORZATON", message: "Access denied!" });

    const seller = await Seller.findById(_id);

    if (!seller) return res.status(404).json({ type: "ACCOUNT", message: "Account Not Found!" });

    const { fullName, avatar } = req.body;

    seller.fullName = fullName;
    seller.avatar = avatar;

    const saveSeller = await seller.save();

    res.json({
        Type: "UPDATE",
        message: "Updated Successfully!",

        user: {
            fullName: saveSeller.fullName,
            email: saveSeller.email,
            avatar: saveSeller.avatar,
        },
    });
});
