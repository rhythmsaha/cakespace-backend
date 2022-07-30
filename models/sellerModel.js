const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const Seller = new Schema({
    isActive: { type: Boolean, default: true },

    storeName: { type: String, required: "{PATH} is required!", trim: true },

    owner: { type: String, required: "{PATH} is required!", trim: true },

    email: {
        type: String,
        required: "{PATH} is required!",
        index: true,
        trim: true,
    },

    salt: { type: String },

    hashed_password: { type: String },

    verified: { type: Boolean, default: false },

    address: {
        street: { type: String, required: "{PATH} is required!", trim: true },
        area: { type: String, trim: true },
        city: { type: String, required: "{PATH} is required!", trim: true },
        state: { type: String, required: "{PATH} is required!", trim: true },
        postal: { type: String, required: "{PATH} is required!", trim: true },
    },

    phone: { type: String, required: "{PATH} is required!", trim: true },

    images: [{ type: String }],

    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],

    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
});

Seller.methods.hashPassword = function (password) {
    const salt = crypto.randomBytes(8).toString("hex");
    this.salt = salt;
    this.hashed_password = crypto
        .pbkdf2Sync(password, salt, 1000, 64, `sha512`)
        .toString(`hex`);
};

// Verify Password Hash
Seller.methods.verifyPassword = function (password) {
    let enteredPasswordHash = crypto
        .pbkdf2Sync(password, this.salt, 1000, 64, `sha512`)
        .toString(`hex`);
    return this.hashed_password === enteredPasswordHash;
};

// Generate Verification Token
Seller.methods.generateVerificationToken = (salt) => {
    const email = this.email;
    const token = jwt.sign({ email: email }, salt, {
        expiresIn: "1h",
    });

    return token;
};

// Verify Account
Seller.methods.verifyUser = (token) => {
    try {
        const data = jwt.verify(token, this.salt);
        if (data.email === this.email && !this.verified) {
            this.verified = true;
        }
        return true;
    } catch (error) {
        return false;
    }
};

module.exports = mongoose.model("Seller", Seller);
