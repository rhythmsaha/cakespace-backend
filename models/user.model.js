const mongoose = require("mongoose");
const crypto = require("crypto");
const { default: validator } = require("validator");
const AppError = require("../utils/AppError");

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: "{PATH} is required!",
      trim: true,
      minlength: [2, "Atleast 2 characters required!"],
      valicate: [!validator.isNumeric, "only alphabets are allowed!"],
    },

    lastName: {
      type: String,
      required: "{PATH} is required!",
      trim: true,
      minlength: [2, "Atleast 2 characters required!"],
      valicate: [!validator.isNumeric, "only alphabets are allowed!"],
    },

    email: {
      type: String,
      required: "Email is required!",
      unique: [true, "Email is already in use!"],
      index: true,
      trim: true,
      validate: [validator.isEmail, "Please provide valid email address!"],
    },

    salt: {
      type: String,
    },

    password: {
      type: String,
      minLength: [6, "Password should be at least 6 characters long!"],
    },

    verified: {
      type: Boolean,
      default: false,
    },

    addresses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Address" }],
    cart: { type: mongoose.Schema.Types.ObjectId, ref: "Cart" },
    notifications: [{ type: mongoose.Schema.Types.ObjectId, ref: "Notification" }],
  },
  { timestamps: true }
);

// Generate Password Hash
UserSchema.pre("save", function (next) {
  if (this.password && this.isModified("password")) {
    this.salt = crypto.randomBytes(8).toString("hex");
    this.password = crypto.pbkdf2Sync(this.password, this.salt, 1000, 64, `sha512`).toString(`hex`);
  }

  next();
});

UserSchema.post("save", function (error, doc, next) {
  if (error.name === "MongoServerError" && error.code === 11000) {
    next(new AppError("Account already exists!", 409));
  } else {
    next();
  }
});

// Verify Password Hash
UserSchema.methods.verifyPassword = function (password) {
  let enteredPassword = crypto.pbkdf2Sync(password, this.salt, 1000, 64, `sha512`).toString(`hex`);
  return this.password === enteredPassword;
};

const User = mongoose.model("User", UserSchema);
module.exports = User;
