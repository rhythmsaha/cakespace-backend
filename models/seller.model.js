const mongoose = require("mongoose");
const crypto = require("crypto");
const validator = require("validator");
const AppError = require("../utils/AppError");

const Seller = new mongoose.Schema({
    isActive: {
        type: Boolean,
        default: true,
    },

    fullName: {
        type: String,
        required: "Name is required!",
        trim: true,
        minlength: [2, "Name must me atleast 2 characters long!"],
        validate: [validator.isAlpha, "Name should only contain alphabets!"],
    },

    email: {
        type: String,
        required: "Email is required!",
        unique: [true, "Email is already in use!"],
        index: true,
        trim: true,
        validate: [validator.isEmail, "Please provide valid email address!"],
    },

    avatar: {
        type: String,
        trim: true,
        validate: [validator.isURL, "Image is not supported!"],
    },

    salt: {
        type: String,
    },

    password: {
        type: String,
        minLength: [6, "Password should be at least 6 characters long!"],
    },

    notificationSettings: {
        orders: { type: Boolean, default: true },
        review: { type: Boolean, default: true },
        lowStock: { type: Boolean, default: true },
    },

    emailSettings: {
        orders: { type: Boolean, default: true },
        review: { type: Boolean, default: true },
        lowStock: { type: Boolean, default: true },
    },
});

Seller.pre("save", function (next) {
    if (this.password && this.isModified("password")) {
        this.salt = crypto.randomBytes(8).toString("hex");
        this.password = crypto.pbkdf2Sync(this.password, this.salt, 1000, 64, `sha512`).toString(`hex`);
    }

    next();
});

Seller.post("save", function (error, doc, next) {
    if (error.name === "MongoServerError" && error.code === 11000) {
        next(new AppError("Account already exists!", 409));
    } else {
        next();
    }
});

// Verify Password Hash
Seller.methods.verifyPassword = function (password) {
    let enteredPassword = crypto.pbkdf2Sync(password, this.salt, 1000, 64, `sha512`).toString(`hex`);
    return this.password === enteredPassword;
};

module.exports = mongoose.model("Seller", Seller);
