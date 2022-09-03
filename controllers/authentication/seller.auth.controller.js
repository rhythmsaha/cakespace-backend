const jwt = require("jsonwebtoken");
const Seller = require("../../models/seller.model");
const asyncHandler = require("express-async-handler");
const AppError = require("../../utils/AppError");
const { default: validator } = require("validator");

exports.registerSeller = asyncHandler(async (req, res) => {
    const { fullName, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) return res.status(400).json({ message: "Passwords don't match!" });

    const newSeller = new Seller({ fullName, email, password });

    const saveSeller = await newSeller.save();

    if (!saveSeller) {
        throw new AppError("Oops! Something went wrong", 500);
    }

    return res.status(201).json({
        message: "Account Created!",
    });
});

exports.loginSeller = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !validator.isEmail(email))
        return res.status(403).json({ type: "EMAIL", message: "Please provide valid email address!" });

    const seller = await Seller.findOne({ email });

    if (!seller) return res.status(403).json({ type: "EMAIL", message: "Account not found!" });

    const checkPassword = await seller.verifyPassword(password);

    if (!checkPassword) return res.status(403).json({ type: "PASSWORD", message: "Incorrect Password!" });

    const JWT_TOKEN = jwt.sign({ role: "ADMIN", type: "AUTH_TOKEN", _id: seller._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
    });

    return res.status(200).json({
        JWT_TOKEN,
        user: {
            fullName: seller.fullName,
            email: seller.email,
            avatar: seller.avatar,
        },
        message: "Login Successfull!",
    });
});

exports.getMe = asyncHandler(async (req, res) => {
    const { _id, role, type } = req?.user;

    if (type !== "AUTH_TOKEN" && role !== "ADMIN")
        return res.status(403).josn({ type: "AUTHORZATON", message: "Access denied!" });

    const seller = await Seller.findById(_id);

    if (!seller) return res.status(404).json({ type: "ACCOUNT", message: "Account Not Found!" });

    const JWT_TOKEN = jwt.sign({ role: "ADMIN", type: "AUTH_TOKEN", _id: seller._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
    });

    return res.status(200).json({
        JWT_TOKEN,
        user: {
            fullName: seller.fullName,
            email: seller.email,
            avatar: seller.avatar,
        },
    });
});

exports.forgetSellerPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email || !validator.isEmail(email))
        return res.status(400).json({ type: "EMAIL", message: "Please provide valid email address!" });

    const seller = await Seller.findOne({ email });
    if (!seller) return res.status(404).json({ message: "User not found!" });

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

    if (type !== "RESET_PASSWORD" && role !== "ADMIN")
        return res.status(403).josn({ type: "AUTHORZATON", message: "Access denied!" });

    const seller = await Seller.findById(_id);
    if (!seller) return res.status(404).json({ message: "User not found!" });

    const { password, confirmPassword } = req.body;

    if (!password || !confirmPassword)
        return res.status(400).json({ type: "PASSWORD", message: "Password Can't be empty!" });

    if (password !== confirmPassword)
        return res.status(400).json({ type: "PASSWORD", message: "Passwords don't match!" });

    seller.password = password;

    const saveSeller = await newSeller.save();

    if (!saveSeller) {
        res.status(500);
        throw new Error("Oops! Something went wrong");
    }

    return res.status(200).json({
        message: "Password changed successfully",
    });
});

exports.changeSellerPassword = asyncHandler(async (req, res) => {
    const { _id, role, type } = req?.user;
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (type !== "AUTH_TOKEN" && role !== "ADMIN")
        return res.status(403).josn({ type: "AUTHORZATON", message: "Access denied!" });

    const seller = await Seller.findById(_id);

    if (!seller) return res.status(404).json({ type: "ACCOUNT", message: "Account Not Found!" });

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
