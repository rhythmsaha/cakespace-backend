const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const crypto = require("crypto");

const Seller = new Schema({
    isActive: { type: Boolean, default: true },
    fullName: { type: String, required: "{PATH} is required!", trim: true },
    email: { type: String, required: "{PATH} is required!", index: true, trim: true },
    avatar: { type: String, trim: true },
    salt: { type: String },
    hashed_password: { type: String },
    notificationSettings: {
        orders: { type: Boolean, default: true },
        review: { type: Boolean, default: true },
        lowTock: { type: Boolean, default: true },
    },
    emailSettings: {
        orders: { type: Boolean, default: true },
        review: { type: Boolean, default: true },
        lowTock: { type: Boolean, default: true },
    },
});

Seller.methods.hashPassword = function (password) {
    const salt = crypto.randomBytes(8).toString("hex");
    this.salt = salt;
    this.hashed_password = crypto.pbkdf2Sync(password, salt, 1000, 64, `sha512`).toString(`hex`);
};

// Verify Password Hash
Seller.methods.verifyPassword = function (password) {
    let enteredPasswordHash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, `sha512`).toString(`hex`);
    return this.hashed_password === enteredPasswordHash;
};

module.exports = mongoose.model("Seller", Seller);
