const jwt = require("jsonwebtoken");
const Seller = require("../../../models/sellerModel");
const { isEmail } = require("validator");
const asyncHandler = require("express-async-handler");

exports.registerSeller = asyncHandler(async (req, res) => {
    const { storeName, owner, email, password, address, phone, images } =
        req.body;

    if (!storeName || !owner || !email || password) {
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
        throw new Error(
            "This email address is registered with another account!"
        );
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
    const verificationToken = newUser.generateVerificationToken();

    const saveSeller = newSeller.save();

    if (!saveSeller) {
        res.status(400);
        throw new Error("Oops! Something went wrong");
    }

    return res.status(201).json({
        message: "Please check your email address to verify your account!",
    });
});
