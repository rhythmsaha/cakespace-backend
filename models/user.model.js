const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { isLength, isAlpha, isEmail } = require("validator");
const jwt = require("jsonwebtoken");

const User = new Schema(
    {
        firstname: {
            type: String,
            required: "{PATH} is required!",
            trim: true,
            validate(value) {
                if (!isLength(value, [{ min: 2, max: 30 }])) throw new Error("minimum 2 characters required");

                if (!isAlpha(value)) throw new Error("only alphabets allowed");
            },
        },

        middlename: { type: String, trim: true },

        lastname: {
            type: String,
            required: "{PATH} is required!",
            trim: true,
            validate(value) {
                if (!isLength(value, [{ min: 2, max: 30 }])) throw new Error("minimum 2 characters required");

                if (!isAlpha(value)) throw new Error("only alphabets allowed");
            },
        },

        email: {
            type: String,
            required: "{PATH} is required!",
            index: true,
            trim: true,
            validate(value) {
                if (!isEmail(value)) throw new Error("Invalid email address");
            },
        },

        salt: { type: String },
        hashed_password: { type: String },

        verified: {
            type: Boolean,
            default: false,
        },

        addresses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Address" }],
        orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
        cart: { type: mongoose.Schema.Types.ObjectId, ref: "Cart" },
    },
    { timestamps: true }
);

// Generate Password Hash
User.methods.hashPassword = function (password) {
    const salt = crypto.randomBytes(8).toString("hex");
    this.salt = salt;
    this.hashed_password = crypto.pbkdf2Sync(password, salt, 1000, 64, `sha512`).toString(`hex`);
};

// Verify Password Hash
User.methods.verifyPassword = function (password) {
    let enteredPasswordHash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, `sha512`).toString(`hex`);
    return this.hashed_password === enteredPasswordHash;
};

// Generate Verification Token
User.methods.generateVerificationToken = () => {
    const token = jwt.sign({ email: this.email }, this.salt, {
        expiresIn: "1h",
    });

    return token;
};

// Verify Account
User.methods.verifyUser = (token) => {
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

module.exports = mongoose.model("User", User);
