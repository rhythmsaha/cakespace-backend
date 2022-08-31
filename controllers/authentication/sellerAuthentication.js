const jwt = require("jsonwebtoken");
const Seller = require("../../models/sellerModel");
const { isEmail } = require("validator");
const asyncHandler = require("express-async-handler");
const { forgetPassword } = require("../../utils/forgetPassword");

exports.registerSeller = asyncHandler(async (req, res) => {
    const { fullName, email, password, confirmPasword } = req.body;

    if (!fullName || !email || !password || !confirmPasword)
        return res.status(400).json({ type: "ALL_FIELDS", message: "Please fill the required fields!" });

    if (!email || !isEmail(email))
        return res.status(400).json({ type: "EMAIL", message: "Please provide valid email address!" });

    if (!password || !confirmPasword)
        return res.status(400).json({ type: "PASSWORD", message: "Password Can't be empty!" });

    if (password !== confirmPasword)
        return res.status(400).json({ type: "PASSWORD", message: "Passwords don't match!" });

    const seller = await Seller.findOne({ email: email });

    if (seller) return res.status(400).json({ type: "ACCOUNT", message: "Account already exists!" });

    const newSeller = new Seller({ fullName, email });

    newSeller.hashPassword(password);

    const saveSeller = newSeller.save();

    if (!saveSeller) {
        res.status(500);
        throw new Error("Oops! Something went wrong");
    }

    return res.status(201).json({
        message: "Account Created!",
    });
});

exports.loginSeller = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !isEmail(email))
        return res.status(403).json({ type: "EMAIL", message: "Please provide valid email address!" });

    const seller = await Seller.findOne({ email });

    if (!seller) return res.status(403).json({ type: "EMAIL", message: "Please provide valid email address!" });

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
    const { _id } = req.storeData;
    const seller = await Seller.findById(_id);

    if (!seller) return res.status(404).json({ message: "Account Not Found!" });

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
    const { password, confirmPasword, token } = req.body;
    if (password !== confirmPasword) return res.status(400).json({ message: "Passwords didn't match!" });
});
