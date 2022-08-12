const jwt = require("jsonwebtoken");
const Seller = require("../../models/sellerModel");
const { isEmail } = require("validator");
const asyncHandler = require("express-async-handler");

exports.registerSeller = asyncHandler(async (req, res) => {
    const { storeName, owner, email, password, address, phone, images } = req.body;

    if (!storeName || !owner || !email || !password) {
        res.status(400);
        throw new Error("Please fill the required fields!");
    }

    if (!email || !isEmail(email)) {
        res.status(400);
        throw new Error("Please provide valid email address!");
    }

    const seller = await Seller.findOne({ email: email });

    if (seller && seller.verified) {
        res.status(400);
        throw new Error("This email address is registered with another account!");
    }

    if (seller && !seller.verified) {
        res.status(400);
        throw new Error("Please verify your account!");
    }

    const newSeller = new Seller({
        storeName,
        owner,
        email,
        address,
        phone,
        images,
    });

    newSeller.hashPassword(password);

    const verificationToken = newSeller.generateVerificationToken(newSeller.salt);

    const saveSeller = newSeller.save();

    if (!saveSeller) {
        res.status(400);
        throw new Error("Oops! Something went wrong");
    }

    return res.status(201).json({
        message: "Please check your email address to verify your account!",
    });
});

exports.loginSeller = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !isEmail(email)) {
        res.status(400);
        throw new Error("Please provide valid email address!");
    }

    const seller = await Seller.findOne({ email });

    if (!seller) {
        res.status(403);
        throw new Error("Invalid email address!");
    }

    if (!seller.verified) {
        res.status(403);
        throw new Error("Account isn't verified!");
    }

    const checkPassword = await seller.verifyPassword(password);

    if (!checkPassword) {
        res.status(403);
        throw new Error("Incorrect Password!");
    }

    const JWT_TOKEN = jwt.sign({ _id: seller._id }, process.env.ADMIN_SECRET, {
        expiresIn: "1d",
    });

    return res.status(200).json({
        JWT_TOKEN,
        user: seller,
        message: "Login Successfull!",
    });
});

exports.getMe = asyncHandler(async (req, res) => {
    const { _id } = req.storeData;
    const seller = await Seller.findById(_id);

    if (!seller) return res.status(404).json({ message: "Account Not Found!" });

    return res.status(200).json({
        user: {
            storename: seller.storeName,
            owner: seller.owner,
            email: seller.email,
            address: seller.address,
            phone: seller.phone,
            images: seller.images,
        },
    });
});

exports.verifyAccount = asyncHandler(async (req, res) => {
    const { token, email } = req.query;
    if (!token) {
        res.status(400);
        throw new Error("Token is required!");
    }

    const seller = await Seller.findOne({ email });

    if (!seller) {
        res.status(400);
        throw new Error("Account doesn't exist!");
    }

    if (seller.verified) {
        res.status(400);
        throw new Error("Account already verified!");
    }

    const verify = seller.verifyUser(token);

    if (!verify) {
        res.status(403);
        throw new Error("Invalid Token!");
    }

    res.status(200).json({
        message: "Successfully verified your account",
    });
});

exports.resendVerificationLink = asyncHandler(async (req, res) => {});

exports.forgetSellerPassword = asyncHandler(async (req, res) => {});
exports.resetSellerPassword = asyncHandler(async (req, res) => {});

exports.deleteStore = asyncHandler(async (req, res) => {});
