const jwt = require("jsonwebtoken");
const Seller = require("../../models/seller.model");
const asyncHandler = require("express-async-handler");
const AppError = require("../../utils/AppError");
const { default: validator } = require("validator");
const sendMail = require("../../utils/mailgun");

exports.registerSeller = asyncHandler(async (req, res) => {
    const { fullName, email, password, confirmPassword, avatar } = req.body;

    if (password !== confirmPassword) {
        return res.status(400).json({
            type: "validationError",
            fields: [{ field: "confirmPassword", message: "Passwords don't match!" }],
        });
    }

    const newSeller = new Seller({ fullName, email, password, avatar });

    const saveSeller = await newSeller.save();

    if (!saveSeller) {
        throw new AppError("Something went wrong", 500, "serverError");
    }

    return res.status(201).json({
        message: "We've sent an OTP to your email address to verify your email address!",
    });
});

exports.loginSeller = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !validator.isEmail(email)) {
        throw new AppError("Please provide a valid email address!", 400, "email");
    }

    const seller = await Seller.findOne({ email });

    if (!seller) {
        throw new AppError("Email doesn't exist!", 404, "email");
    }

    const checkPassword = await seller.verifyPassword(password);

    if (!checkPassword) {
        throw new AppError("Incorrect Password!", 403, "password");
    }

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
            notificationSettings: seller.notificationSettings,
            emailSettings: seller.emailSettings,
        },
        message: "Login Successful!",
    });
});

exports.getMe = asyncHandler(async (req, res) => {
    const { _id, role, type } = req?.user;

    if (type !== "AUTH_TOKEN" && role !== "ADMIN") {
        throw new AppError("Access Denied!", 403, "authorization");
    }

    const seller = await Seller.findById(_id);

    if (!seller) {
        throw new AppError("Access Denied!", 403, "authorization");
    }

    const JWT_TOKEN = jwt.sign({ role: "ADMIN", type: "AUTH_TOKEN", _id: seller._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
    });

    return res.status(200).json({
        JWT_TOKEN,
        user: {
            role: "admin",
            fullName: seller.fullName,
            email: seller.email,
            avatar: seller.avatar,

            notificationSettings: seller.notificationSettings,
            emailSettings: seller.emailSettings,
        },
    });
});

exports.forgetSellerPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email || !validator.isEmail(email)) {
        throw new AppError("Please provide valid email address!", 400, "email");
    }
    const seller = await Seller.findOne({ email });

    if (!seller) {
        throw new AppError("No account found with this email address!", 404, "email");
    }

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

    if (type !== "AUTH_TOKEN" && role !== "ADMIN") {
        throw new AppError("Access Denied!", 403, "authorization");
    }

    const seller = await Seller.findById(_id);

    if (!seller) {
        throw new AppError("Access Denied!", 403, "authorization");
    }

    const { password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        throw new AppError("Passwords don't match!", 400, "confirmPassword");
    }

    seller.password = password;

    const saveSeller = await newSeller.save();

    if (!saveSeller) {
        throw new AppError("Something went wrong", 500, "serverError");
    }

    return res.status(200).json({
        message: "Password changed successfully!",
    });
});

exports.changeSellerPassword = asyncHandler(async (req, res) => {
    const { _id, role, type } = req?.user;
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (type !== "AUTH_TOKEN" && role !== "ADMIN") {
        throw new AppError("Access Denied!", 403, "authorization");
    }

    const seller = await Seller.findById(_id);

    if (!seller) {
        throw new AppError("Access Denied!", 403, "authorization");
    }

    const checkPassword = await seller.verifyPassword(oldPassword);

    if (!checkPassword) {
        throw new AppError("Incorrect Password!", 403, "oldPassword");
    }

    if (!newPassword || newPassword.length < 6) {
        throw new AppError("Password must be atleast 6 characters long!", 400, "passwords");
    }

    if (newPassword !== confirmPassword) {
        throw new AppError("Passwords don't match!", 400, "confirmPassword");
    }

    seller.password = newPassword;

    const saveSeller = seller.save();

    if (!saveSeller) {
        throw new AppError("Something went wrong", 500, "serverError");
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

    if (type !== "AUTH_TOKEN" && role !== "ADMIN") {
        throw new AppError("Access Denied!", 403, "authorization");
    }

    const seller = await Seller.findById(_id);

    if (!seller) {
        throw new AppError("Access Denied!", 403, "authorization");
    }

    const { email } = req.body;

    if (!email || !validator.isEmail(email)) {
        throw new AppError("Please provide valid email address!", 400, "email");
    }

    const findExist = await Seller.findOne({ email: email });

    if (findExist) {
        throw new AppError("This email address is already in use!", 400, "email");
    }

    // Generate OTP
    // Save OTP
    // Send email

    res.json({
        message: "Please verify your email address!",
    });
});

exports.updateSellerEmail = asyncHandler(async (req, res) => {
    const { _id, role, type } = req?.user;

    if (type !== "AUTH_TOKEN" && role !== "ADMIN") {
        throw new AppError("Access Denied!", 403, "authorization");
    }

    const seller = await Seller.findById(_id);

    if (!seller) {
        throw new AppError("Access Denied!", 403, "authorization");
    }

    const { code, email } = req.body;
    // Verify OTP

    seller.email = email;

    const saveSeller = await seller.save();

    if (!saveSeller) {
        throw new AppError("Something went wrong", 500, "serverError");
    }

    res.json({
        Type: "update",
        message: "Updated Successfully!",

        user: {
            fullName: seller.fullName,
            email: seller.email,
            avatar: seller.avatar,
            role: "admin",
            notificationSettings: seller.notificationSettings,
            emailSettings: seller.emailSettings,
        },
    });
});

exports.updateSellerInfo = asyncHandler(async (req, res) => {
    const { _id, role, type } = req?.user;

    if (type !== "AUTH_TOKEN" && role !== "ADMIN") {
        throw new AppError("Access Denied!", 403, "authorization");
    }

    const seller = await Seller.findById(_id);

    if (!seller) {
        throw new AppError("Access Denied!", 403, "authorization");
    }

    const { fullName, avatar } = req.body;

    seller.fullName = fullName;

    if (avatar) {
        seller.avatar = avatar;
    }

    const saveSeller = await seller.save();

    if (!saveSeller) {
        throw new AppError("Something went wrong", 500, "serverError");
    }

    res.json({
        message: "Updated Successfully!",
        user: {
            fullName: saveSeller.fullName,
            email: saveSeller.email,
            avatar: saveSeller.avatar,
            role: "admin",
            notificationSettings: saveSeller.notificationSettings,
            emailSettings: saveSeller.emailSettings,
        },
    });
});

exports.updateNotificationSettings = asyncHandler(async (req, res) => {
    const { _id, role, type } = req?.user;

    if (type !== "AUTH_TOKEN" && role !== "ADMIN") {
        throw new AppError("Access Denied!", 403, "authorization");
    }

    const seller = await Seller.findById(_id);

    if (!seller) {
        throw new AppError("Access Denied!", 403, "authorization");
    }

    const { appOrders, appReviews, appStock, emailOrders, emailReviews, emailStock } = req.body;

    seller.notificationSettings.orders = appOrders;
    seller.notificationSettings.review = appReviews;
    seller.notificationSettings.lowStock = appStock;
    seller.emailSettings.orders = emailOrders;
    seller.emailSettings.review = emailReviews;
    seller.emailSettings.lowStock = emailStock;

    const saveSeller = await seller.save();

    if (!saveSeller) {
        throw new AppError("Something went wrong", 500, "serverError");
    }

    res.json({
        message: "Updated Successfully!",
        user: {
            fullName: saveSeller.fullName,
            email: saveSeller.email,
            avatar: saveSeller.avatar,
            role: "admin",
            notificationSettings: saveSeller.notificationSettings,
            emailSettings: saveSeller.emailSettings,
        },
    });
});
